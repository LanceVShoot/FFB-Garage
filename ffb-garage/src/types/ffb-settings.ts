export interface Manufacturer {
  id: number;
  name: string;
}

export interface SettingField {
  id: number;
  fieldName: string;
  displayName: string;
  minValue?: number;
  maxValue?: number;
  unit?: string;
  description?: string;
}

export interface FFBSetting {
  id: number;
  carName: string;
  manufacturer: Manufacturer;
  model: string;
  discipline: string;
  isManufacturerProvided: boolean;
  likes: number;
  createdBy?: string;
  settingValues: {
    fieldId: number;
    fieldName: string;
    displayName: string;
    value: number;
    unit?: string;
  }[];
} 