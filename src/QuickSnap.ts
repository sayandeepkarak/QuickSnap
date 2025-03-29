import { DEFAULT_ATTRS } from "./types/config";
import { QuickSnapCam } from "./utils/QuickSnapCam";

const { height, width } = DEFAULT_ATTRS;

class QuickSnap extends HTMLElement {
  // Elements & Instances
  private videoElement: HTMLVideoElement;
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
    this.videoElement = document.createElement("video");
    this.shadowRoot!.append(this.videoElement);
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
    const stream: MediaStream | null = await this.webcam.askAndGetStream();
    this.webcam.watchPermission((permission: PermissionState) => {
      if (permission === "prompt") this.setStreamAndWatch();
    });
    this.videoElement.srcObject = stream;
  }
}

function registerQuickSnap() {
  customElements.define("quick-snap", QuickSnap);
}

export { registerQuickSnap };
