import { Injectable } from "@angular/core";
import { ToastController, ToastOptions } from "@ionic/angular";
import { Subject } from "rxjs";
import { throttleTime } from "rxjs/operators";
import { getLogger } from "../../utils";
const logger = getLogger("overlay", 0, { level: 1 });
@Injectable({
  providedIn: "any",
})
export class ToastService {
  private showToast$$ = new Subject();
  constructor(private toastController: ToastController) {
    // 计数和纪录显示的文字
    this.showToast$$
      .pipe(
        // 实现延迟效果
        throttleTime(500)
      )
      .subscribe((v) => {
        this.toast(v);
      });
  }
  private defaultConf: ToastOptions = {
    duration: 11500,
    position: "middle" as any,
    color: "dark",
    cssClass: "by-toast",
  };
  private async toast(opts: ToastOptions = {}) {
    const t = await this.toastController.create({
      ...this.defaultConf,
      ...opts,
      buttons: [
        {
          side: "end",
          icon: "checkmark-outline",
          handler: () => {
            t.dismiss()
          },
        },
      ],
    });
    await t.present();
    return t;
  }
  public showToast(message: any, opts: ToastOptions = {}) {
    this.showToast$$.next({
      message,
      ...opts,
    });
  }
  public showWarning(message: string, duration = 2000) {
    this.showToast$$.next({
      color: "warning",
      message,
      duration,
    });
  }
  public showSuccess(message: string) {
    this.showToast$$.next({
      color: "success",
      message,
    });
  }
}
