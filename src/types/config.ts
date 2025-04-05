import {
  validateBoolean,
  validateEnum,
  validateNumber,
  validateString,
} from "../utils/validation";
import { Format } from "./types";
import type { QuickSnapAttributes } from "./types";

enum attrKeys {
  WIDTH = "width",
  HEIGHT = "height",
  AUTO_START = "autostart",
  FORMAT = "format",
  MEDIA_DEVICE_ID = "mediaDeviceId",
}

export const DEFAULT_ATTRS: QuickSnapAttributes = {
  width: {
    key: attrKeys.WIDTH,
    default: 640,
    validate: (value: unknown) => {
      return validateNumber(value, attrKeys.WIDTH, 640);
    },
  },
  height: {
    key: attrKeys.HEIGHT,
    default: 480,
    validate: (value: unknown) => {
      return validateNumber(value, attrKeys.HEIGHT, 480);
    },
  },
  autoStart: {
    key: attrKeys.AUTO_START,
    default: true,
    validate: (value: unknown) => {
      return validateBoolean(value, attrKeys.AUTO_START, true);
    },
  },
  format: {
    key: attrKeys.FORMAT,
    default: Format["image/png"],
    validate: (value: unknown) => {
      return validateEnum(value, attrKeys.FORMAT, Format, Format["image/png"]);
    },
  },
  mediaDeviceId: {
    key: attrKeys.MEDIA_DEVICE_ID,
    default: "",
    validate: (value: unknown) => {
      return validateString(value, attrKeys.MEDIA_DEVICE_ID, "");
    },
  },
};
