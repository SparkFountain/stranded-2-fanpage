import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { ArcRotateCamera, Camera, CubeTexture, Engine, MeshBuilder, Scene, StandardMaterial, Texture, Vector3, SceneLoader, AssetsManager, MeshAssetTask, AbstractMesh, Color3, Mesh, Light, DirectionalLight, FlyCamera, HemisphericLight } from '@babylonjs/core';
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

  public sun: HemisphericLight;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.engine.resize();
  }

  constructor() { }

  ngAfterViewInit() {
    this.engine = new Engine(this.canvas.nativeElement, true); // Generate the BABYLON 3D engine
    this.createScene(); // Call the createScene function
    this.createSkyBox();
  }

  createScene(): void {
    this.scene = new Scene(this.engine);

    this.camera = new FlyCamera('Camera', Vector3.Zero(), this.scene);
    this.camera.attachControl(this.canvas.nativeElement, true);

    this.sun = new HemisphericLight('Sun', new Vector3(0, -1, 0), this.scene);
    this.sun.groundColor = new Color3(1, 1, 1);

    this.assetsManager = new AssetsManager(this.scene);
    const meshTask = this.assetsManager.addMeshTask('skull task', '', '/assets/objects/', 'palmtree01.obj');

    meshTask.onSuccess = (task: MeshAssetTask) => {
      task.loadedMeshes.forEach((mesh: Mesh) => {
        mesh.position = new Vector3(0, -10, 10);
        mesh.scaling = new Vector3(0.25, 0.25, 0.25);
        const material: StandardMaterial = mesh.material as StandardMaterial;
        // material.ambientColor = new Color3(1, 1, 1);
        // material.specularColor = new Color3(1, 1, 1);
        material.backFaceCulling = false;
        material.diffuseTexture.hasAlpha = true;
      });
    };

    this.assetsManager.onFinish = (tasks) => {
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

}
