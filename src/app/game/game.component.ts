import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { ArcRotateCamera, Camera, CubeTexture, Engine, MeshBuilder, Scene, StandardMaterial, Texture, Vector3, SceneLoader, AssetsManager, MeshAssetTask, AbstractMesh, Color3, Mesh, Light, DirectionalLight, FlyCamera, HemisphericLight, ShadowGenerator, AbstractAssetTask, Plane } from '@babylonjs/core';
import '@babylonjs/loaders/OBJ';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements AfterViewInit {
  @ViewChild('gameCanvas') canvas: ElementRef;

  public engine: Engine;
  public scene: Scene;
  public camera: Camera;

  public assetsManager: AssetsManager;

  public ambientLight: HemisphericLight;
  public sun: DirectionalLight;
  public terrain: Mesh;
  public ocean: Mesh;

  public shadowGenerator: ShadowGenerator;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.engine.resize();
  }

  constructor() { }

  ngAfterViewInit() {
    this.engine = new Engine(this.canvas.nativeElement, true); // Generate the BABYLON 3D engine
    this.createScene(); // Call the createScene function
    this.createSkyBox();
    this.createTerrain();
    this.createOcean();
  }

  createScene(): void {
    // Create Empty Scene
    this.scene = new Scene(this.engine);

    // Create Camera
    this.camera = new FlyCamera('Camera', new Vector3(0, 20, 0), this.scene);
    this.camera.attachControl(this.canvas.nativeElement, true);

    // Create Ambient Light
    this.ambientLight = new HemisphericLight('AmbientLight', new Vector3(0, -1, 0), this.scene);
    this.ambientLight.groundColor = new Color3(1, 1, 1);

    // Create Sun Light and Shadow Generator
    const sunLightDirection: Vector3 = new Vector3(-1, -1, -1);
    const sunPosition: Vector3 = new Vector3(0, 30, 50);
    this.sun = new DirectionalLight('Sun', sunLightDirection, this.scene);
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

    this.assetsManager.onFinish = (tasks: AbstractAssetTask[]) => {
      // Register a render loop to repeatedly render the scene
      this.engine.runRenderLoop(() => {
        this.scene.render();
      });
    };

    this.assetsManager.load();
  }

  createSkyBox() {
    const skybox = MeshBuilder.CreateBox('skyBox', { size: 1000.0 }, this.scene);
    const skyboxMaterial = new StandardMaterial('skyBox', this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new CubeTexture('/assets/textures/TropicalSunnyDay', this.scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    /* skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0); */
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
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

}
