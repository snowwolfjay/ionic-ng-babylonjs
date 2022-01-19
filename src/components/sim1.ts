import { BehaviorSubject } from "rxjs";
import { Mesh, MeshBasicMaterial, SphereGeometry } from "three";
import ThreeRenderObjects from "three-render-objects";

export const initScene = (cvs: HTMLCanvasElement) => {
  const N = 300;
  const COORD_RANGE = 300;
console.log(cvs)
  const objs = [...Array(N)].map(
    () =>
      new Mesh(
        new SphereGeometry(10, 16, 16),
        new MeshBasicMaterial({ color: "red", transparent: true, opacity: 0.6 })
      )
  );

  objs.forEach((obj) => {
    ["x", "y", "z"].forEach(
      (dim) =>
        ((obj.position as any)[dim] =
          Math.random() * COORD_RANGE * 2 - COORD_RANGE)
    );
  });

  const ObjRender = ThreeRenderObjects({ controlType: "trackball" })(
    cvs
  ).objects(objs);

  (function animate() {
    ObjRender.tick(); // render it
    requestAnimationFrame(animate);
  })();

  return {
      change$$:new BehaviorSubject<any>({})
  }
};
