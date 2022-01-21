import {
  BoxGeometry,
  BufferGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  DirectionalLightHelper,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  PointLight,
  PointLightHelper,
  Raycaster,
  Scene,
  SphereGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { animate, easeInOut } from "popmotion";
import * as TWEEN from "@tweenjs/tween.js";
import { BehaviorSubject, Subject, Subscription } from "rxjs";
import { buildBuilding, Building, BuildingManager } from "./Building";
import { GuardManager } from "./Guard";
import React from "react";

const BUILDING_LEVEL_HEIGHT = 8;

const buildGround = (width: number, height: number) => {
  const geo = new BoxGeometry(width, 1, height);
  const mat = new MeshNormalMaterial({ transparent: true, opacity: 0.3 });
  const obj = new Mesh(geo, mat);
  obj.position.add(new Vector3(0, -0.5, 0));
  return obj;
};

const bmat = new MeshNormalMaterial({ transparent: true, opacity: 0.3 });
const fmat = new MeshNormalMaterial({
  transparent: true,
  opacity: 0.3,
});

const createGuarder = (scene: Scene, d: any, lat = 0, lon = 0, lv = 1) => {
  const obj = new Object3D();
  const bgeo = new CylinderGeometry(0.5, 0.5, 3);
  const box = new Mesh(bgeo);
  bgeo.translate(0, 1.5, 0);
  box.visible = false;
  const geo = new SphereGeometry(0.5);
  const mat = new MeshBasicMaterial({ color: 0xffff00 });
  const head = new Mesh(geo, mat);
  geo.translate(0, 1.5, 0);
  obj.add(box);
  obj.add(head);
  const geometry = new CylinderGeometry(0.5, 0.5, 2);
  const material = new MeshBasicMaterial({ color: 0xff0000 });
  const body = new Mesh(geometry, material);
  obj.add(body);
  obj.translateY(1 + (lv - 1) * BUILDING_LEVEL_HEIGHT);
  obj.translateX(lat);
  obj.translateZ(lon);
  obj.addEventListener("click", console.log);
  // scene.add(obj); body.name = obj.name =
  box.name = d?.name || "保安";
  Object.assign(box.userData, d, { intable: true, type: "baoan" });
  return obj;
};

export const initScene = (canvas: HTMLCanvasElement) => {
  const scene = new Scene();
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const control = new OrbitControls(camera, canvas);
  const fcontrol = new PointerLockControls(camera, canvas);
  const change$$ = new BehaviorSubject<{ action: string; data?: any }>({
    action: "",
  });
  let currentControl: OrbitControls | PointerLockControls = control;
  const ground = buildGround(200, 80);
  const objects = [];
  // objects.push(ground
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth * 2, window.innerHeight * 2);

  const originPoint = new Vector3(0, 0, 0);
  const buildings: { [key: string]: Building } = {};
  [
    ["b1", 40, 15, 22, -80],
    ["b2", 40, 15, 12, -38],
    ["b3", 40, 15, 12, 38],
    ["b4", 40, 15, 22, 80],
    ["ud", 200, 80, 3, 0, 0, -BUILDING_LEVEL_HEIGHT * 3 - 0.3],
  ].forEach((data, index) => {
    const bm = BuildingManager.current;
    bm.add(data[0] as string, data.slice(1, 4) as any)
      .moveTo(...(data.slice(4) as any))
      .addToScene(scene);
  });
  [
    { name: "小王", id: "1", coords: [] },
    { name: "小李", id: "2", coords: [30, 0] },
    { name: "小张", id: "3", coords: [-100, 0] },
  ].forEach((el) => {
    const gm = GuardManager.current;
    gm.add(el.id, el.coords).enterZone(24).addToScene(scene).setData(el);
  });
  // objects.push(createGuarder(scene, { name: "小王" }));
  // objects.push(createGuarder(scene, { name: "小李" }, 30, 0, 2));
  // objects.push(createGuarder(scene, { name: "小张" }, -100, 0, 10));
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";

  const g4 = createGuarder(scene, { name: "小二" }, -100, 0, -1);
  const cameraInit = [45, 190, 120] as [number, number, number];
  camera.position.set(...cameraInit);
  objects.push(g4);
  control.update();
  const raycaster = new Raycaster();
  const pointer = new Vector2(-1, -1);
  scene.background = new Color("gray");
  let dir = 1;
  const render = () => {
    const tx = g4.position.x + (dir ? 0.1 : -0.1);
    if (tx > 100) {
      dir = 0;
    } else if (tx < -100) {
      dir = 1;
    } else {
      g4.position.x = tx;
    }
  };
  let changed = false;
  control.maxDistance = 1000;
  control.minDistance = 10;
  control.minPolarAngle = (Math.PI ) / 6;
  control.maxPolarAngle = (Math.PI * 0.99) / 2;
  function animate(time: number) {
    requestAnimationFrame(animate);
    render();
    // setTimeout(() => {
    //   animate()
    // }, 50);
    (currentControl as any)?.update?.();
    renderer.render(scene, camera);
    TWEEN.update(time);
  }
  console.log(objects);
  // scene.add(fcontrol.getObject());
  objects.forEach((el) => scene.add(el));
  canvas.addEventListener("mouseleave", () => {
    pointer.x = -1;
    pointer.y = -1;
    console.log("leave");
  });
  //
  control.minZoom = 0.5;
  control.maxZoom = 3;
  canvas.style.cursor = "pointer";
  let ap: any = null;
  const click$$ = new Subject<PointerEvent>();
  const longpress$$ = new Subject<PointerEvent>();
  canvas.addEventListener("pointerdown", (ev) => {
    ap = ev;
  });
  canvas.addEventListener("pointerup", (ev) => {
    if (ap) {
      if (ev.timeStamp - ap.timeStamp < 300) click$$.next(ev);
      else longpress$$.next(ev);
      ap = null;
    }
  });
  canvas.addEventListener("pointercancel", () => (ap = null));
  canvas.addEventListener("pointerout", () => (ap = null));
  canvas.addEventListener("pointerleave", () => (ap = null));
  let sub: Subscription | null;
  let tween: any;
  let cur: any;
  const quit = () => {
    sub?.unsubscribe();
    change$$.next({ action: "reset" });
    currentControl = control;
    control.enabled = true;
    cur = null;
  };
  click$$.subscribe((ev) => {
    pointer.x = (ev.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(ev.clientY / window.innerHeight) * 2 + 1;
    // console.log(ev);
    // console.log(pointer);
    raycaster.setFromCamera(pointer, camera);
    console.time("check");
    const olist = raycaster.intersectObjects(scene.children, true);
    console.log(olist);
    const list = olist.filter((el) => el.object.userData?.intable);
    console.timeEnd("check");
    console.log(list);
    if (list.length) {
      const obj = list[0].object as Mesh<any, MeshStandardMaterial>;
      change$$.next({
        action: "pick",
        data: obj.userData,
      });
      if (obj.userData?.type === "floor") {
        if (cur) return quit();
        cur = obj;
        sub?.unsubscribe();
        currentControl = fcontrol;
        sub = Building.focusLevel(obj, currentControl).subscribe((v) => {
          console.log(v);
        });
        control.enabled = false;
      }
      console.log(obj.userData);
    } else {
      quit();
    }
  });

  requestAnimationFrame(animate);
  // console.log(scene);
  window.onresize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  return {
    // dispose() {
    //   scene.clear();
    //   scene.removeFromParent();
    // },
    change$$,
  };
};
