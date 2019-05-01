import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { ArcRotateCamera, Camera, CubeTexture, Engine, MeshBuilder, Scene, StandardMaterial, Texture, Vector3, SceneLoader, AssetsManager, MeshAssetTask, AbstractMesh, Color3, Mesh } from '@babylonjs/core';
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

    this.camera = new ArcRotateCamera('Camera', (Math.PI / 4), (Math.PI / 4), 5, Vector3.Zero(), this.scene);
    this.camera.attachControl(this.canvas.nativeElement, true);

    this.assetsManager = new AssetsManager(this.scene);
    let meshTask = this.assetsManager.addMeshTask("skull task", "", "/assets/objects/", "palmtree01.obj");

    meshTask.onSuccess = (task: MeshAssetTask) => {
      task.loadedMeshes.forEach((mesh: Mesh) => {
        mesh.position = new Vector3(0, -10, 10);
        mesh.scaling = new Vector3(0.1, 0.1, 0.1);
        console.info(mesh.material);
        mesh.material.ambientColor = new Color3(1, 1, 1);
      });
    }

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
