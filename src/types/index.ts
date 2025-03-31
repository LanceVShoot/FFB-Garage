export interface FFBSetting {
  id: number;
  wheelbase: string;
  wheel: string;
  car: string;
  discipline: string;
  likes: number;
  settings: {
    strength: number;
    smoothing: number;
    minimumForce: number;
  };
}

export interface FilterOptions {
  wheelbase: string[];
  wheel: string[];
  discipline: string[];
} 