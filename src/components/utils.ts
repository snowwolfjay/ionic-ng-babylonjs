import { BoxGeometry, Mesh, MeshNormalMaterial } from "three";

const bmat = new MeshNormalMaterial({ transparent: true, opacity: 0.3 });

export function getWallBase(l = 1, w = 1, h = 1, geo?: any) {
  geo = geo || new BoxGeometry(l, h, w);
  const obj = new Mesh(geo, bmat.clone());
  return obj.translateY(h / 2);
}
