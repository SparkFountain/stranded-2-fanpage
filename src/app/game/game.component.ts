import { Component, ViewChild, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { Engine, Scene, Camera, ArcRotateCamera, Vector3, HemisphericLight, PointLight, MeshBuilder } from '@babylonjs/core';

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

    // Register a render loop to repeatedly render the scene
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  createScene(): void {
    this.scene = new Scene(this.engine);

    this.camera = new ArcRotateCamera('Camera', Math.PI / 2, Math.PI / 2, 2, new Vector3(0, 0, 5), this.scene);
    this.camera.attachControl(this.canvas.nativeElement, true);

    // Add lights to the scene
    let light1 = new HemisphericLight('light1', new Vector3(1, 1, 0), this.scene);
    let light2 = new PointLight('light2', new Vector3(0, 1, -1), this.scene);

    // Add and manipulate meshes in the scene
    let sphere = MeshBuilder.CreateSphere('sphere', { diameter: 2 }, this.scene);
  }

}
