# **QuickSnap** – A Lightweight & Optimized Webcam Web Component

QuickSnap is a high-performance **Web Component** designed for seamless webcam integration in JavaScript applications. With an intuitive API, automatic permission handling, and cross-framework compatibility, QuickSnap offers a simple yet powerful way to capture user snapshots effortlessly.

---

## **✨ Features**

✅ **Lightweight & Minimal** – Integrate a webcam with just a single Web Component.  
⚡ **Optimized Performance** – Efficient resource handling for smooth operation.  
🛠️ **Automatic Permission Handling** – Hassle-free user camera access.  
🎨 **Highly Customizable** – Control dimensions, formats, and auto-start settings.  
🔄 **Cross-Framework Compatibility** – Works seamlessly in React, Vue, Angular, and vanilla JavaScript.  
🚀 **Future-Ready** – AI-based face detection support (coming soon).

---

## **📦 Installation**

Install via **npm**:

```sh
npm install quicksnap
```

Or include it via **CDN** (coming soon).

---

## **🚀 Usage**

### **Basic Implementation (HTML & JavaScript)**

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
      autostart="true"
      format="image/png"
    ></quick-snap>
  </body>
</html>
```

---

## **⚙️ Attributes**

| Attribute   | Type    | Default     | Description                                                       |
| ----------- | ------- | ----------- | ----------------------------------------------------------------- |
| `width`     | Number  | `640`       | Sets the webcam width (in pixels).                                |
| `height`    | Number  | `480`       | Sets the webcam height (in pixels).                               |
| `autostart` | Boolean | `true`      | Automatically starts the webcam on load.                          |
| `format`    | String  | `image/png` | Specifies image format (`image/png`, `image/jpeg`, `image/webp`). |

---

## **📡 Events**

| Event Name              | Description                                          |
| ----------------------- | ---------------------------------------------------- |
| `ready`                 | Fired when QuickSnap is initialized and ready.       |
| `capture`               | Triggered when a snapshot is taken (returns a Blob). |
| `quicksnapError`        | Dispatched when an error occurs.                     |
| `permissionStateUpdate` | Fired when camera permission status changes.         |

---

## **🛠️ Methods**

| Method                         | Description                                  |
| ------------------------------ | -------------------------------------------- |
| `start()`                      | Starts the webcam stream.                    |
| `pause()`                      | Pauses the webcam stream.                    |
| `resume()`                     | Resumes a paused webcam stream.              |
| `stop()`                       | Stops the webcam stream.                     |
| `capture()`                    | Captures an image and returns a Blob.        |
| `captureAndDownload(filename)` | Captures an image and downloads it.          |
| `checkPermissions()`           | Checks the current camera permission status. |

---

## **🛡️ License**

This project is open-source and licensed under the **MIT License**.

---

💡 **QuickSnap – A Simple, Efficient, and Future-Ready Webcam Component.** 🚀
