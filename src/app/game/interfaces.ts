import { S2Behavior, S2Material, S2State } from './enums';

export interface S2Instance {
  uid: number;
  states: S2State[];
}

export interface S2PlayerItem {
  id: number;
  amount: number;
}

export interface S2Item extends S2Instance {
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

export interface S2Object extends S2Instance {
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
  x?: number;
  y?: number;
  z?: number;
  r?: number;
  g?: number;
  b?: number;
  backfaceCulling?: boolean;
  autofade?: number;
  alpha?: number;
  shine?: number;
}

export interface S2Unit extends S2Instance {
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
