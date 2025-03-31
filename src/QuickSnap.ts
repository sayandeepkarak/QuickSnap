import { DEFAULT_ATTRS } from "./types/config";
import { QuickSnapCam } from "./utils/QuickSnapCam";

const { height, width, autoStart } = DEFAULT_ATTRS;

class QuickSnap extends HTMLElement {
  // Video element that displays the webcam stream
  private videoElement: HTMLVideoElement;
  // Overlay element for displaying messages (e.g., permission issues)
  private overlayElement: HTMLDivElement;
  // Webcam utility instance to manage media permissions and streaming
  private webcam: QuickSnapCam = new QuickSnapCam();

  // List of attributes to observe for changes
  static observedAttributes = [height.key, width.key, autoStart.key];

  // Retrieves the current width value from attributes, defaulting to 640px
  get width(): number {
    return Number(this.getAttribute(width.key)) || 640;
  }

  // Updates the width attribute dynamically
  set width(value: number) {
    this.setAttribute(width.key, value.toString());
  }

  // Retrieves the current height value from attributes, defaulting to 480px
  get height(): number {
    return Number(this.getAttribute(height.key)) || 480;
  }

  // Updates the height attribute dynamically
  set height(value: number) {
    this.setAttribute(height.key, value.toString());
  }

  // Determines whether the webcam should start automatically
  get autoStart(): boolean {
    if (!this.hasAttribute(autoStart.key)) {
      return autoStart.default;
    }
    return this.getAttribute(autoStart.key) === "true";
  }

  // Updates the autoStart attribute dynamically
  set autoStart(value: boolean) {
    this.setAttribute(autoStart.key, value.toString());
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Create a container for video and overlay elements
    const container = document.createElement("div");
    container.style.position = "relative";
    container.style.display = "inline-block";

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
    container.appendChild(this.videoElement);
    container.appendChild(this.overlayElement);
    this.shadowRoot!.append(container);
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
        this.videoElement.play();
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
}

// Registers the custom element <quick-snap> globally
function registerQuickSnap() {
  customElements.define("quick-snap", QuickSnap);
}

export { registerQuickSnap };
