export const ChartDataColumns = {
    co2_mg_sec_after_calibration: "AREI_Stende_[CO2] sek. (mg CO2 m-2 h-1)",
    soil_temp: "AREI_Stende_Soil Temp.",
    air_temp: "AREI_Stende_Air temperature",
    rainfall: "AREI_Stende_Rainfall",
    sun_duration: "AREI_Stende_Sun duration",
    moisture: "AREI_Stende_Moisture (%)",
    preassure_mb: "AREI_Stende_Pressure (mb)",
    preassure_kpa: "AREI_Stende_Pressure (kPa)",
    error_mode: "AREI_Stende_Error mode",
    co2_measurement: "LBTU_CO2-C (mg C m-2 h-1) ar korekciju",
    n2o_measurement: "LBTU_N2O-N (mg N m-2 h-1) ar korekciju",
    ch4_measurement: "LBTU_CH4-C (mg C m-2 h-1) ar korekciju",
    vid_ph_h2o: "AREI Vid. pH H20",
    vid_ph_kcl: "AREI Vid. pH KCl",
    vid_oxidizable_c: "AREI Vid. oksid. C, %",
    vid_total_c: "AREI Vid. kopējais C, %",
    vid_organic_material: "AREI Vid. org. vielas, %",
    vid_p2o5_mg_kg: "AREI P2O5 vid, mg/kg",
    vid_k2o_mg_kg: "AREI Vid. K2O, mg/kg",
    vid_temp_c: "Meteo Vid. temp C",
    vid_relative_humidity: "Meteo Vid. rel. mitr",
    vid_rain_day_mm: "Meteo Vid. lietus MM",
    vid_rain_rate_mm_per_hr: "Meteo Vid. lietus MM/h",
    vid_solar_radiation: "Meteo Vid. saules radiācija",
    vid_wind_ms: "Meteo Vid. vējšs m/s",
    vid_wind_degrees: "Meteo Vid. vēja virziens",
    min_wind_degrees: "Meteo Min. vēja virziens",
    max_wind_degrees: "Meteo Max. vēja virziens"
} as Record<string, string>;
export const ChartGroupingColumns = {
    id_field_nr: "ID Lauka nr.",
    vertical_field_nr: "Slejas nr.",
    horizontal_field_nr: "Lauciņa nr.",
    operation_type: "Apstrādes veids",
    operation: "Apstrādes operācija (UZC)",
} as Record<string, string>;
export const ChartColumns = Object.fromEntries([
    ...Object.entries(ChartGroupingColumns),
    ...Object.entries(ChartDataColumns)
]) as Record<string, string>;
export interface ITest {
    test: string;
    test2: number;
}
export const groupBy = <T, K extends keyof any>(data: T[], getKey: (item: T) => K) =>  {
    return data.reduce((result, item) => {
        const group = getKey(item);
        if (!result[group]) {
            result[group] = [];
        }
        result[group].push(item);
        return result;
    }, {} as Record<K, T[]>);
};
export const sum = <T>(data: T[], getValue: (item: T) => number|undefined|null): number => {
    const filtered = data.filter(v => getValue(v));
    return filtered.reduce((result, item) => {
        return result + Number(getValue(item));
    }, 0)
}
export const avg = <T>(data: T[], getValue: (item: T) => number|undefined|null): number => {
    const filtered = data.filter(v => getValue(v));
    return filtered.reduce((result, item) => {
        return result + Number(getValue(item));
    }, 0) / filtered.length;
}
