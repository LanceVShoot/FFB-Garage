export interface FFBSetting {
  id: number;
  car: string;
  wheelbase: string;
  discipline: string;
  likes?: number;
  settings: {
    strength: number;
    damping: number;
    minimumForce: number;
  };
} 