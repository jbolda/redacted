use serde::de::DeserializeOwned;
use tauri::{plugin::PluginApi, AppHandle, Runtime};

use crate::models::*;

pub fn init<R: Runtime, C: DeserializeOwned>(
  app: &AppHandle<R>,
  _api: PluginApi<R, C>,
) -> crate::Result<TestHarness<R>> {
  Ok(TestHarness(app.clone()))
}

/// Access to the test-harness APIs.
pub struct TestHarness<R: Runtime>(AppHandle<R>);

impl<R: Runtime> TestHarness<R> {
  pub fn ping(&self, payload: PingRequest) -> crate::Result<PingResponse> {
    Ok(PingResponse {
      value: payload.value,
    })
  }
}
