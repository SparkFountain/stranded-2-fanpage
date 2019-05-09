import { AfterViewInit, Component, ElementRef, HostListener, ViewChild, Output, EventEmitter } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { Camera, CubeTexture, Engine, MeshBuilder, Scene, StandardMaterial, Texture, Vector3, AssetsManager, MeshAssetTask, Color3, Mesh, DirectionalLight, FlyCamera, HemisphericLight, ShadowGenerator, Color4 } from '@babylonjs/core';
import '@babylonjs/loaders/OBJ';
import { Climate, Weather } from './enums';
import { HttpClient } from '@angular/common/http';

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
  public terrainMesh: Mesh;
  public ocean: Mesh;
  public skyBox: Mesh;

  public shadowGenerator: ShadowGenerator;

  public hourFactor: number;
  public lightColors: Array<{ r: number, g: number, b: number }>;

  public activeMenu: string;

  public game: {
    units: any[],
    objects: any[],
    items: any[],
    sounds: any[],
    variables: Array<any>,
    map: {
      climate: Climate;
      weather: Weather;
    },
    time: number,
    day: number
  };

  public player: {
    enery: number,
    hunger: number,
    thirst: number,
    exhaustion: number,
    jumpTime: number,
    air: {
      available: number,
      maximum: number
    },
    showCompass: boolean,
    weapon: number,
    ammo: number,
    skills: any,
    items: any[],
    sleeping: boolean,
    speed: number,
    maxWeight: number,
    damage: number
  };

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.engine.resize();
  }

  @HostListener('document:keydown', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent): void {
    console.log(`[KEY DOWN] ${event}`);
  }

  constructor(
    private http: HttpClient
  ) {
    this.activeMenu = 'main';

    this.game = {
      units: [],
      objects: [],
      items: [],
      sounds: [],
      variables: [],
      map: {
        climate: Climate.SUN_AND_RAIN,
        weather: Weather.SUN
      },
      time: 8 * this.hourFactor,
      day: 1
    };

    this.player = {
      enery: 0,
      hunger: 0,
      thirst: 0,
      exhaustion: 0,
      jumpTime: 1.7,
      air: {
        available: 30,
        maximum: 30
      },
      showCompass: true,
      weapon: -1,
      ammo: -1,
      skills: {
        digging: { description: 'Graben', value: 0 },
        fishing: { description: 'Angeln', value: 0 },
        hunting: { description: 'Jagen', value: 0 },
        planting: { description: 'Anpflanzen', value: 0 },
        lumbering: { description: 'Holzfällen', value: 0 }
      },
      items: [],
      sleeping: false,
      speed: 1.7,
      maxWeight: 25000,
      damage: 3
    };

    this.hourFactor = 60;

    setInterval(() => {
      this.game.time++;
      if (this.game.time >= 24 * this.hourFactor) {
        this.game.time = 0;
        this.game.day++;
      }
      // this.dayNightCycle();
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

    this.engine = new Engine(this.canvas.nativeElement, true);
    this.createScene();
    this.createSkyBox();
    this.createTerrain();
    this.createOcean();

    this.loadObjects();
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

  loadObjects() {
    this.http.get('/assets/objects/objects.json').subscribe((objects: any[]) => {
      console.info('[OBJECTS]', objects);
    });
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
    this.terrainMesh = Mesh.CreateGroundFromHeightMap(
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
        this.terrainMesh.material = desertMaterial;

        this.terrainMesh.receiveShadows = true;
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
    const fullHour: number = Math.floor(this.game.time / this.hourFactor);
    const minuteFactor: number = (this.game.time % this.hourFactor) / this.hourFactor;

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

    if (this.game.time <= 4 * this.hourFactor) {
      this.skyBox.material.alpha = 0.1;
    } else if (this.game.time > 4 * this.hourFactor && this.game.time <= 5 * this.hourFactor) {
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
  air(time: number): void {
    this.player.air.available = time;
  }
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
  blur(value: number): void { }
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
  compass(show: boolean) {
    this.player.showCompass = show;
  }
  con(command: any) { }
  consume(energy?: number, hunger?: number, thirst?: number, exhaustion?: number): void {
    this.player.enery += energy;
    this.player.hunger += hunger;
    this.player.thirst += thirst;
    this.player.exhaustion += exhaustion;
  }
  copychildren(className: string, id: number, variables?: any, items?: any, states?: any, script?: any, add?: any) { }
  corona(x: number, z: number, radius?: number, red?: number, green?: number, blue?: number, speed?: number, unitId?: number) { }
  cos(value: number, useFactor100: boolean): number {
    return useFactor100 ? Math.cos(value) * 100 : Math.cos(value);
  }
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
  day(): number {
    return this.game.day;
  }
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
  drink(energy?: number, hunger?: number, thirst?: number, exhaustion?: number): void {
    // todo play drink sound
    this.consume(energy, hunger, thirst, exhaustion);
  }
  eat(energy?: number, hunger?: number, thirst?: number, exhaustion?: number): void {
    // todo play eat sound
    this.consume(energy, hunger, thirst, exhaustion);
  }
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
  extract(term: string, start: number, length?: number): string {
    return length ? term.substr(start, length) : term.substr(start);
  }
  fademusic(duration: number) { }
  fileexists(path: string) { }
  find(itemType: any, amount?: number) { }
  flash(red: number, green: number, blue: number, speed?: number, alpha?: number) { }
  free(className: string, id: number, amount?: number) { }
  freebutton(id: number) { }
  freeentry(title?: string) { }
  freescript(className: string, id: number) { }
  freescripts() { }
  freeskill(skill: any) {
    delete this.player.skills[skill];
  }
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
  getplayervalue(value: number) {
    switch (value) {
      case 1: return this.player.enery;
      case 2: return this.player.hunger;
      case 3: return this.player.thirst;
      case 4: return this.player.exhaustion;
    }
  }
  getplayerweapon() {
    return this.player.weapon;
  }
  getroll(className: string, id: number) { }
  getsetting(settingName: string) { }
  getstatevalue(className: string, id: number, state: any, value?: number) { }
  getstored(className: string, id: number, type?: any) { }
  getweather() {
    return this.game.map.weather;
  }
  getx(className: string, id: number) { }
  gety(className: string, id: number) { }
  getyaw(className: string, id: number) { }
  getz(className: string, id: number) { }
  gotskill(skill: any) {
    return this.player.skills.hasOwnProperty(skill);
  }
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
  hour(): number {
    return Math.floor(this.game.time / 60);
  }
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
  incskill(skill: any, value?: number, description?: any) {
    // tslint:disable-next-line: object-literal-shorthand
    if (this.player.skills.hasOwnProperty(skill)) {
      this.setskill(skill, this.player.skills[skill].value + value, description);
    } else {
      this.setskill(skill, value, description);
    }
  }
  info_loudspeaker(infoId: number, file: string, radius?: number) { }
  info_spawncontrol(infoId: number, radius: number, className: string, type: any, part: number, maximumParts: number, days: number) { }
  info_sprite(infoId: number, file?: any, x?: number, y?: number, r?: number, g?: number, b?: number, alpha?: number, blend?: any, fix?: any) { }
  inputwin(text: string, font?: any, cancel?: any, okay?: any, image?: any) { }
  inrange(className: string, id: number, radius?: number, secondClassName?: string, secondId?: number) { }
  int(value: string | number | boolean): number {
    return parseInt(value.toString(), 10);
  }
  intersect(firstClassName: string, firstId: number, secondClassName?: string, secondId?: number) { }
  inview(className: string, id: number) { }
  jade(amount: number) { }
  join(terms: (string | number)[]) {
    return terms.join();
  }
  jumpfactor(factor: number) { }
  jumptime(time: number) { }
  kill(id: number) { }
  lastbuildingsite() { }
  length(term: string): number {
    return term.length;
  }
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
  loop_id() { }
  map() { }
  mapsize() { }
  maxhealth(className: string, id: number, change?: number) { }
  menu() { }
  minute(): number {
    return this.game.time % 60;
  }
  mkdir(directoryName: string) { }
  model(model: any, className?: string, id?: number) { }
  modifyentry(title: string, source?: any) { }
  modifyentryline(title: string, line: number, text: string) { }
  movecam(time: any, targetTime: any, id: number) { }
  msg(message: string, font?: any, duration?: number) { }
  msgbox(title: string, source?: any) { }
  msgwin(text: string, font?: any, image?: any) { }
  msg_extend(source: any) { }
  msg_replace(originalTerm: string, replaceTerm: string) { }
  music(fileName: string, volume?: number, fadeDuration?: number) { }
  musicvolume(volume: number) { }
  name(className: string, id: number) { }
  parent_class(itemId: number) { }
  parent_id(itemId: number) { }
  particle(x: number, y: number, z: number, type: any, size?: any, alpha?: any) { }
  particlec(red: number, green: number, blue: number) { }
  pastechildren(className: string, id: number, variables?: any, items?: any, states?: any, script?: any) { }
  play(fileName: string, volume?: number, pan?: number, pitch?: number) { }
  playerdistance(className: string, id: number) { }
  playergotitem(type: any) { }
  playerspotted() { }
  player_ammo(ammo: any): void {
    this.player.ammo = ammo;
  }
  player_attackrange(value: number) { }
  player_damage(value: number): void {
    this.player.damage = value;
  }
  player_mat(material: any) { }
  player_maxweight(value: number): void {
    this.player.maxWeight = value;
  }
  player_speed(value: number): void {
    this.player.speed = value;
  }
  player_weapon(type: any) { }
  process(title: string, time?: any, event?: any) { }
  projectile(itemType: any, x: number, y: number, z: number, mode: any, unknownParam: any, offset?: any, weapon?: any, speed?: any, damage?: any, drag?: number) { }
  quickload() { }
  quicksave() { }
  quit(): void {
    this.quitGame.emit();
  }
  rainratio(percent: number) { }
  random(minOrMax: number, max: number) {
    const rnd: number = Math.random();
    return max ? Math.floor((rnd * (max - minOrMax))) + minOrMax : Math.floor((rnd * minOrMax));
  }
  randomcreate(className: string, type: any, minY?: number, maxY?: number, amount?: number) { }
  rename(currentVariableName: string, newVariableName: string) { }
  replace(term: string, currentTerm: string, newTerm: string): string {
    return term.replace(new RegExp(currentTerm, 'gi'), newTerm);
  }
  revive(unitId: number) { }
  ride(unitId: number) { }
  riding() { }
  rpos(className: string, id: number, x: number, y: number, z: number, pitch: number, yaw: number, roll: number) { }
  savemap(map: any, skills?: any, items?: any, variables?: any, diary?: any, states?: any, buildlocks?: any): void { }
  savemapimage(path: string, size?: number): void { }
  savevars(file?: string, variables?: any): void { }
  scale(x: number, y: number, z: number, className?: string, id?: number): void { }
  scantarget(distance?: number) { }
  selectplace(text: string, cameraHeight?: number) { }
  selectplace_x() { }
  selectplace_y() { }
  selectplace_z() { }
  seqbar(time: any, mode: any) { }
  seqcls(time: any, mode: any, red?: number, green?: number, blue?: number) { }
  seqend(time: any) { }
  seqevent(time: any, event: any, className: string, id: number) { }
  seqfade(startTime: any, endTime: any, red?: number, green?: number, blue?: number, mode?: any) { }
  seqflash(time: any, red?: number, green?: number, blue?: number, speed?: number, alpha?: number) { }
  seqhideplayer(time: any, hide?: any) { }
  seqimage(time: any, image: any, masked?: boolean) { }
  seqimagetext(time: any, text: string, x: number, y: number, color?: any, direction?: any) { }
  seqmsg(time: any, text: string, color?: any, ) { }
  seqmsgclear(time: any, position?: any) { }
  seqscript(time: any, source: any) { }
  seqsound(time: any, file: string, volume?: number, pan?: number, pitch?: number) { }
  seqstart(showBars?: boolean, canSkip?: boolean) { }
  seqtimemode(mode: any, absolute?: any) { }
  setamount(id: number, amount: number) { }
  setat(className: string, id: number, targetClassName: string, targetId: number) { }
  setcam(time: any, id: number) { }
  setday(day: number): void {
    this.game.day = day;
  }
  sethour(hour: number): void {
    const currentMinute: number = this.minute();
    this.game.time = (hour * 60) + currentMinute;
  }
  setindicatorinfo(id: number, text: string) { }
  setindicatorlook(id: number, look: number) { }
  setlocal(className: string, id: number, variable: any, value?: any) { }
  setminute(minute: number): void {
    const currentHour: number = this.hour();
    this.game.time = (currentHour * 60) + minute;
  }
  setpos(className: string, id: number, x: number, y: number, z: number) { }
  setrot(className: string, id: number, pitch: number, yaw: number, roll: number) { }
  setskill(skill: any, value?: number, description?: string): void {
    this.player.skills[skill] = { description, value };
  }
  shininess(value: number, className?: string, id?: number) { }
  showbar(time: any) { }
  showentry(title: string, sfx?: any) { }
  showindicator(id: number) { }
  showindicators() { }
  sin(value: number, useFactor100?: boolean) {
    return useFactor100 ? Math.sin(value) * 100 : Math.sin(value);
  }
  skillname(skill: string, description: string) {
    this.player.skills[skill].description = description;
  }
  skillvalue(skill: string) {
    return this.player.skills[skill].value || -1;
  }
  skip() { }
  skipevent() { }
  skycolor(mode: any, red?: number, green?: number, blue?: number, transparency?: number) { }
  skytexture(textureName: string) { }
  sleep(): void {
    this.player.sleeping = true;
  }
  sleeping(): boolean {
    return this.player.sleeping;
  }
  snowratio(percent: number) { }
  spawntimer(objectId: number, value?: number) { }
  speech(file: string, cancel?: any, number?: any) { }
  split(term: string, delimiter: string, part: number): string {
    return term.split(delimiter)[part];
  }
  starttrigger(id: number) { }
  starttriggers() { }
  state() { }
  statecolor(className: string, id: number, state: any, red: number, green: number, blue: number) { }
  statesize(className: string, id: number, state: any, size: number) { }
  statevalue(className: string, id: number, state: any, value: number) { }
  stopmusic() { }
  stopsounds() { }
  stoptrigger(id: number) { }
  stoptriggers() { }
  storage(className: string, id: number, mode?: any) { }
  store(itemId: number, className: string, id: number, outside: number) { }
  tan(value: number, useFactor100?: boolean) {
    return useFactor100 ? Math.tan(value) * 100 : Math.tan(value);
  }
  targetclass() { }
  targetdistance() { }
  targetid() { }
  targetx() { }
  targety() { }
  targetz() { }
  tempall() { }
  terrain(x: number, z: number, mode: any, height?: number) { }
  terraintexture(file: string, grass?: any) { }
  terrainy(x: number, z: number) { }
  text(id: number, text: string, font?: any, x?: number, y?: number, align?: any) { }
  text3d(className: string, id: number, text: string, font?: any, offset?: number, viewRange?: number) { }
  texture(texture: any, className?: string, id?: number) { }
  thunder() { }
  timedcampath(time: any, steps: { stepTime: any, id: any }[]) { }
  timer(className: string, id: number, duration: number, loops?: any, source?: any) { }
  timercount(className: string, id: number) { }
  trigger(id: number) { }
  trim(term: string) {
    return term.trim();
  }
  type(className: string, id: number) { }
  unitpath(unitId: number, pathIds: number[]) { }
  unlockbuilding(buildingId: number) { }
  unlockbuildings() { }
  unlockcombi(combinationId: number) { }
  unlockcombis() { }
  unstore(itemId: number, amount?: number) { }
  use_x() { }
  use_y() { }
  use_z() { }
  varexists(variableName: string) { }
  viewline(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) { }
  vomit(unitId: number) { }
  wateralpha(alpha: number) { }
  watertexture(textureName: string) { }
  weather(value: Weather) {
    this.game.map.weather = value;
  }



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

  saveOptions() {
    // todo
    this.activeMenu = 'main';
  }
}
