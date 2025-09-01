export interface Filament {
  id: string;
  marca: string;
  material: string;
  cor: string;
  corRgb: string;
  quantidade: number;
  pesoCarretel?: number; // Peso do carretel por marca (em gramas)
  pesoFilamento?: number; // Peso do filamento (em gramas)
  pesoRolo?: number; // Peso total do rolo completo (em gramas)
}

export interface FilamentFormData {
  marca: string;
  material: string;
  cor: string;
  corRgb: string;
  quantidade: number;
  pesoCarretel?: number; // Peso do carretel por marca (em gramas)
  pesoFilamento?: number; // Peso do filamento (em gramas)
  pesoRolo?: number; // Peso total do rolo completo (em gramas)
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
  'ColorFabb',
  'Volt'
] as const;

// Dicionário de pesos de carretel por marca (em gramas)
export const CARRETEL_WEIGHTS: Record<string, number> = {
  'eSUN': 200,
  'Prusa Research': 250,
  'Creality': 180,
  'Overture': 220,
  'Hatchbox': 210,
  'Anycubic': 230,
  'Polymaker': 190,
  'Sunlu': 200,
  'Geeetech': 185,
  'Bambu Lab': 240,
  'Prusament': 245,
  'FormFutura': 215,
  'ColorFabb': 205,
  'Volt': 180
};