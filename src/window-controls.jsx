import { useState, useEffect } from "preact/hooks";
import { getCurrentWindow, LogicalPosition } from "@tauri-apps/api/window";
import { platform } from "@tauri-apps/plugin-os";
import "./window-controls.css";

export function WindowControlsNav() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [os, setOS] = useState(null);

  // useEffect(async () => {
  //   setOS(await platform());
  // }, [platform]);

  const minimizeWebview = async () => {
    getCurrentWindow().minimize();
  };
  const maximizeWebview = async () => {
    const appWindow = getCurrentWindow();
    if (await appWindow.isMaximized()) {
      appWindow.setPosition(new LogicalPosition(position.x, position.y));
    } else {
      const { x, y } = await appWindow.innerPosition();
      appWindow.maximize();
      setPosition({ x, y });
    }
  };
  const closeWebview = async () => {
    getCurrentWindow().close();
  };

  return (
    <nav
      class="window-controls"
      data-tauri-drag-region
      style={
        os === "darwin"
          ? {
              display: "none",
            }
          : {
              flexDirection: "row",
              justifyContent: "flex-end",
            }
      }
    >
      <button onClick={minimizeWebview}>🗕</button>
      <button onClick={maximizeWebview}>🗖</button>
      <button onClick={closeWebview}>🗙</button>
    </nav>
  );
}
