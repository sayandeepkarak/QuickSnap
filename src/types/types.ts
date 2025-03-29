export enum Format {
  png,
  jpeg,
  webp,
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
};

export type QuickSnapAttributes = {
  width: QuickSnapAttributeDefinition<number>;
  height: QuickSnapAttributeDefinition<number>;
  autoStart: QuickSnapAttributeDefinition<boolean>;
  format: QuickSnapAttributeDefinition<Format>;
  cameraMode: QuickSnapAttributeDefinition<CameraMode>;
  resolution: QuickSnapAttributeDefinition<Resolution>;
};

export interface QuickSnapCamDefinations {
  permission: PermissionState;
  askAndGetStream: () => Promise<MediaStream | null>;
  watchPermission: (
    callback: (state: PermissionState) => void
  ) => Promise<void>;
}
