import { AfterViewInit, Component, ElementRef, HostListener, ViewChild, Output, EventEmitter } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { Camera, CubeTexture, Engine, MeshBuilder, Scene, StandardMaterial, Texture, Vector3, AssetsManager, MeshAssetTask, Color3, Mesh, DirectionalLight, FlyCamera, HemisphericLight, ShadowGenerator, Color4 } from '@babylonjs/core';
import '@babylonjs/loaders/OBJ';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements AfterViewInit {
  @ViewChild('gameCanvas') canvas: ElementRef;
  @Output() quitGame: EventEmitter<void> = new EventEmitter<void>();

  public engine: Engine;
  public scene: Scene;
  public camera: Camera;

  public assetsManager: AssetsManager;

  public ambientLight: HemisphericLight;
  public sun: DirectionalLight;
  public terrain: Mesh;
  public ocean: Mesh;
  public skyBox: Mesh;

  public shadowGenerator: ShadowGenerator;

  public time: number;
  public hourFactor: number;
  public day: number;
  public lightColors: Array<{ r: number, g: number, b: number }>;

  public gameVariables: Array<any>;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.engine.resize();
  }

  @HostListener('document:keydown', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent): void {
    console.log(`[KEY DOWN] ${event}`);
  }

  constructor() {
    this.hourFactor = 60;
    this.time = 8 * this.hourFactor;
    this.day = 1;

    setInterval(() => {
      this.time++;
      if (this.time >= 24 * this.hourFactor) {
        this.time = 0;
        this.day++;
      }
      this.dayNightCycle();
    }, 1000);
  }

  ngAfterViewInit() {
    this.lightColors = [
      { r: 23, g: 23, b: 55 },
      { r: 23, g: 23, b: 55 },
      { r: 23, g: 23, b: 55 },
      { r: 23, g: 23, b: 55 },
      { r: 23, g: 23, b: 55 },
      { r: 40, g: 40, b: 70 },
      { r: 70, g: 70, b: 120 },
      { r: 255, g: 100, b: 50 },
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 100, b: 50 },
      { r: 100, g: 100, b: 150 },
      { r: 40, g: 40, b: 70 }
    ];

    this.engine = new Engine(this.canvas.nativeElement, true); // Generate the BABYLON 3D engine
    this.createScene(); // Call the createScene function
    this.createSkyBox();
    this.createTerrain();
    this.createOcean();
  }

  createScene(): void {
    // Create Empty Scene
    this.scene = new Scene(this.engine);
    this.scene.clearColor = Color4.FromInts(23, 23, 55, 255);

    // Create Camera
    this.camera = new FlyCamera('Camera', new Vector3(0, 20, 0), this.scene);
    this.camera.attachControl(this.canvas.nativeElement, true);

    // Create Ambient Light
    this.ambientLight = new HemisphericLight('AmbientLight', new Vector3(0, -1, 0), this.scene);
    this.ambientLight.groundColor = new Color3(0.5, 0.5, 0.5);

    // Create Sun Light and Shadow Generator
    const sunLightDirection: Vector3 = new Vector3(-1, -1, -1);
    const sunPosition: Vector3 = new Vector3(0, 30, 50);
    this.sun = new DirectionalLight('Sun', sunLightDirection, this.scene);
    this.sun.specular = new Color3(0.2, 0.2, 0.2);
    this.sun.diffuse = new Color3(0.5, 0.5, 0.5);
    this.sun.position = sunPosition;
    const sunBall = MeshBuilder.CreateSphere('SunBall', {}, this.scene);
    sunBall.position = sunPosition;
    this.shadowGenerator = new ShadowGenerator(1024, this.sun);

    // Register Assets Manager
    this.assetsManager = new AssetsManager(this.scene);
    const meshTask = this.assetsManager.addMeshTask('skull task', '', '/assets/objects/', 'palmtree01.obj');

    meshTask.onSuccess = (task: MeshAssetTask) => {
      task.loadedMeshes.forEach((mesh: Mesh) => {
        mesh.position = new Vector3(0, 0, 50);
        mesh.scaling = new Vector3(0.25, 0.25, 0.25);
        const material: StandardMaterial = mesh.material as StandardMaterial;
        material.backFaceCulling = false;
        material.diffuseTexture.hasAlpha = true;

        // Cast Shadow
        this.shadowGenerator.addShadowCaster(mesh);
      });
    };

    this.assetsManager.onFinish = () => {
      // Register a render loop to repeatedly render the scene
      this.engine.runRenderLoop(() => this.mainLoop());
    };

    this.assetsManager.load();
  }

  mainLoop() {
    // Render Scene
    this.scene.render();
  }

  createSkyBox() {
    this.skyBox = MeshBuilder.CreateBox('skyBox', { size: 500.0 }, this.scene);
    const skyboxMaterial = new StandardMaterial('skyBox', this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new CubeTexture('/assets/textures/TropicalSunnyDay', this.scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.disableLighting = true;
    this.skyBox.material = skyboxMaterial;
  }

  createTerrain() {
    this.terrain = Mesh.CreateGroundFromHeightMap(
      'terrain',
      '/assets/textures/heightmap.png',
      200,
      200,
      250,
      0,
      10,
      this.scene,
      false,
      () => {
        const desertMaterial: StandardMaterial = new StandardMaterial('desert', this.scene);
        const desertTexture: Texture = new Texture('/assets/textures/desert.jpeg', this.scene);
        desertTexture.uScale = 15;
        desertTexture.vScale = 15;
        desertMaterial.diffuseTexture = desertTexture;
        this.terrain.material = desertMaterial;

        this.terrain.receiveShadows = true;
      });
  }

  createOcean() {
    this.ocean = MeshBuilder.CreatePlane('plane', {}, this.scene);
    const oceanMaterial: StandardMaterial = new StandardMaterial('ocean', this.scene);
    const oceanTexture: Texture = new Texture('/assets/textures/ocean.jpg', this.scene);
    oceanTexture.uScale = 15;
    oceanTexture.vScale = 15;
    oceanMaterial.diffuseTexture = oceanTexture;
    oceanMaterial.alpha = 0.5;
    this.ocean.material = oceanMaterial;
    this.ocean.position = new Vector3(0, 2, 0);
    this.ocean.rotation = new Vector3(Math.PI / 2, 0, 0);
    this.ocean.scaling = new Vector3(200, 200, 200);
  }

  dayNightCycle() {
    const fullHour: number = Math.floor(this.time / this.hourFactor);
    const minuteFactor: number = (this.time % this.hourFactor) / this.hourFactor;

    const currentSunLight: Color3 = Color3.FromInts(
      (1 - minuteFactor) * this.lightColors[fullHour].r + minuteFactor * this.lightColors[(fullHour + 1) % 24].r,
      (1 - minuteFactor) * this.lightColors[fullHour].g + minuteFactor * this.lightColors[(fullHour + 1) % 24].g,
      (1 - minuteFactor) * this.lightColors[fullHour].b + minuteFactor * this.lightColors[(fullHour + 1) % 24].b
    );
    const currentAmbientLight = currentSunLight.subtract(new Color3(0.25, 0.25, 0.25));

    this.ambientLight.groundColor = currentAmbientLight;
    this.ambientLight.specular = currentAmbientLight;
    this.ambientLight.diffuse = currentAmbientLight;

    this.sun.specular = currentSunLight;
    this.sun.diffuse = currentSunLight;

    if (this.time <= 4 * this.hourFactor) {
      this.skyBox.material.alpha = 0.1;
    } else if (this.time > 4 * this.hourFactor && this.time <= 5 * this.hourFactor) {
      this.skyBox.material.alpha = 0.2;
    } else {
      this.skyBox.material.alpha = 1;
    }
  }


  /* In-Game Functions */
  abs(value: number): number {
    return Math.abs(value);
  }
  add() { }
  addscript(className: any, id: any, source: any) { }
  addstate(className: any, id: any, state: any) { }
  air(time: number) { }
  ai_behavioursignal(aiSignal: any, behaviour: any, radius?: number, className?: any, id?: any) { }
  ai_center(unitId: number) { }
  ai_eater() { }
  ai_mode(unitId: number, mode: any, targetClass?: any, targetId?: any) { }
  ai_signal(aiSignal: any, radius?: number, className?: string, id?: number) { }
  ai_stay(unitId: number, mode?: any) {}
  ai_typesignal(aiSignal: any, type: any, radius?: number, className?: string, id?: number) {}
  alpha(value: number, className: string, id: number) {}
  alteritem(amount: number, type: any, newAmount?: number, newType?: any) {}
  alterobject(objectId: number, objectType: any) {}
  ambientsfx(fileName: string) {}
  animate(unitId: number, startFrame: number, endFrame: number, speed: number, mode?: any) {}
  areal_event(event: any, x: number, y: number, z: number, radius?: number, eventLimit?: any) {}
  areal_state(state: any, x: number, y: number, z: number, radius?: number) {}
  autoload() {}
  autosave() {}
  behaviour(className: string, typId: number) {}
  blend(mode: any, className?: string, id?: number) {}
  blur(value: number) {}
  buffer() {}
  buildsetup(id: number, cameraHeight?: number) {}
  builtat(objectId: number) {}
  button(id: number, text: string, icon?: any, script?: any) {}
  callscript(server: any, path: string, execute?: boolean) {}
  camfollow(time: any, className: string, id: number, x: number, y: number, z: number) {}
  cammode(time: any, mode: any, className?: string, id?: number) {}
  campath(time: any, stepTime: any, ids: number[]) {}
  clear() {}
  climate() {}
  closemenu() {}
  color(red: number, green: number, blue: number, className?: string, id?: number) {}
  compare_behaviour(className: string, id: number, behaviour: any) {}
  compare_material(className: string, id: number, material: any) {}
  compass(show: boolean) {}
  con(command: any) {}
  consume(energy?: number, hunger?: number, thirst?: number, exhaustion?: number) {}
  copychildren(className: string, id: number, variables?: any, items?: any, states?: any, script?: any, add?: any) {}
  corona(x: number, z: number, radius?: number, red?: number, green?: number, blue?: number, speed?: number, unitId?: number) {}
  cos(value: number, factor: number) {}
  count(className: string, type: any) {}


  /* Scripts */
  makeFire() {
    /* this.gameVariables['barkbranchfire'] = 0;
    this.event("barkbranchfire1", "global");
    this.process("Feuer machen", 4500, "barkbranchfire2");
    this.play("barkbranchfire.wav");
    this.skipevent(); */
  }

  /* GUI Menus */
  adventure() {
    console.info('Adventure will start now.');
  }

  randomIsland() {

  }

  singleIsland() {

  }

  loadIsland() {

  }

  options() {

  }

  editor() {

  }

  credits() {

  }

  quit() {
    this.quitGame.emit();
  }
}
