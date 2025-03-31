# **QuickSnap**

QuickSnap is a lightweight, optimized **Web Component** for seamlessly integrating webcam access into JavaScript applications. It provides an efficient way to capture snapshots with a minimal yet powerful feature set, ensuring a smooth user experience.

## **Features**

✅ **Simple & Lightweight** – Easily integrate a webcam with a single Web Component.  
⚡ **Optimized Performance** – Minimal resource consumption with efficient handling.  
🛠️ **Permission Handling** – Automatic camera permission management.  
🎨 **Customizable** – Control width, height, format, and auto-start behavior.  
🔄 **Cross-Framework Support** – Works in any JavaScript environment.  
🚀 **Future-Ready** – AI-based face detection (coming soon).

---

## **Installation**

Install via npm:

```sh
npm install quicksnap
```

---

## **Usage**

### **Basic Usage (HTML & JavaScript)**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script type="module">
      import "quicksnap";
    </script>
  </head>
  <body>
    <quick-snap
      width="640"
      height="480"
      autostart
      format="image/png"
    ></quick-snap>
  </body>
</html>
```

---

## **Attributes**

| Attribute   | Type    | Default     | Description                                                         |
| ----------- | ------- | ----------- | ------------------------------------------------------------------- |
| `width`     | Number  | `640`       | Camera width in pixels                                              |
| `height`    | Number  | `480`       | Camera height in pixels                                             |
| `autostart` | Boolean | `true`      | Automatically start the camera when loaded                          |
| `format`    | String  | `image/png` | Image format (`image/png`, `image/jpeg`, `image/webp`, `image/bmp`) |

---

## **Events**

| Event Name              | Description                                      |
| ----------------------- | ------------------------------------------------ |
| `ready`                 | Fires when QuickSnap is ready to use.            |
| `capture`               | Fires when a snapshot is taken (returns a Blob). |
| `quicksnapError`        | Fires when an error occurs.                      |
| `permissionStateUpdate` | Fires when camera permission state changes.      |

---

## **Methods**

| Method                         | Description                                |
| ------------------------------ | ------------------------------------------ |
| `start()`                      | Starts the camera stream.                  |
| `pause()`                      | Pauses the camera stream.                  |
| `resume()`                     | Resumes a paused camera stream.            |
| `stop()`                       | Stops the camera stream.                   |
| `capture()`                    | Captures an image and returns a Blob.      |
| `captureAndDownload(filename)` | Captures an image and triggers a download. |
| `checkPermissions()`           | Checks camera permission status.           |

---

## **License**

This project is licensed under the **MIT License**.

---

🚀 **QuickSnap – A Simple & Efficient Webcam Web Component**
