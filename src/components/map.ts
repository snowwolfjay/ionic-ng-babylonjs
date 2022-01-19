import {
  BoxGeometry,
  BufferGeometry,
  CylinderGeometry,
  DirectionalLight,
  DirectionalLightHelper,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
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
import { animate, easeInOut } from "popmotion";
import { toastController } from "@ionic/core";
import { BehaviorSubject } from "rxjs";
import ThreeRenderObjects from "three-render-objects";

const BUILDING_LEVEL_HEIGHT = 6;

const buildGround = (width: number, height: number) => {
  const geo = new BoxGeometry(width, 1, height);
  const mat = new MeshNormalMaterial({ transparent: true, opacity: 0.5 });
  const obj = new Mesh(geo, mat);
  obj.position.add(new Vector3(0, -0.5, 0));
  return obj;
};

const bmat = new MeshNormalMaterial({ transparent: true, opacity: 0.5 });
const fmat = new MeshNormalMaterial({ opacity: 0.5, colorWrite: true });
const createBuilding = (
  scene: Scene,
  w: number,
  d: number,
  lv: number,
  lat: number,
  lon: number,
  hoz = 0
) => {
  const h = lv * BUILDING_LEVEL_HEIGHT;
  const geo = new BoxGeometry(w, d, h);
  // geo.translate(lat, lon, h / 2 + hoz);
  const obj = new Mesh(geo, bmat);
  // var axes = new AxesHelper(20);
  // obj.add(axes);
  // scene.add(obj);
  const bfgeo = new BoxGeometry(w, d, 0.2, w / 0.1);
  const floor = new Mesh(bfgeo, fmat);
  for (let i = lv; i--; ) {
    const ff = floor.clone();
    // floor.rotateX(Math.PI / 2);
    // ff.translateX(lat);
    // ff.translateY(hoz + i * BUILDING_LEVEL_HEIGHT);
    // ff.translateZ(lon);
    obj.add(ff);
  }
  obj.name = "jianz";
  // obj.userData.intable = true
  return obj;
};

const createGuarder = (scene: Scene, d: any, lat = 0, lon = 0, lv = 1) => {
  const obj = new Object3D();
  const geo = new SphereGeometry(1);
  const mat = new MeshBasicMaterial({ color: 0xffff00 });
  const head = new Mesh(geo, mat);
  geo.translate(0, 3, 0);

  obj.add(head);
  const geometry = new CylinderGeometry(1, 1, 4);
  const material = new MeshBasicMaterial({ color: 0x0000ff });
  const body = new Mesh(geometry, material);
  obj.add(body);
  obj.translateY(2 + (lv - 1) * BUILDING_LEVEL_HEIGHT);
  obj.translateX(lat);
  obj.translateZ(lon);
  obj.addEventListener("click", console.log);
  // scene.add(obj);
  head.name = body.name = obj.name = d?.name || "保安";
  Object.assign(obj.userData, d, { intable: true });
  head.userData = body.userData = obj.userData;
  return obj;
};

export const initScene = (canvas: HTMLCanvasElement) => {
  // const scene = new Scene();
  // const camera = new PerspectiveCamera(
  //   75,
  //   window.innerWidth / window.innerHeight,
  //   0.1,
  //   1000
  // );
  // const control = new OrbitControls(camera, canvas);

  const myCanvas = ThreeRenderObjects({
    controlType: "orbit",
    rendererConfig: { antialias: true, alpha: true },
  })(canvas);

  const change$$ = new BehaviorSubject<{ action: string; data?: any }>({
    action: "",
  });
  const ground = buildGround(200, 80);
  const objects = [];
  // objects.push([ground]);
  // const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  // renderer.setSize(window.innerWidth * 2, window.innerHeight * 2);
  // var axes = new AxesHelper(20);
  // scene.add(axes);
  // createSun(scene);
  const scene = myCanvas.scene();
  // myCanvas.cameraPosition({x:20,y:-20,z:100})
  objects.push(createBuilding(scene, 40, 15, 22, -80, 0));
  objects.push(createBuilding(scene, 40, 15, 12, -40, 0));
  objects.push(createBuilding(scene, 40, 15, 12, 40, 0));
  objects.push(createBuilding(scene, 40, 15, 22, 80, 0));
  objects.push(
    createBuilding(scene, 200, 80, 3, 0, 0, -BUILDING_LEVEL_HEIGHT * 3)
  );
  objects.push(createGuarder(scene, { name: "小王" }));
  objects.push(createGuarder(scene, { name: "小李" }, 30, 0, 2));
  objects.push(createGuarder(scene, { name: "小张" }, -100, 0, 10));
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  const lmat = new LineBasicMaterial({ color: 0x0000ff });
  const points = [];
  points.push(new Vector3(-10, 0, 0));
  points.push(new Vector3(0, 10, 0));
  points.push(new Vector3(10, 0, 0));

  const geometry = new BufferGeometry().setFromPoints(points);

  const line = new Line(geometry, lmat);
  // scene.add(line);

  // const g4 = createGuarder(scene, { name: "小二" }, -100, 0, -1);
  // camera.position.y = 45;
  // camera.position.z = 70;
  // camera.position.x = 20;
  myCanvas.cameraPosition({ x: 70, y: 45, z: 20 });
  const raycaster = new Raycaster();
  const pointer = new Vector2(-1, -1);
  let dir = 1;
  const render = () => {
    // const tx = g4.position.x + (dir ? 0.1 : -0.1);
    // if (tx > 100) {
    //   dir = 0;
    // } else if (tx < -100) {
    //   dir = 1;
    // } else {
    //   g4.position.x = tx;
    // }
  };
  let changed = false;
  function animate() {
    requestAnimationFrame(animate);
    render();
    // setTimeout(() => {
    //   animate()
    // }, 50);
    // control.update();
    // renderer.render(scene, camera);
    myCanvas.tick();
  }
  console.log(objects);
  myCanvas.objects(objects);
  document.addEventListener("mouseleave", () => {
    pointer.x = -1;
    pointer.y = -1;
    console.log("leave");
  });
  //
  //
  document.body.style.cursor = "pointer";
  // document.addEventListener("click", (ev) => {
  //   pointer.x = (ev.clientX / window.innerWidth) * 2 - 1;
  //   pointer.y = -(ev.clientY / window.innerHeight) * 2 + 1;
  //   console.log(ev);
  //   console.log(pointer);
  //   raycaster.setFromCamera(pointer, camera);
  //   console.time("check");
  //   const intersects = raycaster
  //     .intersectObjects(scene.children, true)
  //     .filter((el) => el.object.userData?.intable);
  //   console.timeEnd("check");
  //   if (intersects.length) {
  //     const obj = intersects[0].object;
  //     // INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
  //     // INTERSECTED.material.emissive.setHex(0xff0000);
  //     change$$.next({
  //       action: "pick",
  //       data: obj.userData,
  //     });
  //     // setTimeout(() => {
  //     //   alert(`clicked ${obj.name}`);
  //     // }, 10);
  //     // const toast = document.createElement('ion-toast');
  //     // toast.message = 'Your settings have been saved.';
  //     // toast.duration = 2000;
  //     // document.body.appendChild(toast);
  //     // toast.onload = () =>console.error(toast)
  //     // return toast.present();
  //     // present(`点了${obj.name}`)

  //     // toastController
  //     //   .create({ message: `点了${obj.name}`, duration: 2000 })
  //     //   .then((a) => {
  //     //     console.log(a);
  //     //     a.present();
  //     //   });
  //   } else {
  //     change$$.next({ action: "reset" });
  //   }
  // });
  animate();
  // console.log(scene);
  window.onresize = () => {
    // camera.aspect = window.innerWidth / window.innerHeight;
    // camera.updateProjectionMatrix();
    // renderer.setSize(window.innerWidth, window.innerHeight);
    myCanvas.renderer().setSize(window.innerWidth, window.innerHeight);
    myCanvas.camera().updateMatrixWorld();
  };
  return {
    // dispose() {
    //   scene.clear();
    //   scene.removeFromParent();
    // },
    change$$,
  };
};
function createSun(scene: Scene) {
  const pointLight = new DirectionalLight(0xff0000, 0.5);
  pointLight.position.set(0, 20, 20);
  // scene.add(pointLight);

  const sphereSize = 1;
  const pointLightHelper = new DirectionalLightHelper(pointLight, sphereSize);
  scene.add(pointLightHelper);
}

function createLight(scene: Scene) {
  const pointLight = new PointLight(0xff0000, 1111, 200);
  pointLight.position.set(60, 60, 60);
  scene.add(pointLight);

  const sphereSize = 1;
  const pointLightHelper = new PointLightHelper(pointLight, sphereSize);
  scene.add(pointLightHelper);
}
