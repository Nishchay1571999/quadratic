use crate::{
    error::{MpError, Result},
    state::transaction_queue::TransactionQueue,
};
use quadratic_core::{
    controller::{operations::operation::Operation, GridController},
    grid::{
        file::{export_vec, import, CURRENT_VERSION},
        Grid,
    },
};
use quadratic_rust_shared::aws::{
    s3::{download_object, upload_object},
    Client,
};
use quadratic_rust_shared::quadratic_api::set_file_checkpoint;
use tokio::sync::Mutex;
use uuid::Uuid;

/// Load a .grid file
pub(crate) fn load_file(file: &str) -> Result<Grid> {
    import(file).map_err(|e| MpError::FileService(e.to_string()))
}

/// Exports a .grid file
pub(crate) fn export_file(grid: &mut Grid) -> Result<Vec<u8>> {
    export_vec(grid).map_err(|e| MpError::FileService(e.to_string()))
}

/// Apply a vec of operations to the grid
pub(crate) fn apply_transaction(grid: &mut GridController, operations: Vec<Operation>) {
    grid.server_apply_transaction(operations)
}

/// Exports a .grid file
pub(crate) async fn get_and_load_object(
    client: &Client,
    bucket: &str,
    key: &str,
    sequence_num: u64,
) -> Result<GridController> {
    let file = download_object(client, bucket, key).await?;
    let body = file
        .body
        .collect()
        .await
        .map_err(|e| MpError::FileService(e.to_string()))?
        .into_bytes();
    let body = std::str::from_utf8(&body).map_err(|e| MpError::FileService(e.to_string()))?;
    let grid = load_file(body)?;

    Ok(GridController::from_grid(grid, sequence_num))
}

pub(crate) fn key(file_id: Uuid, sequence: u64) -> String {
    format!("{file_id}-{sequence}.grid")
}

/// Load a file from S3, add it to memory, process transactions and upload it back to S3
pub(crate) async fn process_transactions(
    client: &Client,
    bucket: &str,
    file_id: Uuid,
    checkpoint_sequence_num: u64,
    final_sequence_num: u64,
    operations: Vec<Operation>,
) -> Result<u64> {
    let mut grid = get_and_load_object(
        client,
        bucket,
        &key(file_id, checkpoint_sequence_num),
        checkpoint_sequence_num,
    )
    .await?;

    apply_transaction(&mut grid, operations);
    let body = export_file(grid.grid_mut())?;

    let key = key(file_id, final_sequence_num);
    upload_object(client, bucket, &key, &body).await?;

    Ok(final_sequence_num)
}

/// Process outstanding transactions in the queue
pub(crate) async fn process_queue_for_room(
    client: &Client,
    bucket: &str,
    transaction_queue: &Mutex<TransactionQueue>,
    file_id: &Uuid,
    checkpoint_sequence_num: u64,
    base_url: &str,
    jwt: &str,
) -> Result<Option<u64>> {
    // this is an expensive lock since we're waiting for the file to write to S3 before unlocking
    let mut transaction_queue = transaction_queue.lock().await;
    let transactions = transaction_queue
        .get_pending(*file_id)
        .unwrap_or_else(|_| vec![]);

    if transactions.is_empty() {
        return Ok(None);
    }
    tracing::info!(
        "Found {} transactions for room {file_id}",
        transactions.len()
    );

    let first_sequence_num = transactions.first().unwrap().sequence_num;
    let last_sequence_num = transactions.last().unwrap().sequence_num;

    // combine all operations into a single vec
    let operations = transactions
        .into_iter()
        .flat_map(|transaction| {
            tracing::info!(
                "Processing transaction {}, sequence number {} for room {file_id}",
                transaction.id,
                transaction.sequence_num
            );

            transaction.operations
        })
        .collect::<Vec<Operation>>();

    // process the transactions and save the file to S3
    process_transactions(
        client,
        bucket,
        *file_id,
        checkpoint_sequence_num,
        last_sequence_num,
        operations,
    )
    .await?;

    // remove transactions from the queue
    // TODO(ddimaria): this assumes the queue was locked the whole time, confirm this is true
    transaction_queue.complete_transactions(*file_id)?;

    // update the checkpoint in quadratic-api
    let key = &key(*file_id, last_sequence_num);
    set_file_checkpoint(
        base_url,
        jwt,
        file_id,
        last_sequence_num,
        CURRENT_VERSION.into(),
        key.to_owned(),
        bucket.to_owned(),
    )
    .await?;

    tracing::info!(
        "Processed sequence numbers {first_sequence_num} - {last_sequence_num} for room {file_id}"
    );

    Ok(Some(last_sequence_num))
}

#[cfg(test)]
mod tests {
    use std::str::FromStr;

    use super::*;
    use quadratic_core::{grid::SheetId, CellValue, Pos};

    #[test]
    fn loads_a_file() {
        let file = load_file(include_str!(
            "../../quadratic-rust-shared/data/grid/v1_4_simple.grid"
        ))
        .unwrap();

        // Note: this won't run because cfg(test) is not passed to quadratic-core during tests. The string is generated from the commented out code.
        let sheet_id = SheetId::from_str("d9ea85d6-19e7-48e5-8380-282c1bd5a421").unwrap();
        let operations = "[{\"SetCellValues\":{\"sheet_rect\":{\"min\":{\"x\":1,\"y\":2},\"max\":{\"x\":1,\"y\":2},\"sheet_id\":{\"id\":\"d9ea85d6-19e7-48e5-8380-282c1bd5a421\"}},\"values\":{\"size\":{\"w\":1,\"h\":1},\"values\":[{\"type\":\"text\",\"value\":\"hello\"}]}}}]".to_string();

        // let mut client = GridController::from_grid(file.clone(), 0);
        // let sheet_id = client.sheet_ids().first().unwrap().to_owned();
        // let summary = client.set_cell_value(
        //     SheetPos {
        //         x: 1,
        //         y: 2,
        //         sheet_id,
        //     },
        //     "hello".to_string(),
        //     None,
        // );
        // let sheet = client.grid().try_sheet(sheet_id).unwrap();
        // assert_eq!(
        //     sheet.display_value(Pos { x: 1, y: 2 }),
        //     Some(CellValue::Text("hello".to_string()))
        // );

        let mut server = GridController::from_grid(file, 0);
        server.try_sheet_mut(server.sheet_ids()[0]).unwrap().id = sheet_id;
        apply_transaction(&mut server, serde_json::from_str(&operations).unwrap());
        let sheet = server.grid().try_sheet(sheet_id).unwrap();
        assert_eq!(
            sheet.display_value(Pos { x: 1, y: 2 }),
            Some(CellValue::Text("hello".to_string()))
        );
    }

    // #[tokio::test]
    // async fn processes_a_file() {
    //     let config = config().unwrap();
    //     let client = new_client(
    //         &config.aws_s3_access_key_id,
    //         &config.aws_s3_secret_access_key,
    //         &config.aws_s3_region,
    //     )
    //     .await;

    //     let file_id = Uuid::from_str("daf6008f-d858-4a6a-966b-928213048941").unwrap();
    //     let sequence = 0;
    //     let key = key(file_id, sequence);

    //     let file = download_object(&client, &config.aws_s3_bucket_name, &key)
    //         .await
    //         .unwrap();
    //     let body = file.body.collect().await.unwrap().into_bytes();
    //     let body = std::str::from_utf8(&body).unwrap();
    //     println!("{:?}", body);
    //     return;

    //     // let mut grid = get_and_load_object(&client, &config.aws_s3_bucket_name, &key)
    //     //     .await
    //     //     .unwrap();
    //     // let sheet_id = grid.sheet_ids().first().unwrap().to_owned();
    //     // let sheet_rect = SheetPos {
    //     //     x: 0,
    //     //     y: 0,
    //     //     sheet_id,
    //     // }
    //     // .into();
    //     // let value = CellValue::Text("hello".to_string());
    //     // let values = Array::from(value);
    //     // let operation = Operation::SetCellValues { sheet_rect, values };

    //     // process_transactions(
    //     //     &client,
    //     //     &config.aws_s3_bucket_name,
    //     //     file_id,
    //     //     sequence,
    //     //     vec![operation],
    //     // )
    //     // .await
    //     // .unwrap();
    // }
}
