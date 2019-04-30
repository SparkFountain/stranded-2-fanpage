import { Component, ViewChild, AfterViewInit, ElementRef, HostListener } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { Engine, Scene, Camera, ArcRotateCamera, Vector3, HemisphericLight, PointLight, MeshBuilder, StandardMaterial, CubeTexture, Texture } from '@babylonjs/core';

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

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.engine.resize();
  }

  constructor() { }

  ngAfterViewInit() {
    this.engine = new Engine(this.canvas.nativeElement, true); // Generate the BABYLON 3D engine
    this.createScene(); // Call the createScene function
    this.createSkyBox();

    // Register a render loop to repeatedly render the scene
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  createScene(): void {
    this.scene = new Scene(this.engine);

    this.camera = new ArcRotateCamera('Camera', (Math.PI / 4), (Math.PI / 4), 5, Vector3.Zero(), this.scene);
    this.camera.attachControl(this.canvas.nativeElement, true);


  }

  createSkyBox() {
    const skybox = MeshBuilder.CreateBox('skyBox', { size: 1.0 }, this.scene);
    const skyboxMaterial = new StandardMaterial('skyBox', this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new CubeTexture('/assets/textures/TropicalSunnyDay', this.scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
  }

}
