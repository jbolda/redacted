import { useState } from "preact/hooks";
import preactLogo from "./assets/preact.svg";
import { WebviewWindow } from "@tauri-apps/api/window";
import "./app.css";

const percentToHex = (p) => {
  const percent = Math.max(0, Math.min(100, p)); // bound percent from 0 to 100
  const intValue = Math.round((p / 100) * 255); // map percent to nearest integer (0 - 255)
  const hexValue = intValue.toString(16); // get hexadecimal representation
  return hexValue.padStart(2, "0").toUpperCase(); // format with leading 0 and upper case characters
};

export function App() {
  const [windows, setWindows] = useState([]);

  const createWindow = () => {
    setWindows((prevState) => {
      const newWindowMeta = {
        id: `w${Date.now()}`,
        color: "#000000",
        alpha: "FF",
      };
      const webview = new WebviewWindow(newWindowMeta.id, {
        url: "../colors.html",
        decorations: false,
        center: true,
        resizable: true,
        transparent: true,
      });

      const nextState = prevState.concat([newWindowMeta]);
      return nextState;
    });
  };

  const removeWindow = (event) => {
    setWindows((prevState) => {
      const windowId = event.target.id;
      const webview = new WebviewWindow(windowId);
      webview.close();
      const nextState = [...prevState].filter((window) => {
        return window.id !== windowId;
      });
      return nextState;
    });
  };

  const setWindowColor = (windowId) => (event) => {
    const colorChange = event.target.value;
    let color = null;

    setWindows((prevState) => {
      const nextState = [...prevState].map((colorWindow) => {
        if (colorWindow.id === windowId) {
          if (colorChange.startsWith("#")) {
            colorWindow.color = colorChange;
          } else {
            colorWindow.alpha = percentToHex(colorChange);
          }
          color = `${colorWindow.color}${colorWindow.alpha}`;
        }
        return colorWindow;
      });
      const webview = new WebviewWindow(windowId);
      if (color) webview.emit("window-color-change", { color });

      return nextState;
    });
  };

  return (
    <>
      <nav class="container" data-tauri-drag-region>
        <h1>Welcome to Redacted!</h1>
      </nav>
      <section>
        {windows.map((colorWindow) => (
          <div
            class="color-container"
            style={{
              backgroundColor: `${colorWindow.color}${colorWindow.alpha}`,
            }}
          >
            <input type="color" onInput={setWindowColor(colorWindow.id)} />
            <input
              type="range"
              defaultValue="100"
              onInput={setWindowColor(colorWindow.id)}
            />
            <button
              id={colorWindow.id}
              key={colorWindow.id}
              onClick={removeWindow}
            >
              X
            </button>
          </div>
        ))}
        <button class="flat" onClick={createWindow}>
          create
        </button>
      </section>
      <footer data-tauri-drag-region />
    </>
  );
}
