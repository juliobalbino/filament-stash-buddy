export interface Filament {
  id: string;
  marca: string;
  material: string;
  cor: string;
  quantidade: number;
}

export interface FilamentFormData {
  marca: string;
  material: string;
  cor: string;
  quantidade: number;
}

export const MATERIAL_TYPES = [
  'PLA',
  'PETG', 
  'ABS',
  'TPU',
  'Nylon',
  'ASA',
  'HIPS',
  'Wood',
  'Carbon Fiber'
] as const;

export const COMMON_BRANDS = [
  'eSUN',
  'Prusa Research', 
  'Creality',
  'Overture',
  'Hatchbox',
  'Anycubic',
  'Polymaker',
  'Sunlu',
  'Geeetech',
  'Bambu Lab',
  'Prusament',
  'FormFutura',
  'ColorFabb'
] as const;