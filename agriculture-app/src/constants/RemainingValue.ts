import { calculateRemainingValue, type MachineTypeCode } from '@/utils.ts'

export function getRemainingValue(is4WheelDrive: boolean, machineType: MachineTypeCode, horsePower: number, usageHoursPerYear: number, ageInYears: number): number {
  // other_soil_tilage - 0.8906 	0.1095 	0
  // press - 0.8521 	0.1014 	0
  // mower_chipper - 0.7557 	0.0672 	0
  // plough - 0.7382 	0.051 	0
  // planter_sower_sprayer - 0.8826 	0.0778 	0
  // transport - 0.9427 	0.1111 	0
  // swather_rake - 0.7911 	0.0913 	0
  // combine - 1.1318 	0.1645 	0.0079
  // other - 1.1318 	0.1645 	0

  switch(machineType) {
    case "other_soil_tilage": {
      return calculateRemainingValue(0.8906, 0.1095, 0, ageInYears, usageHoursPerYear);
    }
    case "press": {
      return calculateRemainingValue(0.8521, 0.1014, 0, ageInYears, usageHoursPerYear);
    }
    case "mower_chipper": {
      return calculateRemainingValue(0.7557, 0.0672, 0, ageInYears, usageHoursPerYear);
    }
    case "plough": {
      return calculateRemainingValue(0.7382, 0.051, 0, ageInYears, usageHoursPerYear);
    }
    case "planter_sower_sprayer": {
      return calculateRemainingValue(0.8826, 0.0778, 0, ageInYears, usageHoursPerYear);
    }
    case "transport": {
      return calculateRemainingValue(0.9427, 0.1111, 0, ageInYears, usageHoursPerYear);
    }
    case "swather_rake": {
      return calculateRemainingValue(0.7911, 0.0913, 0, ageInYears, usageHoursPerYear);
    }
    case "combine": {
      return calculateRemainingValue(1.1318, 0.1645, 0.0079, ageInYears, usageHoursPerYear);
    }
    case 'other': {
      return calculateRemainingValue(1.1318, 0.1645, 0, ageInYears, usageHoursPerYear);
    }
    case 'tractor': {
      // Tractor 4WD -                0.9756 	0.1187 	0.0019
      // Tractor, under 80 hp, 2wd - 	0.981 	0.093 	0.0058
      // Tractor 80-150 hp, 2wd	-     0.9421 	0.0997 	0.0008
      // Tractor over 150 hp, 2wd	    0.9756 	0.1187 	0.0019

      if (is4WheelDrive) {
        return calculateRemainingValue(0.9756, 0.1187, 0.0019, ageInYears, usageHoursPerYear);
      } else if (horsePower < 80) {
        return calculateRemainingValue(0.981, 0.093, 0.0058, ageInYears, usageHoursPerYear);
      } else if (horsePower >= 80 && horsePower <= 150) {
        return calculateRemainingValue(0.9421, 0.0997, 0.0008, ageInYears, usageHoursPerYear);
      }

      return calculateRemainingValue(0.9756, 0.1187, 0.0019, ageInYears, usageHoursPerYear);
    }
  }

  return 0;
}
