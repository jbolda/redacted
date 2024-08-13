console.log("see this in every webview window");

// if (window?.__TAURI__) {
// @ts-expect-error
const windowLabel = window.__TAURI__.webview.getCurrent().label;
console.log(windowLabel);
// }
