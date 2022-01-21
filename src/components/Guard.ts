import { Observable, Subscriber } from "rxjs";
import {
  CylinderGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  Object3D,
  Scene,
  SphereGeometry,
} from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

export class Guard extends Object3D {
  constructor(data: any) {
    super();
    const bgeo = new CylinderGeometry(0.5, 0.5, 3);
    const box = new Mesh(bgeo);
    bgeo.translate(0, 1.5, 0);
    box.visible = false;
    const geo = new SphereGeometry(0.5);
    const mat = new MeshBasicMaterial({ color: 0xffff00 });
    const head = new Mesh(geo, mat);
    geo.translate(0, 1.5, 0);
    this.add(box);
    this.add(head);
    const geometry = new CylinderGeometry(0.5, 0.5, 2);
    const material = new MeshBasicMaterial({ color: 0xff0000 });
    const body = new Mesh(geometry, material);
    this.add(body);
    Object.assign(this.userData, data, { intable: true, type: "baoan" });
    body.userData = head.userData = this.userData
  }
  moveTo(lat = 0, lon = 0, hoz = 0) {
    this.position.set(lat, hoz, lon);
  }
  scene?: Scene;
  addToScene(scene: Scene) {
    scene.add(this);
    this.scene = scene;
    return this;
  }
  static currentSuber: Subscriber<any>;
  static followGuard(
    floor: Mesh<any, MeshNormalMaterial>,
    control: PointerLockControls
  ) {
    this.currentSuber?.complete();
    return new Observable((suber) => {
      const { level, instance } = floor.userData as {
        level: number;
        instance: Guard;
      };
      console.log(floor);
      this.currentSuber = suber;
      floor.material.opacity = 1;
      const camera = control.getObject();
      // camera.rotateZ(60);
      camera.rotation.z = 0;
      camera.rotation.x = 60;
      camera.rotation.y = 0;
      const camLastPos = camera.position.clone();
      return () => {
        floor.userData.instance.showWall();
        floor.material.opacity = 0.3;
        // const { x, y, z } = camLastPos;
        // camera.position.set(x, y, z);
      };
    });
  }
  area: number[] = [];
  enterZone(lat: number, area: number[] = []) {
    this.translateY(lat);
    this.area = area;
    return this
  }
  setData(d: any) {
    return Object.assign(this.userData, d);
  }
}

export const buildGuard = (
  id: string,
  coords: number[] = [],
  area = [] as number[],
  data?: any
) => {
  const b = new Guard({ id, ...data });
  b.moveTo(...coords);
  b.enterZone(coords[2], area);
  return b;
};

export class GuardManager {
  list = new Map<string, Guard>();
  private static _current?: GuardManager;
  public static get current() {
    return this._current ?? new GuardManager();
  }
  constructor() {}
  add(id: string, coords: number[]) {
    let d = this.list.get(id);
    if (!d) this.list.set(id, (d = new Guard({ id })));
    d.moveTo(...coords);
    return d;
  }
  destroy() {
    if (!GuardManager._current) return;
    const c = GuardManager.current;
    GuardManager._current = undefined;
  }
}
