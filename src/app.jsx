import { useState } from "preact/hooks";
import preactLogo from "./assets/preact.svg";
import { WebviewWindow } from "@tauri-apps/api/window";
import "./app.css";

import { HexAlphaColorPicker } from "react-colorful";

export function App() {
  const [windows, setWindows] = useState([]);

  const createWindow = () => {
    setWindows((prevState) => {
      console.log(prevState);
      const newWindowMeta = { id: `w${Date.now()}`, color: "#000000" };
      const webview = new WebviewWindow(newWindowMeta.id, {
        url: "../colors.html",
        decorations: false,
        center: true,
        resizable: true,
        transparent: true,
      });

      const nextState = prevState.concat([newWindowMeta]);
      console.log(nextState);
      return nextState;
    });
  };

  const removeWindow = (event) => {
    setWindows((prevState) => {
      const windowId = event.target.id;
      console.log(windowId);
      const webview = new WebviewWindow(windowId);
      console.log(typeof webview, webview);
      webview.close();
      const nextState = [...prevState].filter((window) => {
        console.log(window.id, windowId);
        return window.id !== windowId;
      });
      console.log(nextState);
      return nextState;
    });
  };

  const setWindowColor = (windowId) => (color) => {
    setWindows((prevState) => {
      const nextState = [...prevState].map((window) => {
        if (window.id === windowId) {
          window.color = color;
        }
        return window;
      });
      const webview = new WebviewWindow(windowId);
      webview.emit("window-color-change", { color });
      console.log(nextState);

      return nextState;
    });
  };

  return (
    <>
      <nav class="container" data-tauri-drag-region>
        <h1>Welcome to Redacted!</h1>
      </nav>
      <section>
        {windows.map((window) => (
          <div style={{ backgroundColor: window.color }}>
            <HexAlphaColorPicker
              color={window.color}
              onChange={setWindowColor(window.id)}
            />
            <button id={window.id} key={window.id} onClick={removeWindow}>
              {window.color}
            </button>
          </div>
        ))}
        <button onClick={createWindow}>create</button>
      </section>
      <footer data-tauri-drag-region />
    </>
  );
}
