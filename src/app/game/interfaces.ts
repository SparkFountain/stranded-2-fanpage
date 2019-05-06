import { Behavior, Material } from './enums';

export interface Item {
  id: number;
  name: string;
  group: string;
  icon: string;
  model: string;
  scale: number;
  behaviour: Behavior;
  material: Material;
  weight: number;
  info: string;
  damage: number;
  healthChange: number;
}
