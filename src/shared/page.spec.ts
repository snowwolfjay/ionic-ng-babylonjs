import { CommonModule } from "@angular/common";
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { IonicModule, NavController } from "@ionic/angular";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import {
  BehaviorSubject,
  debounceTime,
  map,
  Observable,
  shareReplay,
  of,
} from "rxjs";
import { AppBaseView } from "src/app/shared/page";

describe("Base页面-All", () => {
  let component: AppBaseView;
  let fixture: ComponentFixture<AppBaseView>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AppBaseView],
        imports: [],
        providers: [],
      }).compileComponents();
      fixture = TestBed.createComponent(AppBaseView);
      component = fixture.componentInstance;
    })
  );

  it("页面应该创建成功", () => {
    expect(component).toBeTruthy();
  });
  it("初始", () => {
    expect(component.clearCallbacks.size).toEqual(0);
    expect(component.peridCallbacks.size).toEqual(0);
  });
  it("自动订阅-临时和全局", () => {
    const ob = of([1]);
    component.subscribe(ob, () => {});
    expect(component.clearCallbacks.size).toEqual(1);
    component.subscribe(ob, () => {}, true);
    expect(component.peridCallbacks.size).toEqual(1);
  });
  it("能够销毁所有临时订阅", () => {
    const ob = of([1]);
    component.subscribe(ob, () => {}, true);
    component.subscribe(ob, () => {}, true);
    component.addPeriod(ob.subscribe(()=>{}))
    expect(component.peridCallbacks.size).toEqual(3);
    component.clearPeriod();
    expect(component.peridCallbacks.size).toEqual(0);
  });
  it("ngOnDestroy 能够销毁所有全局和临时订阅", () => {
    const ob = of([1]);
    component.subscribe(ob, () => {}, true);
    component.subscribe(ob, () => {}, true);
    expect(component.peridCallbacks.size).toEqual(2);
    component.subscribe(ob, () => {});
    expect(component.clearCallbacks.size).toEqual(1);
    component.ngOnDestroy();
    expect(component.clearCallbacks.size).toEqual(0);
    expect(component.peridCallbacks.size).toEqual(0);
  });
});
