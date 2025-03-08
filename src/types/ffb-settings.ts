export interface FFBSetting {
  id: number;
  car: string;
  discipline: string;
  is_manufacturer_provided: boolean;
  likes: number;
  brand: string;
  model: string;
  settings: {
    [key: string]: number;
  };
} 