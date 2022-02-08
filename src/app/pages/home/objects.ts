import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Observable, Subscriber } from 'rxjs';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Material } from '@babylonjs/core/Materials/material';
import { CreateBox } from '@babylonjs/core/Meshes/Builders/boxBuilder';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { CreateGround } from '@babylonjs/core/Meshes/Builders/groundBuilder';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { ActionManager } from '@babylonjs/core/Actions/actionManager';
import { ExecuteCodeAction } from '@babylonjs/core/Actions/directActions';
import { ActionEvent } from '@babylonjs/core/Actions/actionEvent';
import { CreateCapsule } from '@babylonjs/core/Meshes/Builders/capsuleBuilder';
import { SceneBase } from './engine';
import { Process } from 'src/shared/page';

export class ObjectBase<T = any> extends TransformNode {
  public static readonly Objects = new Set<ObjectBase>();
  protected session: Process;
  public readonly metadata: T = {} as any;
  constructor(name: string, scene: SceneBase, height = 1, meta?: any) {
    super(name, scene.sceneObj);
    Object.assign(this.metadata, meta, { instance: this });
    this.session = new Process(name);
    this.setPivotPoint(new Vector3(0, -height / 2, 0));
    ObjectBase.Objects.add(this);
  }
  addPart(e: TransformNode) {
    e.metadata = Object.assign({}, e.metadata, this.metadata);
    e.parent = this;
  }
  moveTo(lat = 0, lon = 0, hoz = 0) {
    this.position.addInPlace(new Vector3(lat, hoz, lon));
    return this;
  }
  destroy() {
    this.session.clear();
  }
  onMessage(msg: any, sender: ObjectBase) {}
  broadcast(msg: any, target?: ObjectBase) {
    if (target) {
      target.onMessage(msg, this);
    } else {
      ObjectBase.Objects.forEach(
        (el) => el !== this && el.onMessage(msg, this)
      );
    }
  }
}
interface MovebalItem extends ObjectBase {
  getObject(): Mesh;
  getSize(): [number, number, number];
}

export class Building extends ObjectBase {
  public wall!: Mesh;
  public floors: Mesh[] = [];
  level: number;
  depth: number;
  width: number;
  levelHeight: number;
  wallActionManager?: ActionManager;
  get height() {
    return this.levelHeight * this.level;
  }
  get sceneObj() {
    return this.scene.sceneObj;
  }
  constructor(
    public readonly scene: SceneBase,
    public readonly name: string,
    public readonly size: [number, number, number, number], // w,h,d
    public readonly isUnderground = false,
    data: any
  ) {
    super(name, scene, size[2] * size[3], data);
    Object.assign(this.metadata, {
      type: 'building',
      building: '' as any as Building,
    });
    this.width = size[0];
    this.depth = size[1];
    this.level = size[2];
    this.levelHeight = size[3];
    if (isUnderground) {
      this.position.addInPlace(new Vector3(0, -this.height));
    }
    this.buildWall();
    this.buildFloors();
    this.metadata.building = this;
  }
  buildWall() {
    const sceneObj = this.sceneObj;
    const box = CreateBox(this.name + '-wall', {
      width: this.width,
      height: this.height,
      depth: this.depth,
    });
    const baseMat = new StandardMaterial('matpbr', sceneObj);
    baseMat.alpha = 0.8;
    baseMat.alphaMode = Material.MATERIAL_ALPHABLEND;
    box.material = baseMat;
    // box.enableEdgesRendering();
    // box.enablePointerMoveEvents = false;
    // box.edgesWidth = 1.5;
    // box.edgesColor = new Color4(0, 0, 1, 1);
    // const Base = new Vector3(x, y + GROUP_DOWN, z);
    // box.position.addInPlace(Base);
    box.locallyTranslate(new Vector3(0, this.height / 2, 0));
    // box.visibility = 0.2;
    this.wall = box;
    box.metadata = this.metadata;
    this.addPart(box);
  }
  buildFloors() {
    const sceneObj = this.sceneObj;
    // const startHoz = this.isUnderground ? -this.height : 0;
    for (let i = 0; i < this.level; i++) {
      const fname = this.name + '-floor-' + i;
      const floor = CreateGround(
        fname,
        {
          width: this.width,
          height: this.depth,
        },
        sceneObj
      );
      floor.parent = this;
      floor.position.addInPlace(new Vector3(0, i * this.levelHeight));
      this.floors[i + 1] = floor;
      floor.material = new StandardMaterial('matpbr', sceneObj);
      floor.material.alpha = 0.3;
      floor.metadata = this.metadata;
      floor.actionManager = new ActionManager(sceneObj);
      floor.actionManager.registerAction(
        new ExecuteCodeAction(
          {
            trigger: ActionManager.OnPickTrigger,
          },
          (ev) => {
            console.log(ev);
          }
        )
      );
    }
  }
  addToFloor(lv: number, node: MovebalItem, x = 0, y = 0, isAbs = false) {
    const floor = this.getFloor(lv);
    if (isAbs) console.log(`ans pos`);
    const [, w] = node.getSize();
    x = makeBetween(x, -this.width / 2 + w / 2, this.width / 2 - w / 2);
    y = makeBetween(y, -this.depth / 2 + w / 2, this.depth / 2 - w / 2);
    node.position.addInPlace(new Vector3(x, 0, y));
    node.parent = floor;
  }
  getFloor(level: number) {
    if (!this.isUnderground) return this.floors[level];
    const i = this.level + 1 + level;
    return this.floors[i];
  }
  setData() {
    return this;
  }
  hideWall() {
    this.wall.setEnabled(false);
  }
  showWall() {
    // this.wall.actionManager = this.wallActionManager!;
    // this.wall.visibility = 1;
    this.wall.setEnabled(true);
  }
  static currentSuber: Subscriber<any>;
  wallClicked$() {
    return new Observable<ActionEvent>((suber) => {
      const box = this.wall;
      box.actionManager = new ActionManager(this.sceneObj);
      let downTime = 0;
      box.actionManager.registerAction(
        new ExecuteCodeAction(
          { trigger: ActionManager.OnPickDownTrigger },
          () => {
            downTime = Date.now();
          }
        )
      );
      box.actionManager.registerAction(
        new ExecuteCodeAction(
          { trigger: ActionManager.OnPickUpTrigger },
          (ev) => {
            if (Date.now() - downTime < 200) {
              suber.next(ev);
            } else {
              console.warn(`long press`);
            }
          }
        )
      );
      const cancel = this.session.addClear(() => {
        suber.complete();
        box.actionManager = null;
      });
      return cancel;
    });
  }
  focus() {
    const sess = this.session.child('focus');
    sess.clear();
    return new Observable((suber) => {
      this.hideWall();
      this.broadcast({ type: 'hide.building' });
      const camPos = this.position.add(
        new Vector3(
          0,
          Math.max(this.width, this.height) * 1.5,
          Math.max(this.width, this.height) * 1.2
        )
      );
      sess.addClear(
        this.scene
          .moveCamera('main', camPos, new Vector3(this.position.x, 0, 0))
          .subscribe((v) => {
            console.log(v);
          })
      );
      suber.next({
        cancel: () => suber.complete(),
      });
      return () => {
        this.showWall();
        this.broadcast({ type: 'show.building' });
        this.session.child('focus').clear();
      };
    });
  }
  onMessage(msg: any, sender: ObjectBase<any>): void {
    if (msg?.type === 'hide.all' || msg?.type === 'hide.building') {
      if (msg.id && msg.id !== this.metadata?.id) return;
      this.setEnabled(false);
    } else if (msg?.type === 'show.all' || msg?.type === 'show.building') {
      if (msg.id && msg.id !== this.metadata?.id) return;
      this.setEnabled(true);
    }
  }
}

function makeBetween(num: number, min: number, max: number) {
  if (num > max) return max;
  else if (num < min) return min;
  return num;
}

export class Human extends ObjectBase implements MovebalItem {
  private body: Mesh;
  constructor(
    name: string,
    scene: SceneBase,
    public readonly height = 3,
    public readonly round = 1,
    meta?: any
  ) {
    super(name, scene, height, meta);
    this.metadata.instance = this;
    const mat = new StandardMaterial(`human`, scene.sceneObj);
    mat.diffuseColor = new Color3(1, 0, 1);
    mat.specularColor = new Color3(0.5, 0.6, 0.87);
    mat.emissiveColor = new Color3(1, 1, 1);
    mat.ambientColor = new Color3(0.23, 0.98, 0.53);
    const humanSim = CreateCapsule(name, { height, radius: round });
    humanSim.material = mat;
    humanSim.position.addInPlace(new Vector3(0, height / 2, 0));
    humanSim.actionManager = new ActionManager(scene.sceneObj);
    humanSim.actionManager.registerAction(
      new ExecuteCodeAction(
        { trigger: ActionManager.OnPointerOverTrigger },
        (ev) => {
          console.log(ev);
          scene.engine.event$.next({ type: 'hover-human', human: this });
        }
      )
    );
    this.addPart(humanSim);
    this.body = humanSim;
  }
  getObject(): Mesh {
    return this.body;
  }
  getSize() {
    return [this.round * 2, this.round * 2, this.height] as any;
  }
  onMessage(msg: any, sender: ObjectBase<any>): void {
    if (msg?.type === 'hide.all' || msg?.type === 'hide.human') {
      if (msg.id && msg.id !== this.metadata?.id) return;
      this.setEnabled(false);
    } else if (msg?.type === 'show.all' || msg?.type === 'show.human') {
      if (msg.id && msg.id !== this.metadata?.id) return;
      this.setEnabled(true);
    }
  }
}
