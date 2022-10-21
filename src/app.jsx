import { useState } from "preact/hooks";
import preactLogo from "./assets/preact.svg";
import { WebviewWindow } from "@tauri-apps/api/window";
import "./app.css";

export function App() {
  const [windows, setWindows] = useState([]);

  const createWindow = () => {
    setWindows((prevState) => {
      console.log(prevState);
      const newWindowMeta = { id: `w${Date.now()}`, color: "black" };
      const webview = new WebviewWindow(newWindowMeta.id, {
        url: "../colors.html",
        decorations: false,
        center: true,
        resizable: true,
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

  return (
    <div class="container">
      <h1>Welcome to Redacted!</h1>
      {windows.map((window) => (
        <button id={window.id} key={window.id} onClick={removeWindow}>
          {window.color}
        </button>
      ))}
      <button onClick={createWindow}>create</button>
    </div>
  );
}
