import type { QuickSnapCamDefinations } from "../types/types";

export class QuickSnapCam implements QuickSnapCamDefinations {
  public permission: PermissionState = "prompt";
  private currentStatus: PermissionStatus | null = null;
  private permissionChangeHandler?: () => void;

  public async askAndGetStream(): Promise<MediaStream | null> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.permission = "granted";
      return stream;
    } catch {
      this.permission = "denied";
      return null;
    }
  }

  public async watchPermission(callback: (state: PermissionState) => void) {
    try {
      if (this.currentStatus && this.permissionChangeHandler) {
        this.currentStatus.removeEventListener(
          "change",
          this.permissionChangeHandler
        );
      }

      this.currentStatus = await navigator.permissions.query({
        name: "camera",
      });

      this.permissionChangeHandler = () => {
        if (this.currentStatus) {
          this.permission = this.currentStatus.state;
          callback(this.permission);
          if (this.permission === "prompt" && this.permissionChangeHandler) {
            this.currentStatus.removeEventListener(
              "change",
              this.permissionChangeHandler
            );
          }
        }
      };

      this.currentStatus.addEventListener(
        "change",
        this.permissionChangeHandler
      );
      callback(this.currentStatus.state);
    } catch {
      this.permission = "denied";
      callback(this.permission);
    }
  }
}
