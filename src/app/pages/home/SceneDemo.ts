import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { AppEngine, SceneBase } from './engine';
import { Building, Human, ObjectBase } from './objects';

export class SceneDemo extends SceneBase<{
  camPos: Vector3;
  camTar: Vector3;
  buildings: any[];
  persons: any[];
}> {
  interaction = false;
  constructor() {
    super('demo');
  }
  initialize(app: AppEngine, meta = {}) {
    super.initialize(
      app,
      Object.assign(
        {
          camPos: new Vector3(40, 220, 260),
          camTar: new Vector3(0, 0, 0),
          buildings: [],
          persons: [],
        },
        meta
      )
    );
    this.setupCamera();
    this.setupLight();
    this.setupGround();
    this.setupBuildings();
    this.setupPersons();
    return this;
  }
  update() {
    super.update();
  }
  recoverCamera(camName = 'main') {
    return this.moveCamera(
      camName,
      this.meta.camPos.clone(),
      this.meta.camTar.clone()
    );
  }
  private buildings: { [key: string]: Building } = {};
  public selectedBuilding: Building | null = null;
  setupBuildings() {
    this.meta.buildings.forEach((el) => {
      const b = new Building(this, el.id, el.size as any, !!el.under, {});
      b.moveTo(...el.pos);
      b.wallClicked$().subscribe((v) => {
        if (!this.canInteractive) return console.warn(`太忙了`);
        const sess = this.session.child('focus');
        sess.clear();
        sess.addClear(
          b.focus().subscribe((v) => {
            console.log(v);
          })
        );
        sess.addClear(() => (this.selectedBuilding = null));
        this.selectedBuilding = b;
      });
      this.buildings[el.id] = b;
    });
  }
  setupPersons() {
    this.meta.persons.forEach((el) => {
      const baoan = new Human(el.id, this, 3, 1, el);
      const building = this.buildings[el.bid];
      const [floor = 1, x = 0, y = 0] = el.pos;
      building.addToFloor(floor, baoan, x, y);
    });
  }
  setupCamera() {
    const camera = new ArcRotateCamera(
      'main',
      -Math.PI / 3,
      Math.PI / 2.5,
      3,
      this.meta.camTar.clone(),
      this.sceneObj
    );
    camera.attachControl(this.engine.engine.getRenderingCanvas(), true);
    camera.setPosition(this.meta.camPos.clone());
  }
  setupLight() {
    new HemisphericLight('dir', new Vector3(40, 40, 40), this.sceneObj);
  }
  setupGround() {
    const sceneObj = this.sceneObj;
    const gc = new ObjectBase('ground', this, 1);
    // const baseMat = new StandardMaterial("matpbr", sceneObj);
    // baseMat.alpha = 0.8;
    // baseMat.alphaMode = Material.MATERIAL_ALPHABLEND;
    // const ground = CreateGround("ground1", { width: 32, height: 12 }, sceneObj);
    // ground.material = baseMat.clone("ground");
    // sceneObj.addMesh(ground);
    // gc.addPart(ground)
  }
  reset() {
    if (!this.canInteractive) return console.log(`skip`);
    this.recoverCamera().subscribe((v) => {
      console.log(v);
    });
    this.session.child('focus').clear();
  }
}
