import { Injectable } from "@angular/core";
import { LoadingController } from "@ionic/angular";
import { BehaviorSubject, combineLatest } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} from "rxjs/operators";
import { getLogger } from "../../utils";

const logger = getLogger("overlay", 0, { level: 1 });
@Injectable({
  providedIn: "root",
})
export class LoadingService {
  private showLoading$$ = new BehaviorSubject(null);
  constructor(private lc: LoadingController) {
    let loader = null;
    let counter = 0;
    const busy = new BehaviorSubject(false);
    const showLoadingLayer = async (text: string) => {
      logger("---------show loading ---------");
      busy.next(true);
      try {
        if (!loader) {
          loader = await this.lc.create({
            cssClass: "my-custom-class",
            message: text || "请稍等...",
          });
          await loader.present();
          logger("-->>>----show loading ---------");
        } else if (text) {
          loader.message = text;
        }
      } catch (error) {
        console.error(error);
      }
      busy.next(false);
    };
    const hideLoadingLayer = async () => {
      if (!loader) return;
      busy.next(true);
      await loader.dismiss();
      loader = null;
      busy.next(false);
    };
    // 计数和纪录显示的文字
    combineLatest({
      load: this.showLoading$$.pipe(
        map((v) => {
          if (!v) {
            let nc = counter - 1;
            counter = nc >= 0 ? nc : 0;
          } else if (v.forceClose) {
            counter = 0;
          } else {
            counter++;
          }
          return { show: counter > 0, ...v };
        })
      ),
      busy,
    })
      .pipe(
        // 实现延迟效果
        debounceTime(50),
        // 去除重复的显示请求
        filter((v) => !v.busy),
        map((v) => v.load),
        // 去除重复的显示请求
        distinctUntilChanged((p, c) => p.show === c.show && p.text === c.text)
      )
      .subscribe((v) => {
        if (v.show) {
          showLoadingLayer(v.text);
        } else {
          hideLoadingLayer();
        }
      });
  }
  async showLoading(text?: string) {
    logger("---------try show loading ---------");
    this.showLoading$$.next({ text });
    return;
  }
  async hideLoading(force = false) {
    logger("---------try hide loading ---------");
    this.showLoading$$.next(force ? { forceClose: 1 } : null);
  }
}
