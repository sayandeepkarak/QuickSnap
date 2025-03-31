import type { QuickSnapCamDefinations } from "./types/types";

export class QuickSnapCam implements QuickSnapCamDefinations {
  // Stores the current webcam permission state: "granted", "denied", or "prompt"
  public permission: PermissionState = "prompt";

  // Tracks the current permission status object to listen for updates
  private currentStatus: PermissionStatus | null = null;

  // Requests access to the user's webcam and returns the media stream if granted.
  // Updates the `permission` state based on the access result.
  public async askAndGetStream(): Promise<MediaStream | null> {
    try {
      // Request video access (audio disabled)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      // Update permission status
      this.permission = "granted";
      return stream;
    } catch {
      // Access was denied
      this.permission = "denied";
      return null;
    }
  }

  // Monitors permission changes for webcam access and invokes a callback when updated.
  // The `permission` state is automatically updated when the browser permission changes.
  public async watchPermission(callback: (state: PermissionState) => void) {
    try {
      // Remove existing event listener to prevent duplication
      if (this.currentStatus) {
        this.currentStatus.onchange = null;
      }

      // Request current camera permission status
      this.currentStatus = await navigator.permissions.query({
        name: "camera",
      });

      // Listen for permission changes and update state accordingly
      this.currentStatus.onchange = () => {
        if (this.currentStatus) {
          this.permission = this.currentStatus.state;
          callback(this.permission);
        }
      };
    } catch {
      // If permission querying fails, assume denial
      this.permission = "denied";
      callback(this.permission);
    }
  }
}
