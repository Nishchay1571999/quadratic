use super::*;
use crate::controller::{
    active_transactions::unsaved_transactions::UnsavedTransaction,
    operations::operation::Operation,
    transaction::{Transaction, TransactionServer},
};
use uuid::Uuid;

#[wasm_bindgen]
impl GridController {
    #[wasm_bindgen(js_name = "multiplayerTransaction")]
    pub fn js_multiplayer_transaction(
        &mut self,
        transaction_id: String,
        sequence_num: u32,
        operations: &[u8],
    ) -> Result<JsValue, JsValue> {
        let transaction_id = Uuid::parse_str(&transaction_id)
            .map_err(|e| JsValue::from_str(&format!("Invalid transaction id: {}", e)))?;

        let operations = Transaction::decompress_and_deserialize::<Vec<Operation>>(operations)
            .map_err(|e| JsValue::from_str(&format!("Invalid operations: {}", e)))?;

        Ok(serde_wasm_bindgen::to_value(&self.received_transaction(
            transaction_id,
            sequence_num as u64,
            operations,
        ))?)
    }

    /// Used to set the sequence_num for multiplayer. This should only be called when receiving the sequence_num
    /// directly from the file. Use receiveSequenceNum for all other cases.
    #[wasm_bindgen(js_name = "setMultiplayerSequenceNum")]
    pub fn js_multiplayer_set_sequence_num(&mut self, sequence_num: u32) {
        self.set_last_sequence_num(sequence_num as u64);
    }

    /// Handle server-provided sequence_num.
    ///
    /// Returns a [`TransactionSummary`] (sometimes with a request for more transactions)
    #[wasm_bindgen(js_name = "receiveSequenceNum")]
    pub fn js_receive_sequence_num(&mut self, sequence_num: u32) -> Result<JsValue, JsValue> {
        Ok(serde_wasm_bindgen::to_value(
            &self.receive_sequence_num(sequence_num as u64),
        )?)
    }

    #[wasm_bindgen(js_name = "receiveMultiplayerTransactions")]
    pub fn js_receive_multiplayer_transactions(
        &mut self,
        transactions: &[u8],
    ) -> Result<JsValue, JsValue> {
        if let Ok(transactions) = serde_json::from_slice::<Vec<TransactionServer>>(transactions) {
            Ok(serde_wasm_bindgen::to_value(
                &self.received_transactions(&transactions[..]),
            )?)
        } else {
            Err(JsValue::from_str(
                "Invalid transactions received in receiveMultiplayerTransactions",
            ))
        }
    }

    #[wasm_bindgen(js_name = "applyOfflineUnsavedTransaction")]
    pub fn js_apply_offline_unsaved_transaction(
        &mut self,
        transaction_id: String,
        unsaved_transaction: String,
    ) -> Result<JsValue, JsValue> {
        let transaction_id = match Uuid::parse_str(&transaction_id) {
            Ok(transaction_id) => transaction_id,
            Err(e) => return Err(JsValue::from_str(&format!("Invalid transaction id: {}", e))),
        };
        if let Ok(unsaved_transaction) =
            serde_json::from_str::<UnsavedTransaction>(&unsaved_transaction)
        {
            Ok(serde_wasm_bindgen::to_value(
                &self.apply_offline_unsaved_transaction(transaction_id, unsaved_transaction),
            )?)
        } else {
            Err(JsValue::from_str(&format!(
                "Invalid unsaved transaction received in applyOfflineUnsavedTransaction {}",
                unsaved_transaction
            )))
        }
    }
}
