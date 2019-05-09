import { S2Behavior, S2Material } from './enums';

export interface S2Item {
  id: number;
  name: string;
  group: string;
  icon: string;
  model: string;
  scale: number;
  behaviour: S2Behavior;
  material: S2Material;
  weight: number;
  info: string;
  damage: number;
  healthChange: number;
}

export interface S2Object {
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
