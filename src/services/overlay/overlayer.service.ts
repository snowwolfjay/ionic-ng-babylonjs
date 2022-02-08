import { Injectable, NgZone } from '@angular/core';
import { AlertController, ToastOptions } from '@ionic/angular';
import { getLogger } from '../../utils';
import { LoadingService } from './loading.service';
import { ToastService } from './toast.service';
const logger = getLogger('overlay', 0, { level: 1 });
@Injectable({
  providedIn: 'root',
})
export class OverlayerService {
  constructor(
    private lc: LoadingService,
    private alertController: AlertController,
    private toaster: ToastService,
    private zone: NgZone
  ) {}
  async showLoading(text?: string) {
    return this.lc.showLoading(text);
  }
  async hideLoading(force = false) {
    return this.lc.hideLoading(force);
  }
  confirm(
    header: string,
    text: string,
    opts?: { cssClass?: string; choice?: boolean; okText?: string }
  ) {
    const { cssClass = 'dark', choice = true, okText = '确认' } = opts || {};
    let ok = false;
    return new Promise<boolean>(async (resolve) => {
      this.zone.runOutsideAngular(async () => {
        const buttons = [
          {
            text: okText,
            role: 'ok',
            handler: () => {
              ok = true;
            },
          },
        ] as any[];
        if (choice) {
          buttons.unshift({
            text: '取消',
            role: 'cancel',
            cssClass: 'secondary',
          });
        }
        const alert = await this.alertController.create({
          cssClass,
          header,
          backdropDismiss: false,
          message: `<div class='alert-content'>${text}</div>`,
          buttons,
        });
        alert.onDidDismiss().then(() => {
          resolve(ok);
        });
        await alert.present();
      });
    });
  }
  prompt(
    header: string,
    text: string,
    value = '',
    cssClass = 'dark'
  ): Promise<string> {
    return new Promise(async (resolve) => {
      const alert: HTMLIonAlertElement = await this.alertController.create({
        cssClass,
        header,
        message: ` <div class='alert-content'><div class='input-row'>
                     <span>${text}:</span> <input class='by-text-input' /'>
                     </div</div>`,
        backdropDismiss: false,
        buttons: [
          {
            text: '取消',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              resolve(null);
            },
          },
          {
            text: '确定',
            role: 'ok',
            handler: () => {
              const val = alert.querySelector('input').value;
              resolve(val);
            },
          },
        ],
      });
      alert.querySelector('input').value = value;
      await alert.present();
    });
  }
  multiPrompt<T = any>(
    header,
    inputs: Array<{
      name: string;
      val?: string;
      key?: string;
      required?: any;
      type?: string;
      tip?: string;
    }>,
    cssClass = 'dark modal'
  ) {
    return new Promise<T>(async (resolve) => {
      const res: any = {};
      inputs.forEach((el) => {
        if (el.key)
          res[el.key] = {
            value: el.val || '',
            required: !!el.required,
          };
      });
      const inner = inputs
        .map(
          (el) => `<div class='input-row'>
      <span>${el.name}:</span> ${
            !el.key
              ? `<span>${el.val}</span>`
              : `<input name=${el.key} placeholder="${
                  el.tip || ''
                }" class='by-text-input' value='${el.val || ''}' type="${
                  el.type || 'text'
                }" /'>`
          }
        </div>`
        )
        .join('');
      const alert: HTMLIonAlertElement = await this.alertController.create({
        cssClass,
        header,
        message: `<div class='alert-content'>
                 </div>`,
        backdropDismiss: false,
        buttons: [
          {
            text: '取消',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              resolve(null as any);
            },
          },
          {
            text: '确定',
            handler: () => {
              const result = {};
              for (const el of Array.from(alert.querySelectorAll('input'))) {
                if (!el.value && res[el.name].required) {
                  // handle error
                  return false;
                }
                result[el.name] = el.value;
              }
              logger({ res, result });
              resolve((Object.keys(result).length > 0 ? result : '') as any);
            },
          },
        ],
      });
      alert.querySelector('.alert-content').innerHTML = inner;
      await alert.present();
    });
  }
  async toast(message: string, duration = 1500, opts: ToastOptions = {}) {
    return this.toaster.showToast(message, { duration, ...opts });
  }
  showWarning(message: string, duration?: number) {
    return this.toaster.showWarning(message, duration);
  }
}
