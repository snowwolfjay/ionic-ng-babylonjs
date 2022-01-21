import { Observable, Subscriber } from "rxjs";
import {
  BoxGeometry,
  Mesh,
  MeshNormalMaterial,
  Object3D,
  Scene,
  Vector3,
} from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { getWallBase } from "./utils";
import * as TWEEN from "@tweenjs/tween.js";
import Hammer from "hammerjs";

export class Building extends Object3D {
  levelHeight: number;
  height: number;
  width: number;
  length: number;
  level: number;
  constructor(size: number[], data: any) {
    super();
    const [l, w, lv, lh = 8] = size;
    const h = lv * lh;
    this.length = l;
    this.width = w;
    this.height = h;
    this.levelHeight = lh;
    this.level = lv;
    this.translateY(h / 2);
    const wall = getWallBase(l, w, h);
    wall.name = "wall";
    this.add(wall);
    const bfgeo = new BoxGeometry(l, 0.2, w);
    for (let i = lv + 1; i--; ) {
      const ff = getWallBase(l, w, 0.2, bfgeo.clone());
      // ff.position.y = i * lh;
      ff.translateY(i * lh);
      ff.userData.intable = true;
      ff.userData.type = "floor";
      ff.userData.instance = this;
      ff.userData.level = i + 1;
      ff.name = "floor" + (i + 1);
      this.add(ff);
    }
  }
  setData() {
    return this;
  }
  moveTo(lat = 0, lon = 0, hoz = 0) {
    this.position.set(lat, hoz, lon);
    return this;
  }
  scene?: Scene;
  addToScene(scene: Scene) {
    scene.add(this);
    this.scene = scene;
    return this;
  }
  hideWall(keepFloor: any) {
    // this.getObjectByName("wall")!.visible = false;
    this.children.forEach((el) => {
      console.log(el.userData.type);
      if (el !== keepFloor && el.userData.type !== "baoan") {
        el.visible = false;
      }
    });
  }
  showWall() {
    // this.getObjectByName("wall")!.visible = false;
    this.children.forEach((el) => {
      el.visible = true;
    });
  }
  static currentSuber: Subscriber<any>;
  static focusLevel(
    floor: Mesh<any, MeshNormalMaterial>,
    control: PointerLockControls
  ) {
    this.currentSuber?.complete();
    return new Observable((suber) => {
      const { level, instance } = floor.userData as {
        level: number;
        instance: Building;
      };
      console.log(floor);
      this.currentSuber = suber;
      const { width, length, scene, levelHeight } = instance;
      instance.hideWall(floor);
      const cpos = floor.getWorldPosition(new Vector3(0, 0, 0));
      console.log(cpos);
      const pos = cpos.clone().add(new Vector3(0, levelHeight - 1, 6));
      console.log(pos);
      // const pos = cpos.clone().add(new Vector3(0, levelHeight, 0));
      floor.material.opacity = 1;
      const camera = control.getObject();
      // camera.rotateZ(60);
      const camLastPos = camera.position.clone();
      const camLastRot = camera.rotation.clone();
      floor.material.opacity = 1;

      new TWEEN.Tween(camera)
        .to({ position: pos, rotation: { x: -Math.PI / 3, y: 0, z: 0 } })
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      const h = new Hammer(document.body, {
        recognizers: [[Hammer.Pan, { direction: Hammer.DIRECTION_ALL }]],
      });

      const handleKeydown = ({ key }: KeyboardEvent) => {
        switch (key) {
          case "w":
            control.moveForward(1);
            // camera.position.z -= 1;
            break;
          case "a":
            control.moveRight(-1);
            // camera.position.x -= 1;
            break;
          case "s":
            control.moveForward(-1);
            // camera.position.z += 1;
            break;
          case "d":
            control.moveRight(1);
            // camera.position.x += 1;
            break;

          default:
            break;
        }
      };
      // document.addEventListener("keydown", handleKeydown);
      let lastPan: { dx: number; dy: number } | undefined;
      h.on("pan", (ev) => {
        if (ev.isFirst || !lastPan)
          return (lastPan = { dx: ev.deltaX, dy: ev.deltaY });
        if (ev.isFinal) return (lastPan = undefined);
        const dx = lastPan.dx - ev.deltaX;
        const dy = lastPan.dy - ev.deltaY;
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
          control.moveForward(-Math.round(dy / 2));
          control.moveRight(Math.round(dx / 2));
        }
        lastPan = { dx: ev.deltaX, dy: ev.deltaY };
      });
      return () => {
        floor.userData.instance.showWall();
        floor.material.opacity = 0.3;
        const { x, y, z } = camLastPos;
        new TWEEN.Tween(camera)
          .to({ position: camLastPos })
          .easing(TWEEN.Easing.Quadratic.Out)
          .start();
        // camera.position.set(x, y, z);rotation: { x: -Math.PI / 3, y: 0, z: 0 }
        // document.removeEventListener("keydown", handleKeydown);
        h.destroy();
      };
    });
  }
  destroy() {
    this.scene?.remove(this);
    this.clear();
  }
}

export const buildBuilding = (
  size: number[],
  coords: number[] = [],
  data?: any
) => {
  const b = new Building(size, data);
  b.moveTo(...coords);
  // b.hideWall();
  return b;
};

export class BuildingManager {
  buildings = new Map<string, Building>();
  private static _current?: BuildingManager;
  public static get current() {
    return this._current ?? new BuildingManager();
  }
  constructor() {}
  add(id: string, size: number[]) {
    let d = this.buildings.get(id);
    if (!d) this.buildings.set(id, (d = new Building(size, { id })));
    return d;
  }
  destroy() {
    if (!BuildingManager._current) return;
    const c = BuildingManager.current;
    BuildingManager._current = undefined;
    c.buildings.forEach((building) => {
      building.destroy();
    });
  }
}
