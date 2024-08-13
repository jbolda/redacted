import { Suspense, lazy, useEffect } from "preact/compat";
import { checkForAppUpdates } from "./updater.jsx";
import { WindowCreation } from "./window-creation.jsx";
const WindowControlsNav = lazy(() =>
  import("./window-controls.jsx").then((exports) => exports.WindowControlsNav)
);

import "./app.css";

export function App() {
  useEffect(async () => {
    await checkForAppUpdates();
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <WindowControlsNav />
      </Suspense>
      <section class="container" data-tauri-drag-region>
        <h1>Welcome to Redacted!</h1>
      </section>
      <WindowCreation />
      <footer data-tauri-drag-region />
    </>
  );
}
