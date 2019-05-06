import { AfterViewInit, Component, ElementRef, HostListener, ViewChild, Output, EventEmitter } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { Camera, CubeTexture, Engine, MeshBuilder, Scene, StandardMaterial, Texture, Vector3, AssetsManager, MeshAssetTask, Color3, Mesh, DirectionalLight, FlyCamera, HemisphericLight, ShadowGenerator, Color4 } from '@babylonjs/core';
import '@babylonjs/loaders/OBJ';
import { Climate, Weather } from './enums';

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

  constructor() {
    this.activeMenu = 'main';

    this.game = {
      units: [
        {
          id: 1,
          name: 'Player',
          group: 'human',
          icon: 'gfx\strandedguy.bmp',
          model: 'gfx\strandedguy.b3d',
          colxr: 8,
          colyr: 17,
          speed: 1.6,
          eyes: 16,
          store: 100,
          health: 100,
          damage: 3,
          attackrange: 45,
          maxweight: 25000,
          healthchange: 0
        },
        {
          id: 2,
          name: 'Raptor',
          group: 'animal',
          icon: 'gfx\raptor.bmp',
          model: 'gfx\raptor.b3d',
          scale: 0.5,
          colxr: 15,
          colyr: 30,
          behaviour: 'raptor',
          health: 110,
          speed: 2.5,
          eyes: 10,
          turnspeed: 3.0,
          attackrange: 65,
          damage: 24,
          ani_idle1: [4, 8, 0.02],
          ani_move: [2, 3, 0.06],
          ani_die: [8, 11, 0.05],
          ani_attack: [12, 16, 0.07],
          sfx: 'raptor',
          rideoffset: 5,
          acceleration: 0.08,
          maxdepth: 35,
          loot: [9, 3],
          /* loot :  [94, 8],
          loot :  [95, 4],
          loot :  [96, 1] */
        },
        {
          name: 'Krebs',
          group: 'animal',
          icon: 'gfx\crab.bmp',
          model: 'gfx\crab.b3d',
          health: 40,
          scale: 0.6,
          colxr: 4,
          colyr: 2,
          behaviour: 'crab',
          speed: 0.1,
          turnspeed: 0.5,
          ani_idle1: [3, 5, 0.02],
          ani_move: [1, 2, 0.06],
          ani_die: [5, 7, 0.1],
          loot: [11, 1],
          sfx: 'crab'
        },
        {
          id: 4,
          name: 'Fisch',
          group: 'animal',
          icon: 'gfx\fish01.bmp',
          model: 'gfx\fish01.b3d',
          scale: 1.2,
          fx: 16,
          colxr: 5,
          colyr: 5,
          behaviour: 'fish',
          speed: 1,
          turnspeed: 0.6,
          ani_move: [2, 4, 0.15],
          ani_die: [5, 6, 0.01,],
          loot: [11, 1]
        },
        {
          id: 5,
          name: 'Piranha',
          group: 'animal',
          icon: 'gfx\piranha.bmp',
          model: 'gfx\piranha.b3d',
          scale: 0.5,
          fx: 16,
          colxr: 5,
          colyr: 5,
          behaviour: 'predatorfish',
          speed: 1.2,
          turnspeed: 0.8,
          damage: 4,
          ani_move: [2, 3, 0.03],
          ani_attack: [6, 8, 0.25],
          ani_die: [4, 5, 0.01],
          sfx: 'piranha',
          loot: [11, 2],
          /* loot :  94, 2 */
        },
        {
          id: 6,
          name: 'Schmetterling',
          group: 'animal',
          icon: 'gfx\butterfly01.bmp',
          model: 'gfx\butterfly01.b3d',
          health: 1,
          scale: 0.5,
          colxr: 5,
          colyr: 5,
          fx: 16,
          behaviour: 'flyinginsect',
          mat: 'leaf',
          speed: 1.2,
          turnspeed: 0.8,
          ani_move: [1, 2, 0.1],
          loot: [98, 1]
        },
        {
          id: 7,
          name: 'Schmetterling',
          group: 'animal',
          icon: 'gfx\butterfly02.bmp',
          model: 'gfx\butterfly02.b3d',
          health: 1,
          scale: 0.5,
          colxr: 5,
          colyr: 5,
          fx: 16,
          behaviour: 'flyinginsect',
          mat: 'leaf',
          speed: 1.2,
          turnspeed: 0.8,
          ani_move: [1, 2, 0.1],
          loot: [98, 1]
        },
        {
          id: 8,
          name: 'Fleischfressende Pflanze',
          group: 'animal',
          icon: 'gfx\floracarnivora.bmp',
          model: 'gfx\floracarnivora.b3d',
          colxr: 16,
          colyr: 26,
          fx: 16,
          scale: 0.8,
          health: 18,
          mat: 'leaf',
          behaviour: 'standandsnap',
          ani_idle1: [1, 3, 0.01],
          ani_idle2: [3, 6, 0.01],
          ani_idle3: [9, 11, 0.006],
          ani_attack: [6, 9, 0.12],
          ani_die: [11, 12, 0.02],
          sfx: 'floracarnivora',
          attackrange: 65,
          damage: 23,
          loot: [94, 4]
        },
        {
          id: 9,
          name: 'Löwe',
          group: 'animal',
          icon: 'gfx\lion.bmp',
          model: 'gfx\lion.b3d',
          scale: 0.3,
          colxr: 15,
          colyr: 30,
          behaviour: 'raptor',
          health: 75,
          speed: 1.6,
          eyes: 10,
          turnspeed: 1.7,
          attackrange: 65,
          ani_move: [2, 3, 0.05],
          ani_attack: [7, 8, 0.03],
          ani_die: [4, 5, 0.05],
          ani_idle1: [8, 10, 0.04],
          ani_idle2: [10, 13, 0.04],
          ani_idle3: [13, 15, 0.05],
          sfx: 'lion',
          damage: 9,
          loot: [9, 2],
          /* loot :  94, 4,
          loot :  95, 4,
          loot :  96, 2, */
        },
        {
          id: 10,
          name: 'Schildkröte',
          group: 'animal',
          icon: 'gfx\turtle.bmp',
          model: 'gfx\turtle.b3d',
          scale: 1.1,
          colxr: 8,
          colyr: 20,
          behaviour: 'amphibian',
          health: 80,
          speed: 0.2,
          turnspeed: 0.5,
          ani_idle1: [4, 6, 0.02],
          ani_idle2: [6, 10, 0.01],
          ani_idle3: [10, 12, 0.03],
          ani_move: [2, 3, 0.06],
          ani_die: [12, 14, 0.3],
          loot: [9, 1],
          /* loot :  96, 1, */
        },
        {
          id: 11,
          name: 'Fisch',
          group: 'animal',
          icon: 'gfx\fish02.bmp',
          model: 'gfx\fish02.b3d',
          scale: 1.2,
          colxr: 5,
          colyr: 5,
          behaviour: 'fish',
          speed: 0.8,
          turnspeed: 0.6,
          ani_move: [2, 4, 0.12],
          ani_die: [5, 6, 0.005],
          loot: [11, 1]
        },
        {
          id: 12,
          name: 'Fisch',
          group: 'animal',
          icon: 'gfx\fish03.bmp',
          model: 'gfx\fish03.b3d',
          scale: 0.9,
          colxr: 5,
          colyr: 5,
          behaviour: 'fish',
          speed: 0.9,
          turnspeed: 1.5,
          ani_move: [2, 4, 0.14],
          ani_die: [5, 6, 0.01],
          loot: [11, 1]
        },
        {
          id: 13,
          name: 'Hai',
          group: 'animal',
          icon: 'gfx\shark.bmp',
          model: 'gfx\shark.b3d',
          scale: 7,
          colxr: 50,
          colyr: 20,
          behaviour: 'predatorfish',
          health: 80,
          speed: 2.5,
          turnspeed: 1.7,
          damage: 15,
          ani_move: [2, 3, 0.03],
          ani_die: [4, 5, 0.01],
          ani_attack: [2, 3, 0.05],
          attackrange: 80,
          loot: [9, 3],
          /* loot :  94, 10, */
        },
        {
          id: 14,
          name: 'Skorpion',
          group: 'animal',
          icon: 'gfx\scorpion.bmp',
          model: 'gfx\scorpion.b3d',
          scale: 1.85,
          colxr: 9,
          colyr: 4,
          behaviour: 'raptor',
          health: 30,
          speed: 0.6,
          eyes: 5,
          turnspeed: 0.5,
          ani_idle1: [1, 3, 0.02],
          ani_idle2: [3, 8, 0.04],
          ani_idle3: [8, 11, 0.03],
          ani_move: [11, 15, 0.05],
          ani_attack: [15, 17, 0.12],
          ani_die: [17, 19, 0.11],
          range: 100,
          attackrange: 23,
          damage: 1,
          loot: [11, 1],
          /* loot :  37, 3, */
          sfx: 'crab',
        },
        {
          id: 15,
          name: 'Schaf',
          group: 'animal',
          icon: 'gfx\sheep.bmp',
          model: 'gfx\sheep.b3d',
          colxr: 25,
          colyr: 16,
          scale: 11,
          behaviour: 'animal',
          health: 100,
          speed: 0.2,
          turnspeed: 0.5,
          ani_idle1: [4, 9, 0.01],
          ani_idle2: [9, 11, 0.01],
          ani_idle3: [12, 15, 0.01],
          ani_move: [2, 3, 0.02],
          ani_die: [15, 16, 0.1]
        },
        {
          id: 16,
          name: 'Libelle',
          group: 'animal',
          icon: 'gfx\dragonfly.bmp',
          model: 'gfx\dragonfly.b3d',
          scale: 0.7,
          fx: 16,
          shine: 1,
          behaviour: 'flyinginsect',
          mat: 'leaf',
          health: 3,
          speed: 1.6,
          turnspeed: 1.2,
          ani_move: [2, 3, 0.3],
          ani_die: [4, 5, 0.03],
          loot: [98, 3],
          sfx: 'fly'
        },
        {
          id: 17,
          name: 'Fliege',
          group: 'animal',
          icon: 'gfx\fly.bmp',
          model: 'gfx\fly.b3d',
          scale: 0.35,
          fx: 16,
          shine: 1,
          behaviour: 'flyinginsect',
          mat: 'leaf',
          health: 3,
          speed: 1.0,
          turnspeed: 3.2,
          ani_move: [2, 3, 0.5],
          ani_die: [4, 5, 0.03],
          loot: [98, 1],
          sfx: 'fly'
        },
        {
          id: 18,
          name: 'Schnecke',
          group: 'animal',
          icon: 'gfx\snail.bmp',
          model: 'gfx\snail.b3d',
          scale: 0.55,
          colxr: 8,
          colyr: 5,
          shine: 0.4,
          behaviour: 'animal',
          mat: 'leaf',
          health: 3,
          speed: 0.01,
          turnspeed: 0.05,
          ani_move: [7, 8, 0.01],
          ani_idle1: [1, 3, 0.01],
          ani_idle2: [3, 5, 0.01],
          ani_die: [5, 6, 0.05],
          loot: [99, 1]
        },
        {
          id: 19,
          name: 'Affe',
          group: 'animal',
          icon: 'gfx\monkey.bmp',
          model: 'gfx\monkey.b3d',
          colxr: 18,
          colyr: 14,
          scale: 0.51,
          behaviour: 'monkey',
          health: 50,
          speed: 2.8,
          turnspeed: 1,
          sfx: 'monkey',
          ani_move: [3, 4, 0.16],
          ani_idle1: [5, 7, 0.13],
          ani_idle2: [7, 14, 0.17],
          ani_idle3: [14, 16, 0.12],
          ani_die: [16, 17, 0.15],
          loot: [11, 4],
          /* loot :  94, 2,
          loot :  96, 1, */
        },
        {
          id: 20,
          name: 'Spinne',
          group: 'animal',
          icon: 'gfx\spider.bmp',
          model: 'gfx\spider.b3d',
          scale: 0.35,
          colxr: 6,
          colyr: 3,
          behaviour: 'animal',
          mat: 'leaf',
          health: 3,
          speed: 1.0,
          turnspeed: 3.6,
          ani_move: [2, 3, 0.2],
          ani_die: [5, 6, 0.1],
          loot: [98, 1]
        },
        {
          id: 21,
          name: 'Glühwürmchen',
          group: 'animal',
          icon: 'gfx\firefly.bmp',
          model: 'gfx\firefly.b3d',
          scale: 0.35,
          fx: 17,
          shine: 1,
          behaviour: 'flyinginsect',
          mat: 'leaf',
          health: 3,
          speed: 2.0,
          turnspeed: 10.0,
          ani_move: [2, 3, 0.5],
          ani_die: [4, 5, 0.03],
          loot: [98, 1],
          sfx: 'fly'
        },
        {
          id: 25,
          name: 'Vogel',
          group: 'animal',
          icon: 'gfx\bird01.bmp',
          model: 'gfx\bird01.b3d',
          autofade: 1000,
          colxr: 40,
          colyr: 7,
          fx: 24,
          speed: 2.4,
          turnspeed: 0.4,
          behaviour: 'bird',
          sfx: 'bird',
          health: 5,
          ani_move: [2, 20, 0.2],
          loot: [11, 2],
          /* loot :  57, 15, */
        },
        {
          id: 26,
          name: 'Kiwi',
          group: 'animal',
          icon: 'gfx\kiwi.bmp',
          model: 'gfx\kiwi.b3d',
          colxr: 10,
          colyr: 6,
          scale: 0.26,
          behaviour: 'shy',
          health: 5,
          speed: 0.8,
          turnspeed: 1,
          sfx: 'kiwi',
          ani_move: [2, 3, 0.18],
          ani_idle1: [4, 6, 0.2],
          ani_idle2: [6, 8, 0.2],
          ani_idle3: [8, 10, 0.2],
          ani_die: [10, 11, 0.25],
          loot: [11, 1],
          /* loot :  [57, 5] */
        },
        {
          id: 30,
          name: 'Segelfloß',
          group: 'vehicle',
          icon: 'gfx\sailraft.bmp',
          model: 'gfx\sailraft.b3d',
          fx: 16,
          colxr: 30,
          colyr: 20,
          mat: 'wood',
          speed: 2.2,
          turnspeed: 1.0,
          health: 265,
          behaviour: 'watercraft',
          rideoffset: 60,
          maxweight: 30000,
          sfx: 'watercraft'
        },
        {
          id: 31,
          name: 'Einbaum',
          group: 'vehicle',
          icon: 'gfx\dugout.bmp',
          model: 'gfx\dugout.b3d',
          scale: 1.6,
          colxr: 12,
          colyr: 10,
          mat: 'wood',
          speed: 1.5,
          turnspeed: 0.8,
          health: 150,
          behaviour: 'watercraft',
          rideoffset: 10,
          sfx: 'watercraft'
        },
        {
          id: 33,
          name: 'Soldat',
          group: 'human',
          model: 'gfx\soldier.b3d',
          colxr: 8,
          colyr: 17,
          behaviour: 'standandshoot',
          speed: 2.0,
          eyes: 10,
          health: 100,
          damage: 3,
          range: 300,
          attackrange: 300,
          maxweight: 25000,
          ani_attack: [1, 4, 0.1]
        },
        {
          id: 34,
          name: 'Eingeborener',
          group: 'human',
          model: 'gfx\native.b3d',
          icon: 'gfx\native.bmp',
          scale: 0.9,
          colxr: 9,
          colyr: 20,
          behaviour: 'normal',
          speed: 1.0,
          eyes: 10,
          health: 100,
          damage: 10,
          range: 150,
          attackrange: 40,
          maxweight: 25000,
          ani_move: [2, 3, 0.10],
          ani_attack: [23, 25, 0.10],
          ani_die: [4, 7, 0.15],
          ani_idle1: [9, 13, 0.09],
          ani_idle2: [14, 21, 0.08],
          ani_idle3: [21, 23, 0.12],
          sfx: 'native'
        },
        {
          id: 35,
          name: 'Yacht',
          group: 'vehicle',
          model: 'gfx\yacht.b3d',
          icon: 'gfx\yacht.bmp',
          scale: 3,
          fx: 16,
          colxr: 65,
          colyr: 20,
          health: 450,
          mat: 'metal',
          speed: 9.8,
          turnspeed: 1.1,
          behaviour: 'watercraft',
          rideoffset: 140
        },
        {
          id: 36,
          fx: 16,
          name: 'Papagei',
          group: 'animal',
          icon: 'gfx\parrot.bmp',
          model: 'gfx\parrot.b3d',
          colxr: 30,
          colyr: 10,
          scale: 0.2,
          behaviour: 'landskybird',
          health: 5,
          speed: 3.8,
          turnspeed: 1,
          sfx: 'parrot',
          loot: [11, 3],
          /* loot :  57, 30, */
          ani_move: [13, 14, 0.2],
          ani_idle1: [1, 4, 0.06],
          ani_idle2: [4, 6, 0.3],
          ani_idle3: [6, 12, 0.3],
          ani_die: [15, 16, 0.2]
        },
        {
          id: 37,
          name: 'Pirat',
          group: 'human',
          model: 'gfx\pirate.b3d',
          icon: 'gfx\pirate.bmp',
          colxr: 15,
          colyr: 30,
          scale: 0.48,
          behaviour: 'normal',
          health: 100,
          speed: 1.0,
          turnspeed: 1.,
          ani_move: [2, 3, 0.07],
          ani_attack: [4, 7, 0.1],
          ani_idle1: [7, 9, 0.04],
          ani_idle2: [9, 11, 0.04],
          ani_idle3: [11, 21, 0.05],
          ani_die: [21, 23, 0.08]
        },
        {
          id: 38,
          name: 'Kiffer - Opa',
          group: 'human',
          model: 'gfx\weedgrandpa.b3d',
          icon: 'gfx\weedgrandpa.bmp',
          colxr: 15,
          colyr: 30,
          scale: 1.2,
          behaviour: 'normal',
          health: 100,
          speed: 1.0,
          turnspeed: 1.0,
          ani_move: [2, 3, 0.03],
          ani_idle1: [4, 6, 0.04],
          ani_idle2: [6, 9, 0.04],
          ani_idle3: [9, 13, 0.05],
          ani_die: [13, 14, 0.08]
        },
        {
          id: 39,
          name: 'Flugzeug',
          group: 'vehicle',
          model: 'gfx\plane.b3d',
          icon: 'gfx\plane.bmp',
          colxr: 40,
          colyr: 20,
          fx: 24,
          speed: 13,
          turnspeed: 0.4,
          health: 200,
          ani_move: [2, 13, 2],
          ani_idle1: [1, 1, 1],
          sfx: 'plane',
          rideoffset: 5,
          mat: 'metal',
          col: 1,
          steering: 1,
          behaviour: 'aircraft'
        },
        {
          id: 40,
          name: 'Häuptling',
          group: 'human',
          model: 'gfx\chieftain.b3d',
          icon: 'gfx\chieftain.bmp',
          scale: 0.8,
          colxr: 9,
          colyr: 20,
          behaviour: 'idleturn',
          speed: 1.0,
          eyes: 10,
          health: 100,
          damage: 3,
          range: 150,
          attackrange: 300,
          maxweight: 25000,
          ani_move: [2, 3, 0.10],
          ani_die: [4, 7, 0.15],
          ani_idle1: [9, 13, 0.09],
          ani_idle2: [14, 21, 0.08],
          ani_idle3: [21, 23, 0.12],
          sfx: 'native'
        },
        {
          id: 41,
          name: 'Professor',
          group: 'human',
          model: 'gfx\prof.b3d',
          icon: 'gfx\prof.bmp',
          colxr: 15,
          colyr: 30,
          scale: 1.2,
          behaviour: 'normal',
          health: 100,
          speed: 0.8,
          turnspeed: 1.0,
          ani_move: [2, 3, 0.03],
          ani_idle1: [4, 6, 0.04],
          ani_idle2: [6, 9, 0.04],
          ani_idle3: [9, 13, 0.05],
          ani_die: [13, 14, 0.08]
        },
        {
          id: 42,
          name: 'Krallenäffchen',
          group: 'animal',
          icon: 'gfx\clawmonkey.bmp',
          model: 'gfx\clawmonkey.b3d',
          colxr: 18,
          colyr: 14,
          scale: 0.51,
          behaviour: 'raptor',
          health: 50,
          speed: 2.7,
          turnspeed: 1.5,
          attackrange: 40,
          sfx: 'monkey',
          ani_move: [3, 4, 0.16],
          ani_idle1: [5, 7, 0.13],
          ani_idle2: [7, 14, 0.17],
          ani_idle3: [14, 16, 0.12],
          ani_die: [16, 17, 0.15],
          ani_attack: [18, 20, 0.1],
          loot: [11, 4],
          /* loot :  94, 2,
          loot :  95, 4,
          loot :  96, 1, */
          damage: 2
        },
        {
          id: 43,
          name: 'Heuschrecke',
          group: 'animal',
          icon: 'gfx\grasshopper.bmp',
          model: 'gfx\grasshopper.b3d',
          health: 1,
          scale: 1.5,
          colxr: 15,
          colyr: 15,
          fx: 16,
          behaviour: 'plague',
          range: 1000,
          mat: 'leaf',
          speed: 1.5,
          turnspeed: 4,
          ani_move: [1, 2, 0.13],
          ani_attack: [1, 2, 0.07],
          ani_die: [3, 4, 0.1],
          damage: 5,
          loot: [98, 3]
        },
        {
          id: 44,
          name: 'Trage - Affe',
          group: 'animal',
          icon: 'gfx\monkey_carrier.bmp',
          model: 'gfx\monkey_carrier.b3d',
          colxr: 18,
          colyr: 14,
          scale: 0.51,
          behaviour: 'monkey',
          health: 50,
          speed: 1.4,
          turnspeed: 1.,
          sfx: 'monkey',
          ani_move: [3, 4, 0.09],
          ani_idle1: [5, 7, 0.13],
          ani_idle2: [7, 14, 0.17],
          ani_idle3: [14, 16, 0.12],
          ani_die: [16, 17, 0.15],
          loot: [11, 4],
          /* loot :  94, 2,
          loot :  96, 1, */
          maxweight: 10000
        },
        {
          id: 45,
          fx: 16,
          name: 'Adler',
          group: 'animal',
          icon: 'gfx\eagle.bmp',
          model: 'gfx\eagle.b3d',
          colxr: 30,
          colyr: 10,
          scale: 0.2,
          behaviour: 'killerbird',
          health: 50,
          speed: 3.4,
          turnspeed: 1,
          range: 400,
          damage: 15,
          attackrange: 30,
          sfx: 'eagle',
          loot: [11, 3],
          /* loot :  57, 35,
          loot :  95, 2, */
          ani_move: [13, 14, 0.1],
          ani_idle1: [1, 4, 0.06],
          ani_idle2: [4, 6, 0.3],
          ani_idle3: [6, 12, 0.3],
          ani_die: [15, 16, 0.2]
        }
      ],
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
