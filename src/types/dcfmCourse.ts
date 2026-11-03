/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CourseTopic = 
  | 'chillers'
  | 'ventilation'
  | 'aircon_psychrometrics'
  | 'water_plumbing'
  | 'fire_protection'
  | 'town_gas'
  | 'drawings_symbols'
  | 'tutorials'
  | 'practicals';

export interface ChillerHourlyRecord {
  hour: string; // e.g. "9 AM"
  coolingLoadRt: number;
  pChKw: number;
  pChwpKw: number;
  pCwpKw: number;
  pCtKw: number;
  chillerPlantTotalKw: number;
  plantKwPerRt: number;
  configuration: string;
}

export interface MechVentRoom {
  id: string;
  roomType: 'office' | 'restaurant' | 'shop' | 'workshop' | 'classroom' | 'car_park' | 'toilet' | 'lobby' | 'kitchen';
  name: string;
  lengthM: number;
  widthM: number;
  heightM: number;
  customOccupancy?: number;
  hoodOperating?: boolean; // For kitchen
}

export interface WaterSupplyBuilding {
  buildingName: string;
  highestFittingHeightM: number; // above Ground
  groundElevationMslM: number; // ground level above MSL
  occupancyType: 'dwelling' | 'hostel' | 'hotel' | 'office_no_canteen' | 'office_canteen' | 'school';
  occupantCount: number;
  monthlyWaterConsumptionM3: number;
  isGovernment: boolean;
}

export interface FireExtinguisherCalc {
  hazardLevel: 'low' | 'medium' | 'high';
  floorAreaM2: number;
  classBVolumeLitres?: number;
}
