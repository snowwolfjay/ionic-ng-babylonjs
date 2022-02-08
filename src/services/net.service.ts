import { Injectable, NgZone } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export enum NetStatus {
  OFFLINE,
  CONNECTED,
  CONNECTING,
  WAITING,
}

@Injectable({
  providedIn: "root",
})
export class NetService {
  public status$ = new BehaviorSubject(NetStatus.CONNECTING);
  constructor() {
    Tracker.autorun(() => {
      const state = Meteor.status();
      const s = state.status;
      switch (s) {
        case "connected":
          this.status$.next(NetStatus.CONNECTED);
          break;
        case "connecting":
          this.status$.next(NetStatus.CONNECTING);
          break;
        case "waiting":
          this.status$.next(NetStatus.WAITING);
          break;
        default:
          this.status$.next(NetStatus.OFFLINE);
      }
    });
  }
  connected() {
    return this.status$.value === NetStatus.CONNECTED;
  }
}
