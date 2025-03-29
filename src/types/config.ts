import { CameraMode, Format, Resolution } from "./types";
import type { QuickSnapAttributes } from "./types";

export const DEFAULT_ATTRS: QuickSnapAttributes = {
  width: {
    key: "width",
    default: 640,
  },
  height: {
    key: "height",
    default: 480,
  },
  autoStart: {
    key: "auto-start",
    default: false,
  },
  format: {
    key: "format",
    default: Format.png,
  },
  cameraMode: {
    key: "camera-mode",
    default: CameraMode.front,
  },
  resolution: {
    key: "resolution",
    default: Resolution["720p"],
  },
};
