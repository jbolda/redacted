use tauri::{
  plugin::{Builder, TauriPlugin},
  Manager, Runtime,
};

pub use models::*;

#[cfg(desktop)]
mod desktop;
#[cfg(mobile)]
mod mobile;

mod commands;
mod error;
mod models;

pub use error::{Error, Result};

#[cfg(desktop)]
use desktop::TestHarness;
#[cfg(mobile)]
use mobile::TestHarness;

/// Extensions to [`tauri::App`], [`tauri::AppHandle`] and [`tauri::Window`] to access the test-harness APIs.
pub trait TestHarnessExt<R: Runtime> {
  fn test_harness(&self) -> &TestHarness<R>;
}

impl<R: Runtime, T: Manager<R>> crate::TestHarnessExt<R> for T {
  fn test_harness(&self) -> &TestHarness<R> {
    self.state::<TestHarness<R>>().inner()
  }
}

/// Initializes the plugin.
pub fn init<R: Runtime>() -> TauriPlugin<R> {
  Builder::new("test-harness")
    .invoke_handler(tauri::generate_handler![commands::ping])
    .setup(|app, api| {
      #[cfg(mobile)]
      let test_harness = mobile::init(app, api)?;
      #[cfg(desktop)]
      let test_harness = desktop::init(app, api)?;
      app.manage(test_harness);
      Ok(())
    })
    .build()
}
