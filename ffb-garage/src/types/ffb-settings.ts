export interface FFBSetting {
  id: number;
  car: string;
  brand: string;
  model: string;
  discipline: string;
  likes?: number;
  is_manufacturer_provided?: boolean;
  settings: {
    strength: number;
    damping: number;
    minimumForce: number;
  };
} 