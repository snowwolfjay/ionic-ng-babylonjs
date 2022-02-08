import { Injectable } from "@angular/core";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { Platform } from "@ionic/angular";
import { OverlayerService } from "./overlay/overlayer.service";

@Injectable({
  providedIn: "root",
})
export class PermissionService {
  constructor(
    private permission: AndroidPermissions,
    private platform: Platform,
    private overlay: OverlayerService
  ) {}

  private async checkPermission(key: string, permission: string, tip: string) {
    if (this.platform.is("cordova") && this.platform.is("android")) {
      console.log(`check permission ${permission}`);
      if (!(await this.permission.checkPermission(permission))?.hasPermission) {
        const res = await this.permission.requestPermission(permission);
        if (!res.hasPermission) {
          this.overlay.confirm("权限错误", tip);
          return false;
        }else{
          this.overlay.toast(`权限${permission}获取成功`)
        }
      }
    } else {
      console.info(`skip not cordova or android platform check`);
    }
    return true;
  }
  public checkAudioPermission() {
    return this.checkPermission(
      "audio",
      "android.permission.RECORD_AUDIO",
      "无法获取麦克风"
    );
  }
  public checkVideoPermission() {
    return this.checkPermission(
      "video",
      "android.permission.CAMERA",
      "无法获取摄像头"
    );
  }
}
