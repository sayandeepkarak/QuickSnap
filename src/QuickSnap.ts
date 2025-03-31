import { DEFAULT_ATTRS } from "./types/config";
import { QuickSnapCam } from "./QuickSnapCam";

const { height, width, autoStart, format } = DEFAULT_ATTRS;

class QuickSnap extends HTMLElement {
  // Container element for holding video and overlay elements
  private containerElement: HTMLDivElement;
  // Video element that displays the webcam stream
  private videoElement: HTMLVideoElement;
  // Overlay element for displaying messages (e.g., permission issues)
  private overlayElement: HTMLDivElement;
  // Webcam utility instance to manage media permissions and streaming
  private webcam: QuickSnapCam = new QuickSnapCam();

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Initialize the container for video and overlay elements
    this.containerElement = document.createElement("div");
    this.containerElement.style.position = "relative";
    this.containerElement.style.display = "inline-block";

    // Initialize the video element
    this.videoElement = document.createElement("video");
    this.videoElement.style.height = "max-content";
    this.videoElement.setAttribute("autoplay", "true");
    this.videoElement.setAttribute("playsinline", "true");

    // Create an overlay for displaying status messages
    this.overlayElement = document.createElement("div");
    this.overlayElement.style.position = "absolute";
    this.overlayElement.style.top = "50%";
    this.overlayElement.style.left = "50%";
    this.overlayElement.style.transform = "translate(-50%, -50%)";
    this.overlayElement.style.color = "#808080a3";
    this.overlayElement.style.fontSize = "16px";
    this.overlayElement.style.fontWeight = "bold";
    this.overlayElement.style.pointerEvents = "none";

    // Append video and overlay elements to the shadow DOM
    this.containerElement.appendChild(this.videoElement);
    this.containerElement.appendChild(this.overlayElement);
    this.shadowRoot!.append(this.containerElement);
  }

  // List of attributes to observe for changes
  static observedAttributes = [
    height.key,
    width.key,
    autoStart.key,
    format.key,
  ];

  // Retrieves the current width value from attributes
  get width(): number {
    if (!this.hasAttribute(width.key)) return width.default;
    return width.validate(this.getAttribute(width.key));
  }

  // Updates the width attribute dynamically
  set width(value: number) {
    this.setAttribute(width.key, width.validate(value).toString());
  }

  // Retrieves the current height value from attributes, defaulting to 480px
  get height(): number {
    if (!this.hasAttribute(height.key)) return height.default;
    return height.validate(this.getAttribute(height.key));
  }

  // Updates the height attribute dynamically
  set height(value: number) {
    this.setAttribute(height.key, width.validate(value).toString());
  }

  get format(): string {
    if (!this.hasAttribute(format.key)) return format.default.toString();
    return format.validate(this.getAttribute(format.key)).toString();
  }

  // Updates the format attribute dynamically
  set format(value: string | null) {
    this.setAttribute(format.key, format.validate(value).toString());
  }

  // Determines whether the webcam should start automatically
  get autoStart(): boolean {
    if (!this.hasAttribute(autoStart.key)) return autoStart.default;
    return autoStart.validate(this.getAttribute(autoStart.key));
  }

  // Updates the autoStart attribute dynamically
  set autoStart(value: boolean) {
    this.setAttribute(autoStart.key, autoStart.validate(value).toString());
  }

  // Called when the component is inserted into the DOM
  connectedCallback() {
    this.applyAttributes();
    this.setStreamAndWatch();
  }

  // Called when an observed attribute changes
  attributeChangedCallback(
    _: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    if (oldValue !== newValue) {
      this.applyAttributes();
    }
  }

  // Updates the video element dimensions based on component attributes
  private applyAttributes() {
    this.videoElement.width = this.width;
    this.videoElement.height = this.height;
    this.autoStart = this.autoStart;
    this.format = this.format;
  }

  // Initializes the webcam stream and sets up permission monitoring
  private async setStreamAndWatch() {
    this.webcam.watchPermission((permission: PermissionState) => {
      const willPlay = permission === "granted";
      this.playOrPauseStream(willPlay);

      // Display permission-related messages
      this.showOverlay(
        !willPlay,
        permission === "denied" ? "Permission denied" : "Permission required"
      );
    });

    // Automatically start the stream if autoStart is enabled
    this.playOrPauseStream(true, this.autoStart);
  }

  // Controls webcam stream based on permission and autoStart settings
  private async playOrPauseStream(play: boolean, autoPlay: boolean = true) {
    if (play && autoPlay) {
      this.start();
    } else {
      this.stop();
    }
  }

  // Shows or hides the overlay text
  private showOverlay(show: boolean, text?: string) {
    this.overlayElement.style.display = show ? "inline-block" : "none";
    this.overlayElement.innerText = text ?? "";
  }

  // Starts the webcam stream and returns true if successful
  public start(): Promise<boolean> {
    return new Promise(async (resolve) => {
      // Prevent redundant playback if already running
      if (!this.videoElement.paused) {
        return resolve(true);
      }

      // Stop any existing stream before requesting a new one
      this.stop();

      // Request webcam access and obtain the media stream
      const stream: MediaStream | null = await this.webcam.askAndGetStream();
      if (!stream?.active) {
        this.showOverlay(
          true,
          this.webcam.permission === "denied"
            ? "Permission denied"
            : "Permission required"
        );
        return resolve(false);
      }

      // Assign stream to video element and start playback
      this.videoElement.srcObject = stream;
      this.videoElement.onloadedmetadata = () => {
        if (
          this.videoElement.readyState === HTMLMediaElement.HAVE_CURRENT_DATA
        ) {
          this.videoElement.play();
        }
        resolve(true);
      };
    });
  }

  // Pauses the webcam stream
  public pause() {
    this.videoElement.pause();
  }

  // Resumes webcam stream playback
  public resume() {
    this.videoElement.play();
  }

  // Stops the webcam stream and releases media resources
  public stop() {
    const stream = this.videoElement.srcObject as MediaStream | null;
    if (stream?.active) {
      stream.getTracks().forEach((track) => track.stop());
      this.videoElement.srcObject = null;
    }
    this.videoElement.pause();
  }

  // Captures a snapshot from the video stream and returns a Blob
  public capture(): Promise<Blob | null> {
    return new Promise(async (resolve) => {
      if (!this.videoElement || this.videoElement.readyState < 2) {
        return resolve(null); // Ensure video is ready
      }
      this.pause();
      this.videoElement.style.opacity = "0.6";
      setTimeout(() => {
        this.videoElement.style.opacity = "1";
      }, 100);
      // Create a canvas element
      const canvas = document.createElement("canvas");
      canvas.width = this.videoElement.videoWidth;
      canvas.height = this.videoElement.videoHeight;

      // Draw the current frame onto the canvas
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(null);
      ctx.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);

      // Convert the canvas to a Blob (PNG format)
      canvas.toBlob((blob) => {
        resolve(blob);
      }, this.format);
      this.resume();
    });
  }

  // Captures a snapshot from the video stream and download that
  public async captureAndDownload(fileName: string = "") {
    const blob = await this.capture();
    if (blob) {
      // Create a Blob URL
      const blobUrl = URL.createObjectURL(blob);

      // Create a hidden download link
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName?.length
        ? fileName
        : `quick_snap_image_${Date.now()}`; // Set the filename
      this.containerElement.appendChild(a);

      // Trigger the download
      a.click();

      // Clean up: remove element & revoke Blob URL
      this.containerElement.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    }
  }
}

// Registers the custom element <quick-snap> globally
function registerQuickSnap() {
  customElements.define("quick-snap", QuickSnap);
}

export { registerQuickSnap };
