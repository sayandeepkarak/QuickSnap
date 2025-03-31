import type { QuickSnapCamDefinations } from "./types/types";

export class QuickSnapCam implements QuickSnapCamDefinations {
  // Stores the current webcam permission state: "granted", "denied", or "prompt"
  public permission: PermissionState = "prompt";

  // Tracks the current permission status object to listen for updates
  private currentStatus: PermissionStatus | null = null;

  // Requests access to the user's webcam and returns the media stream if granted
  public async askAndGetStream(): Promise<MediaStream | null> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      this.permission = "granted";
      return stream;
    } catch {
      this.permission = "denied";
      return null;
    }
  }

  // Monitors permission changes and invokes a callback when the status updates
  public async watchPermission(callback: (state: PermissionState) => void) {
    try {
      if (this.currentStatus) {
        this.currentStatus.onchange = null;
      }

      this.currentStatus = await navigator.permissions.query({
        name: "camera",
      });

      this.currentStatus.onchange = () => {
        if (this.currentStatus) {
          this.permission = this.currentStatus.state;
          callback(this.permission);
        }
      };
    } catch {
      this.permission = "denied";
      callback(this.permission);
    }
  }
}
