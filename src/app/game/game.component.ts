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

  public inGameTime: number;
  public hourFactor: number;
  public inGameDay: number;
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
    this.inGameTime = 8 * this.hourFactor;
    this.inGameDay = 1;

    setInterval(() => {
      this.inGameTime++;
      if (this.inGameTime >= 24 * this.hourFactor) {
        this.inGameTime = 0;
        this.inGameDay++;
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
    const fullHour: number = Math.floor(this.inGameTime / this.hourFactor);
    const minuteFactor: number = (this.inGameTime % this.hourFactor) / this.hourFactor;

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

    if (this.inGameTime <= 4 * this.hourFactor) {
      this.skyBox.material.alpha = 0.1;
    } else if (this.inGameTime > 4 * this.hourFactor && this.inGameTime <= 5 * this.hourFactor) {
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
  ai_stay(unitId: number, mode?: any) { }
  ai_typesignal(aiSignal: any, type: any, radius?: number, className?: string, id?: number) { }
  alpha(value: number, className: string, id: number) { }
  alteritem(amount: number, type: any, newAmount?: number, newType?: any) { }
  alterobject(objectId: number, objectType: any) { }
  ambientsfx(fileName: string) { }
  animate(unitId: number, startFrame: number, endFrame: number, speed: number, mode?: any) { }
  areal_event(event: any, x: number, y: number, z: number, radius?: number, eventLimit?: any) { }
  areal_state(state: any, x: number, y: number, z: number, radius?: number) { }
  autoload() { }
  autosave() { }
  behaviour(className: string, typId: number) { }
  blend(mode: any, className?: string, id?: number) { }
  blur(value: number) { }
  buffer() { }
  buildsetup(id: number, cameraHeight?: number) { }
  builtat(objectId: number) { }
  button(id: number, text: string, icon?: any, script?: any) { }
  callscript(server: any, path: string, execute?: boolean) { }
  camfollow(time: any, className: string, id: number, x: number, y: number, z: number) { }
  cammode(time: any, mode: any, className?: string, id?: number) { }
  campath(time: any, stepTime: any, ids: number[]) { }
  clear() { }
  climate() { }
  closemenu() { }
  color(red: number, green: number, blue: number, className?: string, id?: number) { }
  compare_behaviour(className: string, id: number, behaviour: any) { }
  compare_material(className: string, id: number, material: any) { }
  compass(show: boolean) { }
  con(command: any) { }
  consume(energy?: number, hunger?: number, thirst?: number, exhaustion?: number) { }
  copychildren(className: string, id: number, variables?: any, items?: any, states?: any, script?: any, add?: any) { }
  corona(x: number, z: number, radius?: number, red?: number, green?: number, blue?: number, speed?: number, unitId?: number) { }
  cos(value: number, factor: number) { }
  count(className: string, type: any) { }
  count_behaviourinrange(className: string, behaviour: any, radius?: number, secondClassName?: string, secondId?: number) { }
  count_inrange(className: string, type: any, radius?: number, secondClassName?: string, secondId?: number) { }
  count_state(state: any) { }
  count_stored(className: string, id: number, type?: any) { }
  cracklock(text: string, mode: any, combination: any) { }
  create(className: string, type: any, x?: number, z?: number, amount?: number) { }
  credits() { }
  cscr(image?: any, closeable?: boolean) { }
  cscr_image(image: any, x: number, y: number, tooltip?: any, script?: any) { }
  cscr_text(text: string, x: number, y: number, color?: any, align?: any, tooltip?: any, script?: any) { }
  currentclass() { }
  currentid() { }
  damage(className: string, id: number, amount: number) { }
  day() { }
  debug(classOrMode: any, id?: number) { }
  decisionwin(text: string, font?: any, cancel?: any, okay?: any, image?: any) { }
  defparam(className: string, type: any, parameter: any) { }
  def_extend(className: string, type: any, source: any) { }
  def_free(className: string, type: any) { }
  def_override(className: string, type: any, source: any) { }
  dialogue(startPage: any, source: any) { }
  diary(title: string, source?: any) { }
  distance(firstClassName: string, firstId: number, secondClassName: string, secondId: number) { }
  downloadfile(server: any, path: string, file: any) { }
  drink(energy?: number, hunger?: number, thirst?: number, exhaustion?: number) { }
  eat(energy?: number, hunger?: number, thirst?: number, exhaustion?: number) { }
  echo(text: string) { }
  equip(itemType: any) { }
  event(eventName: any, className: string, id: number) { }
  exchange(className: string, id: number, store?: boolean, itemTypes?: any[]) { }
  exec(command: any) { }
  exists(className: string, id: number) { }
  exit() { }
  explosion(x: number, y: number, z: number, radius?: number, damage?: number, style?: any) { }
  extendentry(title: string, source?: any) { }
  extendscript(className: string, id: number, source?: any) { }
  extract(string: string, start: number, length?: number) { }
  fademusic(duration: number) { }
  fileexists(path: string) { }
  find(itemType: any, amount?: number) { }
  flash(red: number, green: number, blue: number, speed?: number, alpha?: number) { }
  free(className: string, id: number, amount?: number) { }
  freebutton(id: number) { }
  freeentry(title?: string) { }
  freescript(className: string, id: number) { }
  freescripts() { }
  freeskill(skill: any) { }
  freespace(x: number, y: number, z: number, radius?: number, objects?: boolean, units?: boolean, items?: boolean, infos?: boolean) { }
  freestate(className: string, id: number, state?: any) { }
  freestored(className: string, id: number, type: any, amount?: number) { }
  freetext(id: number) { }
  freetimers(className: string, id: number, source?: any) { }
  freeunitpath(unitId: number) { }
  freevar(variables: any[]) { }
  freevars(locals?: boolean) { }
  freeze(unitId?: number, mode?: any) { }
  fry() { }
  fx(mode: any, className?: string, id?: number) { }
  getamount(id: number) { }
  getlocal(className: string, id: number, variable: any) { }
  getoff() { }
  getpitch(className: string, id: number) { }
  getplayerammo() { }
  getplayervalue(value: number) { }
  getplayerweapon() { }
  getroll(className: string, id: number) { }
  getsetting(settingName: string) { }
  getstatevalue(className: string, id: number, state: any, value?: number) { }
  getstored(className: string, id: number, type?: any) { }
  getweather() { }
  getx(className: string, id: number) { }
  gety(className: string, id: number) { }
  getyaw(className: string, id: number) { }
  getz(className: string, id: number) { }
  gotskill(skill: any) { }
  gotstate(className: string, id: number, state: any) { }
  grasscolor(red: number, green: number, blue: number) { }
  growtime(type: any) { }
  gt() { }
  heal(className: string, id: number, value: number) { }
  health(className: string, id: number, change?: number) { }
  hidebar(time: any) { }
  hideindicator(id: number) { }
  hideindicators() { }
  hit_damage() { }
  hit_weapon() { }
  hour() { }
  image(id: number, image: any, x: number, y: number, masked?: boolean) { }
  imagewin(image: any) { }
  impact_amount() { }
  impact_class() { }
  impact_first() { }
  impact_ground() { }
  impact_id() { }
  impact_kill() { }
  impact_x() { }
  impact_y() { }
  impact_z() { }
  inarea(className: string, id: number) { }
  inarea_dig(className: string, id: number) { }
  inarea_fish(className: string, id: number) { }
  inarea_freshwater(className: string, id: number) { }
  incskill(skill: any, amount?: number, description?: any) { }
  info_loudspeaker(infoId: number, file: string, radius?: number) { }
  info_spawncontrol(infoId: number, radius: number, className: string, type: any, part: number, maximumParts: number, days: number) { }
  info_sprite(infoId: number, file?: any, x?: number, y?: number, r?: number, g?: number, b?: number, alpha?: number, blend?: any, fix?: any) { }
  inputwin(text: string, font?: any, cancel?: any, okay?: any, image?: any) { }
  inrange(className: string, id: number, radius?: number, secondClassName?: string, secondId?: number) { }
  int(number: number) { }
  intersect(firstClassName: string, firstId: number, secondClassName?: string, secondId?: number) { }
  inview(className: string, id: number) { }
  jade(amount: number) { }
  join(values: any[]) { }
  jumpfactor(factor: number) { }
  jumptime(time: number) { }
  kill(id: number) { }
  lastbuildingsite() { }
  length(string: string) { }
  lensflares(enabled: boolean) { }
  lives(className: string, id: number) { }
  loadani(unitType: any, startFrame: any, endFrame: any) { }
  loadfile(file: any, range?: any) { }
  loadmap(map: any, skills?: any, items?: any, variables?: any, diary?: any, states?: any, buildLocks?: any) { }
  loadmaptakeover() { }
  loadvars(file?: any) { }
  lockbuilding(buildingId: number) { }
  lockbuildings() { }
  lockcombi(combinationId: number) { }
  lockcombis() { }
  locked(buildingOrCombinationId: number) { }


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

  quit() {
    this.quitGame.emit();
  }
}
