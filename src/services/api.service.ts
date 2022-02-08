import { Injectable, NgZone } from "@angular/core";
import { getLogger } from "src/utils";
import { firstValueFrom, Subscription } from "rxjs";
import { NetService, NetStatus } from "./net.service";
import { OverlayerService } from "./overlay/overlayer.service";
const log = getLogger("api.serv", 0, { level: 1 });
interface IRevokeOption {
  showLoading: boolean; // 设置为false, 静默发送请求
  loadingText?: string;
  quiet?: boolean; // 不显示错误提示
  onConfirm?: (v: boolean) => any;
  timeout?: number;
  multi?: boolean;
}
type normalArgs = string | number | { [key: string]: any };
interface ControlFunction {
  (): IRevokeOption;
}
@Injectable({
  providedIn: "root",
})
export class APIService {
  private callMap = new Map<
    string,
    { resolve: Function; control: any; handler: Subscription }
  >();
  private autoList = new Map<string, Tracker.Computation>();
  constructor(
    private overlay: OverlayerService,
    private zone: NgZone,
    private net: NetService
  ) {}
  revoke<T = any>(
    name: string,
    controller?: ControlFunction | normalArgs,
    ...args: any[]
  ): Promise<[boolean, T]> {
    const control = { showLoading: true } as IRevokeOption;
    if (typeof controller === "function") {
      Object.assign(control, controller());
    } else {
      args.unshift(controller);
    }
    return new Promise((resolve) => {
      this.zone.runOutsideAngular(async () => {
        const online =
          (await firstValueFrom(this.net.status$)) === NetStatus.CONNECTED;
        if (!online) return resolve([true, "连接服务器失败" as any]);
        const data = { resolve, control } as any;
        if (!control.multi) {
          if (this.callMap.has(name)) {
            const oc = this.callMap.get(name);
            oc.handler.unsubscribe();
            oc.resolve([true, "OUTDATED"]);
            oc.control.showLoading && this.overlay.hideLoading();
          }
          this.callMap.set(name, data);
        }
        const timer =
          control.timeout &&
          setTimeout(() => {
            response([1, "超时"]);
          }, control.timeout);
        if (control.showLoading)
          this.overlay.showLoading(control.loadingText || "更新中，请稍等...");
        const handler = Meteor.call(name, ...args).subscribe(
          async (res: [any, any?, any?]) => {
            res = Array.isArray(res) ? res : [0, res];
            response(res);
          },
          (err: Meteor.Error) => {
            response([1, err?.details, err?.reason, err?.message]);
          },
          () => {
            log("sub complete");
          }
        );
        data.handler = handler;
        var response = async (data) => {
          control.timeout && clearTimeout(timer);
          this.zone.run(() => {
            resolve(data);
          });
          handler.unsubscribe();
          !control.multi && this.callMap.delete(name);
          control.showLoading && this.overlay.hideLoading();
          if (data[0] && typeof data[1] === "string" && !control.quiet) {
            const pick = await this.overlay.confirm(
              data[2] || "错误提示",
              data[1],
              { choice: !!control.onConfirm }
            );
            control.onConfirm?.call(null, pick);
          }
        };
      });
    });
  }
  private subs: {
    [key: string]: { stop: () => void; ready: () => boolean };
  } = {};
  subscribe(name: string, ...args: any[]) {
    this.unsubscribe(name);
    log(`sub ${name}`);
    const p = new Promise((resolve) => {
      this.subs[name] = Meteor.subscribe(name, ...args, {
        onReady() {
          log(`${name} ready!!!`);
          resolve(true);
        },
        onStop(err) {
          err && resolve(false);
        },
      });
    });
    return {
      unsubscribe: () => {
        this.subs[name]?.stop.call(this.subs[name]);
        delete this.subs[name];
      },
      ready: p,
    };
  }
  unsubscribe(name: string) {
    if (this.subs[name]) {
      this.subs[name].stop();
      delete this.subs[name];
      log(`delete old sub ${name}`);
    }
  }
  autorun(name: string, callback: () => void) {
    const oc = this.autoList.get("name");
    oc && oc.stop();
    this.autoList.set(name, Tracker.autorun(callback));
  }
  autosub(name: string, ...args: any[]) {
    let logined = false;
    const s = Tracker.autorun(() => {
      if (Meteor.userId()) {
        if (!logined) {
          logined = true;
          this.subscribe(name, ...args);
        }
      } else {
        logined = false;
        this.unsubscribe(name);
      }
    });
    return s.stop.bind(s);
  }
  runWhenUserChange(v: (userId: string | null) => any) {
    let u = null;
    return Tracker.autorun(() => {
      const cu = Meteor.userId();
      if (u !== cu) {
        v(cu);
      }
      u = cu;
    });
  }
}
