---

# **QuickSnap** – Lightweight Webcam Web Component

[![npm version](https://img.shields.io/npm/v/quicksnap.svg)](https://www.npmjs.com/package/quicksnap)
[![npm downloads](https://img.shields.io/npm/dw/quicksnap.svg)](https://www.npmjs.com/package/quicksnap)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

**QuickSnap** is a high-performance, framework-agnostic **Web Component** for accessing and capturing webcam snapshots. Designed for **React, Vue, Angular, Qwik**, and other modern JavaScript apps.

✅ Native, dependency-free, and framework-compatible.  
✅ Ideal for onboarding, profile picture capture, or camera utilities.

**Demo Implementation with Vue.js** → https://github.com/sayandeepkarak/quicksnap-demo-vue

---

## **🚀 Features at a Glance**

- 🎯 Seamless webcam start/stop with **real-time permission tracking**
- 🧩 Works in **Vue**, **React**, **Angular**, **Qwik**, **Svelte**, and more
- ⚡ Optimized for performance and minimal footprint
- ✨ **Capture flicker effect** for realism
- 🎥 Custom device binding with `media-device-id`
- 📷 Supports `PNG`, `JPEG`, `WEBP`, and `BMP` formats
- 🚧 Overlays for **permission denied** and **permission required**
- 🧠 Face detection + auto-cropping _(coming soon)_

---

## **📦 Installation**

```bash
npm install quicksnap
# or
yarn add quicksnap
```

---

## **🧪 Basic Usage Example**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>QuickSnap Demo</title>
  </head>
  <body>
    <quick-snap
      width="640"
      height="480"
      autostart="true"
      format="image/png"
    ></quick-snap>

    <script type="module">
      import "quicksnap";
      const snap = document.querySelector("quick-snap");

      snap.addEventListener("ready", (e) => {
        console.log("Webcam ready:", e.detail.message);
      });

      async function captureImage() {
        const blob = await snap.capture();
        if (blob) {
          console.log("Image captured:", blob);
        }
      }

      snap.width = 800;
      snap.format = "image/jpeg";
    </script>
  </body>
</html>
```

---

## **⚙️ Attributes**

| Attribute             | Type    | Default   | Description                                                                                 |
| --------------------- | ------- | --------- | ------------------------------------------------------------------------------------------- |
| `width`               | Number  | 640       | Width of the webcam video (min: 320, max: 1920).                                            |
| `height`              | Number  | 480       | Height of the webcam video (min: 240, max: 1080).                                           |
| `autostart`           | Boolean | true      | Automatically starts the webcam on mount.                                                   |
| `format`              | String  | image/png | Output format: `image/png`, `image/jpeg`, `image/webp`, or `image/bmp`.                     |
| `media-device-id`     | String  | ""        | Target a specific video input device by device ID. Use `getAvailableCameras()` to list all. |
| `enableFaceDetection` | Boolean | false     | Enables face detection with automatic cropping _(coming soon)_.                             |

All attributes are also configurable via JavaScript using property accessors.

---

## **🧠 Methods**

| Method                                          | Returns                                      | Description                                                              |
| ----------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------ |
| `start(restart = false)`                        | `Promise<boolean>`                           | Starts the webcam. Pass `true` to restart with reinitialization.         |
| `pause()`                                       | `void`                                       | Pauses the current video stream without stopping it.                     |
| `resume()`                                      | `void`                                       | Resumes a paused video stream.                                           |
| `stop()`                                        | `void`                                       | Completely stops the video stream and releases the media device.         |
| `capture()`                                     | `Promise<Blob \| null>`                      | Captures the current frame. Returns a `Blob` or `null` if capture fails. |
| `captureAndDownload(filename = "snapshot.png")` | `Promise<void>`                              | Captures a frame and prompts download with optional filename.            |
| `checkPermissions()`                            | `Promise<"granted" \| "denied" \| "prompt">` | Returns the current webcam permission status.                            |
| `getAvailableCameras()`                         | `Promise<Array<MediaDeviceInfo>>`            | Lists all available video input devices.                                 |

---

## **📡 Events**

| Event Name              | Payload                                   | Description                                             |
| ----------------------- | ----------------------------------------- | ------------------------------------------------------- |
| `ready`                 | `{ message: string }`                     | Fired when webcam is initialized and ready.             |
| `capture`               | `{ message: string, data: Blob \| null }` | Triggered after an image is captured.                   |
| `quicksnapError`        | `{ message: string }`                     | Emitted when an internal error occurs.                  |
| `permissionStateUpdate` | `{ status: string }`                      | Fired on permission change (`granted`, `denied`, etc.). |
| `faceDetected`          | `{ faceData: Object }`                    | _(Coming Soon)_ Triggered when a face is detected.      |

---

## **🌐 Framework Integration**

### ✅ Vue 3 (Composition API)

```vue
<template>
  <quick-snap width="640" height="480" ref="snap"></quick-snap>
</template>

<script setup>
import { ref, onMounted } from "vue";
import "quicksnap";

const snap = ref(null);
onMounted(() => {
  snap.value?.addEventListener("ready", () => {
    console.log("Vue QuickSnap ready");
  });
});
</script>
```

---

### ✅ React (Functional Component)

```jsx
import React, { useRef, useEffect } from "react";
import "quicksnap";

const QuickSnapComponent = () => {
  const snapRef = useRef(null);

  useEffect(() => {
    snapRef.current?.addEventListener("ready", () => {
      console.log("React QuickSnap ready");
    });
  }, []);

  return <quick-snap width="640" height="480" ref={snapRef}></quick-snap>;
};

export default QuickSnapComponent;
```

> ✅ Also works with Angular, Qwik, Svelte, Solid, or any modern JavaScript app that supports native Web Components.

---

## **🖼 Snapshot Features**

| Feature                | Description                                       |
| ---------------------- | ------------------------------------------------- |
| Snapshot capture       | Captures image as a `Blob`.                       |
| Auto-download          | Instant download using `captureAndDownload()`.    |
| Format support         | Choose from PNG, JPEG, WEBP, or BMP.              |
| Flicker effect         | Simulates flash using a subtle capture animation. |
| Face cropping _(soon)_ | Automatically crops image to fit detected faces.  |

---

## **📲 Dynamic Usage via JavaScript**

```js
const snap = document.querySelector("quick-snap");
snap.width = 800;
snap.format = "image/jpeg";
snap.autostart = false;

await snap.start();
```

---

## **🔐 Permission Handling**

| Feature             | Description                                                       |
| ------------------- | ----------------------------------------------------------------- |
| Permission querying | Use `checkPermissions()` to check access state.                   |
| Realtime feedback   | `permissionStateUpdate` event reflects live permission changes.   |
| UX overlays         | Built-in overlays when access is denied or pending user response. |

---

## **🧰 Utilities**

| Utility              | Description                                        |
| -------------------- | -------------------------------------------------- |
| Attribute validation | Enforces valid types and formats.                  |
| Promises             | All async APIs return native Promises.             |
| Image utilities      | Internal helpers for base64 and download handling. |

---

## **🛡 License**

Licensed under the [MIT License](./LICENSE).  
QuickSnap is fully open-source and maintained for the community.

---
