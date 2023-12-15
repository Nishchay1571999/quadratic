//! Global Configuration
//!
//! Leveraging the `dotenv` crate, this module provides a global configuration
//! struct. This struct is populated by the `.env` file in the root of the
//! sub-repo.  If ANY of the environment variables are missing, the program will
//! panic at startup.

use anyhow::Result;
use dotenv::dotenv;
use serde::Deserialize;

#[derive(Deserialize, Debug)]
pub(crate) struct Config {
    pub(crate) host: String,
    pub(crate) port: String,
    pub(crate) auth0_jwks_uri: String,
    pub(crate) authenticate_jwt: bool,
    pub(crate) quadratic_api_uri: String,
    pub(crate) heartbeat_check_s: i64,
    pub(crate) heartbeat_timeout_s: i64,
}

/// Load the global configuration from the environment into Config.
pub(crate) fn config() -> Result<Config> {
    let filename = if cfg!(test) { ".env.test" } else { ".env" };
    dotenv::from_filename(filename).ok();
    dotenv().ok();
    Ok(envy::from_env::<Config>()?)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn gets_a_config() {
        let host = "127.0.0.1";
        std::env::set_var("HOST", host);
        let config = config().unwrap();
        assert_eq!(config.host, host.to_string());
    }
}
