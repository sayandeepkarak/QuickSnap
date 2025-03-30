import { DEFAULT_ATTRS } from "./types/config";
import { QuickSnapCam } from "./utils/QuickSnapCam";

const { height, width } = DEFAULT_ATTRS;

class QuickSnap extends HTMLElement {
  // Elements & Instances
  private videoElement: HTMLVideoElement;
  private overlayElement: HTMLDivElement;
  private webcam: QuickSnapCam = new QuickSnapCam();

  // Attributes
  static observedAttributes = [height.key, width.key];

  get width() {
    return Number(this.getAttribute("width")) || 640;
  }

  set width(value: number) {
    this.setAttribute("width", value.toString());
  }

  get height() {
    return Number(this.getAttribute("height")) || 480;
  }

  set height(value: number) {
    this.setAttribute("height", value.toString());
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    // Create container
    const container = document.createElement("div");
    container.style.position = "relative";
    container.style.display = "inline-block";

    // Create video element
    this.videoElement = document.createElement("video");
    this.videoElement.style.height = "max-content";
    this.videoElement.setAttribute("autoplay", "true");
    this.videoElement.setAttribute("playsinline", "true");

    // Create overlay text
    this.overlayElement = document.createElement("div");
    this.overlayElement.style.position = "absolute";
    this.overlayElement.style.top = "50%";
    this.overlayElement.style.left = "50%";
    this.overlayElement.style.transform = "translate(-50%, -50%)";
    this.overlayElement.style.color = "#808080a3";
    this.overlayElement.style.fontSize = "16px";
    this.overlayElement.style.fontWeight = "bold";
    this.overlayElement.style.pointerEvents = "none";

    // Append elements
    container.appendChild(this.videoElement);
    container.appendChild(this.overlayElement);
    this.shadowRoot!.append(container);
  }

  // Lifecycles and methods
  connectedCallback() {
    this.applyAttributes();
    this.setStreamAndWatch();
  }

  attributeChangedCallback(
    _: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    if (oldValue !== newValue) {
      this.applyAttributes();
    }
  }

  private applyAttributes() {
    this.videoElement.width = this.width;
    this.videoElement.height = this.height;
  }

  private async setStreamAndWatch() {
    this.webcam.watchPermission((permission: PermissionState) => {
      const willPlay = permission === "granted";
      this.playOrPauseStream(willPlay);
      if (willPlay) {
        this.showOverlay(false);
      } else {
        this.showOverlay(
          true,
          permission === "denied" ? "Permission denied" : "Permission required"
        );
      }
    });

    this.playOrPauseStream(true);
  }

  private async playOrPauseStream(play: boolean) {
    if (play) {
      const stream: MediaStream | null = await this.webcam.askAndGetStream();
      if (!stream?.active) return;
      this.videoElement.srcObject = stream;
      this.videoElement.play();
    } else {
      const stream = this.videoElement.srcObject as MediaStream | null;
      if (stream?.active) {
        stream.getTracks().forEach((track) => track.stop());
        this.videoElement.srcObject = null;
      }
      this.videoElement.pause();
    }
  }

  private showOverlay(show: boolean, text?: string) {
    this.overlayElement.style.display = show ? "inline-block" : "none";
    this.overlayElement.innerText = text ?? "";
  }
}

function registerQuickSnap() {
  customElements.define("quick-snap", QuickSnap);
}

export { registerQuickSnap };
