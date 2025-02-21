export interface IEquipmentUsage {
  hours_per_year: number;
  hours_per_individual_years: Record<string, number>;
  use_hours_per_individual_years: boolean;
  expected_age: number;
}
