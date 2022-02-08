import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';

interface Unsubscribeable {
  unsubscribe(): void;
}
interface Stopable {
  stop(): void;
}
interface Destoryable {
  destroy(): void;
}
type teardown = (() => any) | Unsubscribeable | Stopable | Destoryable;
const voidFun = () => {};

export class Process {
  readonly clearCallbacks = new Set<teardown>();
  private readonly childs: { [key: string]: Process } = {};
  constructor(public name?: string) {
    // console.error(`${this.constructor.name} created---`);
    this.name = name || this.constructor.name;
  }
  /**
   * @description 执行所有的销毁：Function | Unsubscribeable | Stopable | Destoryable
   */
  clear() {
    this.clearCallbacks.forEach(this.execTeardown);
    this.clearCallbacks.clear();
    for (const key of Object.keys(this.childs)) {
      const el = this.childs[key];
      el.clear();
      delete this.childs[key];
    }
  }
  track(fun: () => teardown | void) {
    const teardown = fun();
    if (teardown) {
      return this.addClear(teardown);
    }
    return voidFun;
  }
  child(name: string) {
    let el = this.childs[name];
    if (!el) {
      el = new Process();
      this.childs[name] = el;
    }
    return el;
  }
  /**
   *
   * @param cb 全局销毁者：Function | Unsubscribeable | Stopable | Destoryable
   * @returns 一个可以执行销毁并清理记录的函数
   */
  addClear(cb: teardown) {
    this.clearCallbacks.add(cb);
    return () => {
      this.clearCallbacks.delete(cb);
      this.execTeardown(cb);
    };
  }
  execTeardown(el: any) {
    console.log(`[stop] : ${el?.name || el?.constructor?.name} `);
    try {
      if (typeof el === 'function') el();
      else if (typeof el?.stop === 'function') el.stop.call(el);
      else if (typeof el?.unsubscribe === 'function') el.unsubscribe.call(el);
      else if (typeof el?.destroy === 'function') el.destroy.call(el);
    } catch (error) {
      console.warn(error);
    }
  }
}
@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppBaseView extends Process implements OnDestroy {
  constructor() {
    super();
    console.log(`${this.constructor.name} created`);
  }
  ngOnDestroy() {
    console.log(`${this.constructor.name} destroy`);
    super.clear();
  }
}
