import { DEFAULT_ATTRS } from "./types/config";
import { QuickSnapCam } from "./QuickSnapCam";

const { height, width, autoStart, format } = DEFAULT_ATTRS;

class QuickSnap extends HTMLElement {
  public containerElement: HTMLDivElement;
  public videoElement: HTMLVideoElement;
  public overlayElement: HTMLDivElement;
  private webcam: QuickSnapCam = new QuickSnapCam();

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.containerElement = document.createElement("div");
    this.containerElement.style.position = "relative";
    this.containerElement.style.display = "inline-block";
    this.containerElement.style.maxWidth = "100%";

    this.videoElement = document.createElement("video");
    this.videoElement.style.height = "max-content";
    this.videoElement.style.maxWidth = "100%";
    this.videoElement.setAttribute("playsinline", "true");

    this.overlayElement = document.createElement("div");
    this.overlayElement.style.position = "absolute";
    this.overlayElement.style.top = "50%";
    this.overlayElement.style.left = "50%";
    this.overlayElement.style.transform = "translate(-50%, -50%)";
    this.overlayElement.style.color = "#808080a3";
    this.overlayElement.style.fontSize = "16px";
    this.overlayElement.style.fontWeight = "bold";
    this.overlayElement.style.pointerEvents = "none";

    this.containerElement.appendChild(this.videoElement);
    this.containerElement.appendChild(this.overlayElement);
    this.shadowRoot!.append(this.containerElement);
  }

  static observedAttributes = [
    height.key,
    width.key,
    autoStart.key,
    format.key,
  ];

  get width(): number {
    if (!this.hasAttribute(width.key)) return width.default;
    return width.validate(this.getAttribute(width.key));
  }

  set width(value: number) {
    this.setAttribute(width.key, width.validate(value).toString());
  }

  get height(): number {
    if (!this.hasAttribute(height.key)) return height.default;
    return height.validate(this.getAttribute(height.key));
  }

  set height(value: number) {
    this.setAttribute(height.key, width.validate(value).toString());
  }

  get format(): string {
    if (!this.hasAttribute(format.key)) return format.default.toString();
    return format.validate(this.getAttribute(format.key)).toString();
  }

  set format(value: string | null) {
    this.setAttribute(format.key, format.validate(value).toString());
  }

  get autoStart(): boolean {
    if (!this.hasAttribute(autoStart.key)) return autoStart.default;
    return autoStart.validate(this.getAttribute(autoStart.key));
  }

  set autoStart(value: boolean) {
    this.setAttribute(autoStart.key, autoStart.validate(value).toString());
  }

  // Lifecycle method when component is added to the DOM
  connectedCallback() {
    this.applyAttributes();
    this.setStreamAndWatch();
  }

  // Lifecycle method when observed attributes change
  attributeChangedCallback(
    _: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    if (oldValue !== newValue) {
      this.applyAttributes();
    }
  }

  // Updates video element attributes based on observed values
  private applyAttributes() {
    this.videoElement.width = this.width;
    this.videoElement.height = this.height;
    this.autoStart = this.autoStart;
    this.format = this.format;
  }

  // Dispatches a custom event with a given name and details
  private dispatchCustomEvent(eventName: string, details: object) {
    this.dispatchEvent(
      new CustomEvent(eventName, {
        detail: details,
      })
    );
  }

  // Emits a "ready" event when QuickSnap is ready for capturing
  private onReady() {
    this.dispatchCustomEvent("ready", {
      message: "QuickSnap is ready for use.",
    });
  }

  // Emits a "capture" event when a snapshot is successfully taken
  private onCapture(blob: Blob | null) {
    this.dispatchCustomEvent("capture", {
      message: blob
        ? "Snapshot captured successfully."
        : "Failed to capture snapshot.",
      data: blob,
    });
  }

  // Emits an "error" event when an error occurs
  private onError(errorMessage: string) {
    console.error(`QuickSnap Error: ${errorMessage}`);
    this.dispatchCustomEvent("quicksnapError", { message: errorMessage });
  }

  // Emits a "permissionStateUpdate" event when permission state is updated
  private onPermissionStateUpdate() {
    this.dispatchCustomEvent("permissionStateUpdate", {
      status: this.webcam.permission,
    });
  }

  // Initializes webcam stream and monitors permission changes
  private async setStreamAndWatch() {
    this.webcam.watchPermission((permission: PermissionState) => {
      this.onPermissionStateUpdate();
      const willPlay = permission === "granted";
      this.playOrPauseStream(willPlay);
      this.showOverlay(
        !willPlay,
        permission === "denied" ? "Permission denied" : "Permission required"
      );

      if (!willPlay) {
        this.onError(
          `Camera access ${
            permission === "denied" ? "denied by user" : "requires permission"
          }`
        );
      }
    });

    this.playOrPauseStream(true, this.autoStart);
  }

  // Starts or stops webcam stream based on permission and autoStart settings
  private async playOrPauseStream(play: boolean, autoPlay: boolean = true) {
    if (play && autoPlay) {
      this.start();
    } else {
      this.stop();
    }
  }

  // Shows or hides overlay messages
  private showOverlay(show: boolean, text?: string) {
    this.overlayElement.style.display = show ? "inline-block" : "none";
    this.overlayElement.innerText = text ?? "";
  }

  // Starts the webcam stream
  public start(): Promise<boolean> {
    return new Promise(async (resolve) => {
      if (!this.videoElement.paused) {
        return resolve(true);
      }

      this.stop();

      const stream: MediaStream | null = await this.webcam.askAndGetStream();
      this.onPermissionStateUpdate();
      if (!stream?.active) {
        this.showOverlay(
          true,
          this.webcam.permission === "denied"
            ? "Permission denied"
            : "Permission required"
        );
        this.onError(
          `Camera access ${
            this.webcam.permission === "denied" ? "denied" : "required"
          }`
        );
        return resolve(false);
      }

      this.videoElement.srcObject = stream;
      this.videoElement.onloadedmetadata = () => {
        if (
          this.videoElement.readyState === HTMLMediaElement.HAVE_CURRENT_DATA
        ) {
          this.videoElement.play();
          this.onReady();
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

  // Stops the webcam stream
  public stop() {
    const stream = this.videoElement.srcObject as MediaStream | null;
    if (stream?.active) {
      stream.getTracks().forEach((track) => track.stop());
      this.videoElement.srcObject = null;
    }
    this.videoElement.pause();
  }

  // Captures an image from the webcam stream
  public capture(): Promise<Blob | null> {
    return new Promise(async (resolve) => {
      if (!this.videoElement || this.videoElement.readyState < 2) {
        this.onError("Camera is not ready for capturing.");
        return resolve(null);
      }

      this.pause();
      this.videoElement.style.opacity = "0.6";
      setTimeout(() => {
        this.videoElement.style.opacity = "1";
      }, 100);

      const canvas = document.createElement("canvas");
      canvas.width = this.videoElement.videoWidth;
      canvas.height = this.videoElement.videoHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        this.onError("Failed to access canvas for snapshot.");
        return resolve(null);
      }

      ctx.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        this.onCapture(blob);
        resolve(blob);
      }, this.format);

      this.resume();
    });
  }

  // Captures and downloads an image from the webcam stream
  public async captureAndDownload(fileName: string = "") {
    const blob = await this.capture();
    if (blob) {
      try {
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = fileName?.length
          ? fileName
          : `quick_snap_image_${Date.now()}`;
        this.containerElement.appendChild(a);
        a.click();
        this.containerElement.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error(`QuickSnap Error: ${error}`);
        this.onError("Failed to capture and download snapshot.");
      }
    } else {
      this.onError("No snapshot available for download.");
    }
  }

  public async checkPermissions(): Promise<PermissionState | null> {
    try {
      const status = await this.webcam.fetchPermissionStatus();
      return status.state;
    } catch (error) {
      console.error(`QuickSnap Error: ${error}`);
      this.onError("Failed to check camera permission status");
      return null;
    }
  }
}

function registerQuickSnap() {
  if (!customElements.get("quick-snap")) {
    customElements.define("quick-snap", QuickSnap);
  }
}

export { registerQuickSnap };
