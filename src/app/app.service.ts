import { Injectable, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { DeviceService } from 'src/services/device.service';
import { OverlayerService } from 'src/services/overlay/overlayer.service';
import { getLogger } from 'src/utils';
const logger = getLogger('app.serv', 0, { level: -1 });

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public ready = false;
  constructor(
    private overlay: OverlayerService,
    private route: ActivatedRoute,
    private nav: NavController,
    private device: DeviceService,
    private platform: Platform
  ) {}
  bootstrap(base = '/home') {
    this.overlay.showLoading('正在尝试连接服务器');
    let url = localStorage.getItem('ddp-url');
    // @ts-ignore
    const urls: string[] = (window.BY_CONFIGURATION.ddpUrls || []).filter(
      (el: string) => el !== url && el
    );
    let busy = false;
    const t = Tracker.autorun(() => {
      const status = Meteor.status();
      if (status.status === 'connecting' || busy) return;
      const connected = Meteor.status().connected;
      console.log(Meteor.status());
      if (connected) {
        if (Accounts.loggingIn()) {
          this.overlay.showLoading('验证身份中...');
        } else {
          console.log(`set useable ddp url - ${url}`);
          busy = false;
          localStorage.setItem(`ddp-url`, url);
          this.ready = true;
          (async () => {
            // if (
            //   !this.platform.is("desktop") &&
            //   (this.platform.is("android") ||this.platform.is("ios") )&&
            //   !(await firstValueFrom(this.device.ready$))
            // ) {
            //   await sleep(0.2)
            // }
            const el = await firstValueFrom(this.route.queryParams);
            let target: string = el.target || base;
            if (!Meteor.userId()) {
              target = '/login';
              logger('-- need to login --');
            } else {
              target = base;
            }
            logger(`go ${target} ---- `);
            this.nav.navigateRoot(target, {});
            this.overlay.hideLoading(true);
            t.stop();
          })();
        }
      } else if ((url = urls.shift())) {
        // @ts-ignore
        Meteor.reconnect({ url });
      } else {
        busy = true;
        this.overlay.hideLoading();
        this.overlay
          .confirm('没有找到可用的服务器', '是否重新尝试或者联系IT部门')
          .then((v) => {
            location.reload();
            busy = false;
          });
      }
    });
  }
}
