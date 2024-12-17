import {
  getCurrentWindow,
  Effect,
  type WindowOptions,
} from "@tauri-apps/api/window";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import type { WebviewOptions } from "@tauri-apps/api/webview";
import { emit } from "@tauri-apps/api/event";

export function createWindow(
  label: string,
  blurredBackground: boolean,
  options: Omit<WebviewOptions, "x" | "y" | "width" | "height"> & WindowOptions,
): Promise<WebviewWindow> {
  return new Promise((resolve, reject) => {
    const appWindow = new WebviewWindow(label, {
      ...options,
      transparent: blurredBackground,
      windowEffects: {
        effects: blurredBackground
          ? [Effect.Mica, Effect.Acrylic, Effect.Blur, Effect.WindowBackground]
          : [],
        ...options.windowEffects,
      },
    });
    appWindow.once("tauri://created", function () {
      // window successfully created
      console.warn("window created");
      resolve(appWindow);
    });
    appWindow.once("tauri://error", function (e) {
      // an error happened creating the window
      reject(e);
    });
  });
}
