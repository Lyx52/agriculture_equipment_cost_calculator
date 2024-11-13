import moment from "moment/moment";
import type {IOption} from "@/stores/interfaces/IOption";

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
    vid_temp_last_c: "Meteo Vid. Temp C",
    vid_moist_soil_last_mm_1: "Meteo Vid. Augsnes mitrums (1)",
    vid_moist_soil_last_mm_2: "Meteo Vid. Augsnes mitrums (2)",
    vid_humidity: "Meteo Vid. Relatīvais mitrums",
    vid_bar: "Meteo Vid. Gaisa spiediens, bārs",
    vid_wind_speed_ms: "Meteo Vid. Vējšs m/s",
    vid_thsw_index: "Meteo Vid. THSW Indekss",
    vid_solar_rad: "Meteo Vid. Saules radiācija",
    vid_dew_point_c: "Meteo Vid. Rasas punkts, C",
    vid_heat_index_c: "Meteo Vid. Siltuma indekss, C",
    vid_wet_bulb_c: "Meteo Vid. Wet Bulb, C",
    vid_wind_chill_c: "Meteo Vid. Wind chill, C",
    vid_agrihort_soil_temperature: "Agrihorts Augsnes temperatūra -6cm, C",
    vid_agrihort_surface_temperature: "Agrihorts Virszemes temperatūra, C",
    vid_agrihort_air_temperature: "Agrihorts Gaisa temperatūra +12cm, C",
    vid_agrihort_vol_moisture: "Agrihorts Mitrums"
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


export const unique = <T>(data: T[]): T[] => {
    return data.reduce((res, val) => {
        if (!res.includes(val)) res.push(val);
        return res;
    }, [] as T[]);
};
export const last = <T>(data: T[]): T|null => {
    return data?.length ? data[data.length - 1] : null
}
export const groupBy = <T, K extends keyof any>(data: T[], getKey: (item: T) => K): Record<K, T[]> =>  {
    return data.reduce((result, item) => {
        const group = getKey(item);
        if (!result[group]) {
            result[group] = [];
        }
        result[group].push(item);
        return result;
    }, {} as Record<K, T[]>);
};
export const pluck = <T>(data: T[], getValue: (item: T) => any): any[] => {
    return data.map((item) => getValue(item));
}
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

export const min = <T>(data: T[], getValue: (item: T) => number|undefined|null): number => {
    const filtered = data.filter(v => getValue(v)).map(v => Number(getValue(v)));

    return Math.min(...filtered);
}

export const max = <T>(data: T[], getValue: (item: T) => number|undefined|null): number => {
    const filtered = data.filter(v => getValue(v)).map(v => Number(getValue(v)));
    return Math.max(...filtered);
}

export type ChartAggregationType = 'avg' | 'sum' | 'min' | 'max';
export const ChartAggregationTypes = {
    'avg': 'Vidējais',
    'sum': 'Summa',
    'min': 'Minimālais',
    'max': 'Maksimālais'
} as Record<ChartAggregationType, string>;

export const ChartAggregationFunctions = {
    'avg': avg,
    'sum': sum,
    'min': min,
    'max': max
} as Record<ChartAggregationType, <T>(data: T[], getValue: (item: T) => (number | undefined | null)) => number>;

export type DateCategoryGrouping = 'date' | 'month' | 'year';
export const DateGroupingTypeOptions = [
    { value: 'date', text: 'Pa dienām' },
    { value: 'month', text: 'Pa mēnešiem' },
    { value: 'year', text: 'Pa gadiem' },
] as IOption<DateCategoryGrouping>[]

export const getDateCategory = (timestamp: number) => {
    return moment.unix(timestamp).format('DD.MM.YYYY');
}
export const getMonthCategory = (timestamp: number) => {
    return moment.unix(timestamp).format('MM.YYYY');
}
export const getYearCategory = (timestamp: number) => {
    return moment.unix(timestamp).format('YYYY');
}
export const DateGroupingFunction = {
    'date': getDateCategory,
    'month': getMonthCategory,
    'year': getYearCategory
} as Record<DateCategoryGrouping, (timestamp: number) => string>

export const getCurrentTable = (): string => {
    if (document.getElementById('stende-parameters-all')) return 'stende_parameters_all';
    if (document.getElementById('agrihort-meteo')) return 'agrihort_meteo';
    if (document.getElementById('stende-meteo-data')) return 'meteo';
    if (document.getElementById('combined-measurements')) return 'combined';
    if (document.getElementById('gas-measurements-lbtu')) return 'gas_measurements_lbtu';
    if (document.getElementById('gas-measurements')) return 'gas_measurements';
    if (document.getElementById('soil-sample-measurements')) return 'soil_sample_measurements';
    return 'combined';
}

export const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download';

    const clickHandler = () => {
        setTimeout(() => {
            URL.revokeObjectURL(url);
            removeEventListener('click', clickHandler);
        }, 150);
    };

    a.addEventListener('click', clickHandler, false);

    return a;
}

export const downloadCsv = (lines: string[], filename: string) => {
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const downloadLink = downloadBlob(blob, `${filename}.csv`);
    downloadLink.click();
}
