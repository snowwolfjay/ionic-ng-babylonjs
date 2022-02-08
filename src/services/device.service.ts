import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  firstValueFrom,
  Observable,
  shareReplay,
} from 'rxjs';
import { deviceMap, getDeviceList } from 'src/utils/stream';

const ready$$ = new BehaviorSubject(false);
document.addEventListener(
  'deviceready',
  () => {
    ready$$.next(true);
  },
  false
);

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private _deviceIdentification: string;
  public ready$ = ready$$.pipe(
    filter((v) => !!v),
    shareReplay(1)
  );
  private device$$ = new BehaviorSubject<deviceMap>(null);
  public devices$: Observable<deviceMap>;
  private preferDevice$$ = new BehaviorSubject<any>(null);
  public preferDevices$: Observable<{ video: string; audio: string }>;
  constructor() {
    this.updateDeviceList();
    try {
      navigator.mediaDevices.ondevicechange = () => {
        this.updateDeviceList();
      };
    } catch (error) {}
    this.devices$ = this.device$$.pipe(filter((e) => !!e));
    this.preferDevices$ = this.preferDevice$$.pipe(
      filter((v) => !!v),
      shareReplay(1)
    );
  }
  private async checkDevicePreference(devices?: deviceMap) {
    devices = devices || (await firstValueFrom(this.devices$));
    const opv = this.preferDevice$$.value?.video;
    const opa = this.preferDevice$$.value?.audio;
    let pVideo = localStorage.getItem('prefer-video-device');
    if (devices.video?.length > 0) {
      if (!devices.video.some((e) => e.deviceId === pVideo)) {
        pVideo = null;
      }
      if (pVideo === null)
        localStorage.setItem(
          'prefer-video-device',
          (pVideo = devices.video[0].deviceId)
        );
    } else {
      pVideo = null;
    }
    let pAudio = localStorage.getItem('prefer-audio-device');
    if (devices.audio?.length > 0) {
      if (!devices.audio.some((e) => e.deviceId === pAudio)) {
        pAudio = null;
      }
      if (pAudio === null)
        localStorage.setItem(
          'prefer-audio-device',
          (pAudio = devices.audio[0].deviceId)
        );
    } else {
      pAudio = null;
    }
    if (pVideo === opv && opa === pAudio) return; // no update skip
    pVideo !== null
      ? localStorage.setItem('prefer-video-device', pVideo)
      : localStorage.removeItem('prefer-video-device');
    pAudio !== null
      ? localStorage.setItem('prefer-audio-device', pAudio)
      : localStorage.removeItem('prefer-audio-device');
    this.preferDevice$$.next({
      video: pVideo,
      audio: pAudio,
    });
  }
  private updateDeviceList() {
    getDeviceList().then((res) => {
      this.device$$.next(res);
      this.checkDevicePreference(res);
    });
  }

  private listDevices(): Promise<any> {
    return navigator.mediaDevices.enumerateDevices();
  }
  async getDefaultDevices(): Promise<{
    audioDeviceId: string;
    videoDeviceId: string;
    speakerDeviceId;
  }> {
    const devices = await this.listDevices();
    const audioDevices = devices.filter(
      (device) => device.kind === 'audioinput'
    );
    const videoDevices = devices.filter(
      (device) => device.kind === 'videoinput'
    );
    const speakerDevices = devices.filter(
      (device) => device.kind === 'audiooutput'
    );
    const audioDeviceId =
      audioDevices.length < 1 ? null : audioDevices[0].deviceId;
    const videoDeviceId =
      videoDevices.length < 1 ? null : videoDevices[0].deviceId;
    const speakerDeviceId =
      speakerDevices.length < 1 ? null : speakerDevices[0].deviceId;
    return { audioDeviceId, videoDeviceId, speakerDeviceId };
  }

  public setDefaultDevices(data: any) {
    data.audio && localStorage.setItem('prefer-audio-device', data.audio);
    data.video && localStorage.setItem('prefer-video-device', data.video);
    this.checkDevicePreference();
  }
}
