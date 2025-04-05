export enum Format {
  "image/png" = "image/png",
  "image/jpeg" = "image/jpeg",
  "image/webp" = "image/webp",
  "image/bmp" = "image/bmp",
}

export enum CameraMode {
  front,
  rear,
}

export enum Resolution {
  "480p",
  "720p",
  "1080p",
}

export type QuickSnapAttributeDefinition<T> = {
  key: string;
  default: T;
  validate: (value: unknown) => T;
};

export type QuickSnapAttributes = {
  width: QuickSnapAttributeDefinition<number>;
  height: QuickSnapAttributeDefinition<number>;
  autoStart: QuickSnapAttributeDefinition<boolean>;
  format: QuickSnapAttributeDefinition<Format>;
  mediaDeviceId: QuickSnapAttributeDefinition<string>;
};

export interface QuickSnapCamDefinations {
  permission: PermissionState;
  askAndGetStream: (
    height: number,
    width: number,
    deviceId: string
  ) => Promise<MediaStream | null>;
  watchPermission: (
    callback: (state: PermissionState) => void
  ) => Promise<void>;
}
