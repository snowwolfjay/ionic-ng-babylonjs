import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, pairwise, shareReplay } from 'rxjs';
import { OverlayerService } from '../overlay/overlayer.service';
import { NavController } from '@ionic/angular';
import { APIService } from '../api.service';
import { Users } from 'meteor/imports/user/client';
import { Process } from 'src/shared/page';

interface IMineInfo {
  username: string;
  id: string;
  name: string;
  profile?: any;
}
@Injectable({
  providedIn: 'root',
})
export class UserService extends Process {
  private userData$$ = new BehaviorSubject<IMineInfo | null>(null);
  mineInfo$: Observable<IMineInfo>;
  private sub?: any;
  constructor(
    private overlay: OverlayerService,
    private api: APIService,
    nav: NavController
  ) {
    super();
    this.mineInfo$ = this.userData$$.pipe(shareReplay(1));
    this.api.autosub('myInfo');
    api.autorun('user.service', () => {
      if (Meteor.userId()) {
        this.subInfo();
      } else {
        this.userData$$.next(null);
      }
    });
    this.mineInfo$.pipe(pairwise()).subscribe(([p, c]) => {
      if (p && !c) {
        console.error('redirect login');
        nav.navigateRoot('/login');
      }
    });
  }
  get userInfo() {
    return this.userData$$.getValue();
  }
  subInfo() {
    if (this.sub) this.sub.unsubscribe();
    this.sub = Tracker.autorun(() => {
      const info = Users.findOne({ _id: Meteor.userId() });
      if (Meteor.userId() && info) {
        this.setUserData({
          ...info,
          id: info._id,
          name: info?.profile?.name,
        });
      }
    });
  }
  setUserData(e: IMineInfo) {
    this.userData$$.next(e);
  }
  login(username: string, password: string): Promise<any> {
    this.overlay.showLoading();
    return new Promise((resolve) => {
      let tout = setTimeout(() => {
        this.overlay.hideLoading();
        resolve(false);
      }, 30000);
      Meteor.loginWithPassword(username, password, async (err) => {
        clearTimeout(tout);
        this.overlay.hideLoading();
        if (err) {
          this.overlay.confirm('提示', err.message || '未知错误', {
            choice: false,
          });
          resolve(false);
        } else {
          // this.userData$$.next(Meteor.user());
          resolve(true);
        }
      });
    });
  }
  update(data: { username: string; password: string; name: string }) {
    if (Object.keys(data).length < 1) return;
    return this.api.revoke('userUpdate', data);
  }
  isMe(id: string, user?: any) {
    const ud = user || this.userInfo;
    return (ud?.id || ud?._id) === id;
  }
  getUserProfile(id: string) {
    return Users.findOne(id)?.profile;
  }
  user$(id: string) {
    return new Observable((suber) => {
      const u = Tracker.autorun(() => {
        suber.next(Users.findOne(id));
      });
      return () => u.stop();
    });
  }
}
