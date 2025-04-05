# **QuickSnap** – A Lightweight & Optimized Webcam Web Component

**QuickSnap** is a high-performance, standalone **Web Component** that provides seamless webcam access and user snapshot capture across **any JavaScript web platform** – including **React, Vue, Angular**, or vanilla JS.

✅ Built using **native Web Component APIs**, it works out of the box without framework wrappers.  
✅ Ideal for onboarding flows, profile picture setups, camera utilities, and more.

---

## **🔧 Developer-Friendly Highlights**

- ✅ Fully compatible with **React**, **Vue**, **Angular**, and **vanilla JavaScript**.
- ✅ Seamless webcam start/stop with real-time **permission tracking**.
- ✅ Dynamic attribute configuration via **JavaScript setters**.
- ✅ Native support for image formats: `PNG`, `JPEG`, `WEBP`, `BMP`.
- ✅ **Capture flicker effect** for a realistic photo experience.
- ✅ Built-in overlays for **permission required** or **permission denied** states.
- ✅ **Face detection and auto-cropping** (coming soon).
- ✅ Easily bind to specific cameras via `media-device-id`.

> **💡 Dev Note**: QuickSnap requires **no external UI library** and integrates into any app with a single tag and import.

---

## **📦 Installation**

```bash
npm install quicksnap
```

or

```bash
yarn add quicksnap
```

---

## **🚀 Basic Usage (Minimal Full HTML)**

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

      const qs = document.querySelector("quick-snap");

      qs.addEventListener("ready", (e) => {
        console.log("Webcam ready", e.detail.message);
      });

      async function captureImage() {
        const blob = await qs.capture();
        if (blob) {
          console.log("Captured image", blob);
        }
      }

      // Dynamic control
      qs.width = 800;
      qs.format = "image/jpeg";
    </script>
  </body>
</html>
```

---

## **⚙️ Attributes & Configuration**

| Attribute             | Type    | Default     | Description                                                                                |
| --------------------- | ------- | ----------- | ------------------------------------------------------------------------------------------ |
| `width`               | Number  | 640         | Webcam video width in pixels (min: 320, max: 1920).                                        |
| `height`              | Number  | 480         | Webcam video height in pixels (min: 240, max: 1080).                                       |
| `autostart`           | Boolean | true        | Automatically start webcam on init.                                                        |
| `format`              | String  | "image/png" | Format for captured image. Supports: `image/png`, `image/jpeg`, `image/webp`, `image/bmp`. |
| `media-device-id`     | String  | ""          | Bind to a specific video input device. Use `getAvailableCameras()` to list.                |
| `enableFaceDetection` | Boolean | false       | Enables face detection with auto-cropping (coming soon).                                   |

> **🛠 Dev Note**: All attributes can also be accessed or updated using **JavaScript getters/setters**.

---

## **🛠️ Methods**

| Method                  | Parameters                                             | Returns                                      | Description                                                |
| ----------------------- | ------------------------------------------------------ | -------------------------------------------- | ---------------------------------------------------------- |
| `start()`               | `restart` (Boolean, default: false)                    | `Promise<boolean>`                           | Starts webcam. Use `restart: true` to reinitialize.        |
| `pause()`               | –                                                      | `void`                                       | Pauses video playback.                                     |
| `resume()`              | –                                                      | `void`                                       | Resumes video playback.                                    |
| `stop()`                | –                                                      | `void`                                       | Stops webcam and releases resources.                       |
| `capture()`             | –                                                      | `Promise<Blob \| null>`                      | Captures a frame. Returns `null` if stream is unavailable. |
| `captureAndDownload()`  | `filename` (String, optional, default: "snapshot.png") | `Promise<void>`                              | Captures and downloads a snapshot.                         |
| `checkPermissions()`    | –                                                      | `Promise<"granted" \| "denied" \| "prompt">` | Gets current camera permission status.                     |
| `getAvailableCameras()` | –                                                      | `Promise<Array<MediaDeviceInfo>>`            | Lists all available video input devices.                   |

---

## **📡 Events**

| Event Name              | Payload                                   | Description                                             |
| ----------------------- | ----------------------------------------- | ------------------------------------------------------- |
| `ready`                 | `{ message: string }`                     | Fired when webcam is initialized.                       |
| `capture`               | `{ message: string, data: Blob \| null }` | Triggered after image capture.                          |
| `quicksnapError`        | `{ message: string }`                     | Emitted when an internal error occurs.                  |
| `permissionStateUpdate` | `{ status: string }`                      | Fired when permission status changes.                   |
| `faceDetected`          | `{ faceData: Object }`                    | (Coming Soon) Triggered when a face is detected via AI. |

---

## **🧠 Framework Integration**

**QuickSnap** works directly in any modern JavaScript framework. Here's how to integrate it:

---

### **✅ Vue (Composition API)**

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

### **✅ React (Functional Component)**

```jsx
import React, { useEffect, useRef } from "react";
import "quicksnap";

const CameraComponent = () => {
  const snapRef = useRef(null);

  useEffect(() => {
    const snap = snapRef.current;
    snap?.addEventListener("ready", () => {
      console.log("React QuickSnap ready");
    });
  }, []);

  return <quick-snap width="640" height="480" ref={snapRef}></quick-snap>;
};

export default CameraComponent;
```

> ✅ **Also works with Angular**, Svelte, Solid, or any modern JavaScript app that supports native Web Components.

---

## **💡 Features Overview**

### 🎥 Webcam Core

| Feature                | Description                                                  |
| ---------------------- | ------------------------------------------------------------ |
| Webcam access          | Displays live camera via native `<video>`.                   |
| Auto-start             | Optional `autostart` launches stream on mount.               |
| Stream control         | Use `start`, `pause`, `resume`, and `stop` for full control. |
| Device selection       | Use `getAvailableCameras()` with `media-device-id`.          |
| Reactive permission UX | Automatically responds to permission changes at runtime.     |

---

### 📸 Snapshot & Capture

| Feature                 | Description                              |
| ----------------------- | ---------------------------------------- |
| Snapshot capture        | Capture still image as a `Blob`.         |
| Auto-download           | Save image using `captureAndDownload()`. |
| Format options          | Capture in PNG, JPEG, WEBP, or BMP.      |
| Flash effect            | Subtle visual flicker on image capture.  |
| Face auto-crop (coming) | Smart cropping with face detection.      |

---

### 🧠 Dynamic Control via JS

Dynamically configure attributes and control camera programmatically:

```js
const snap = document.querySelector("quick-snap");

snap.width = 800;
snap.format = "image/jpeg";
snap.autostart = false;

await snap.start();
```

---

## **🧪 Utility Features**

| Utility                 | Description                                               |
| ----------------------- | --------------------------------------------------------- |
| Attribute validation    | Enforces correct values for width, format, booleans, etc. |
| Promise-based structure | All async methods return Promises.                        |
| Blob/base64 utils       | Internal helpers for image manipulation and downloads.    |

---

## **🎨 Visual & UX Feedback**

| Effect / UX          | Description                                                           |
| -------------------- | --------------------------------------------------------------------- |
| Capture flicker      | Subtle flash animation when taking a picture.                         |
| Overlay (permission) | Visible overlay when permissions are denied or required.              |
| Auto-hide overlay    | Overlay disappears when permissions are granted and stream is active. |
| Real-time permission | Changes in camera access status are handled on-the-fly.               |

---

## **🔒 Permissions**

| Feature           | Description                                                              |
| ----------------- | ------------------------------------------------------------------------ |
| Permission check  | Use `checkPermissions()` to query current state.                         |
| Live updates      | Listen for `permissionStateUpdate` events for changes.                   |
| Friendly fallback | Displays overlays and disables stream if permissions are missing/denied. |

---

## **🛡 License**

QuickSnap is open-source and licensed under the [MIT License](./LICENSE).
