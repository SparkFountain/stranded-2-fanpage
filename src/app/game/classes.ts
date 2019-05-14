import { S2Class, S2Behavior, S2Material, S2State } from './enums';
import { S2Instance } from './interfaces';
import { InstancedMesh } from '@babylonjs/core';

export class S2Mesh {
  id: number;
  s2Class: S2Class;

  constructor(id: number, s2Class: S2Class) {
    this.id = id;
    this.s2Class = s2Class;
  }
}

export class S2Item {
  id: number;
  name: string;
  group: string;
  icon: string;
  model: string;
  x?: number;
  y?: number;
  z?: number;
  r?: number;
  g?: number;
  b?: number;
  fx?: number;
  autofade?: number;
  alpha?: number;
  shine?: number;
  blend?: number;
  scale: number;
  behaviour: S2Behavior;
  material: S2Material;
  weight: number;
  info: string;
  damage: number;
  health: number;
  healthChange: number;
  state?: any;  // TODO
  radius?: number;
  speed?: number;
  range?: number;
  drag?: number;
  rate?: number;
  weaponState?: any; // TODO
  editor?: boolean;
  // TODO param and var definitions
}

export class S2Object {
  id: number;
  icon: string;
  model: string;
  health: number;
  behaviour?: S2Behavior;
  col?: number;
  mat?: string;
  maxWeight?: number;
  swaySpeed?: number;
  swayPower?: number;
  scale?: {
    x?: number;
    y?: number;
    z?: number;
  };
  r?: number;
  g?: number;
  b?: number;
  backFaceCulling?: boolean;
  autofade?: number;
  alpha?: number;
  shine?: number;
}

export class S2Unit {
  id: number;
  name: string;
  group: any; // TODO
  icon: string;
  model: string;
  x?: number;
  y?: number;
  z?: number;
  r?: number;
  g?: number;
  b?: number;
  fx?: number;
  autofade?: number;
  alpha?: number;
  shine?: number;
  col?: any;  // TODO
  colxr?: number;
  colyr?: number;
  mat?: S2Material;
  health: number;
  healthChange: number;
  store?: number;
  maxWeight?: number;
  state?: any;  // TODO
  ani_idle1?: any; // TODO
}
