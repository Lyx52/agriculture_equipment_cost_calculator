import type {Chart, ChartTypeRegistry} from "chart.js";

export const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false
}
export const DefaultChartColorsHex = [
    "#7F6600", // Tan
    "#194D70", // Navy
    "#006100", // Dark Green
    "#920007", // Maroon
    "#FF0000", // Red
    "#FFA500", // Orange
    "#FFFF00", // Yellow
    "#008000", // Lime Green
    "#0000FF", // Blue
    "#800080", // Purple
    "#00FFFF", // Cyan
    "#808000", // Olive Green
    "#A9A9A9", // Gray
    "#000000", // Black
    "#C0C0C0", // Silver
    "#FFC0CB", // Pink
    "#808080", // Gray
    "#FFFFF0", // Ivory
    "#F0E68C", // Khaki
    "#E6E6FA" // Lavender
];

export const getChartColors = (count: number): string[] => {
    let colors = [];
    for (let i = 0; i < count; i++) {
        colors.push(DefaultChartColorsHex[i]);
    }
    return colors;
}
export type ChartType = 'bar' | 'line' | 'datalabel';
export const ChartTypes = {
    'bar': 'Stabiņu',
    'line': 'Līniju',
    'datalabel': 'Datu etiķetes'
} as Record<ChartType, string>

export const getScaleUnderPoint = (x: number, y: number, chart: Chart) => {
    const scales = chart.scales;
    const scaleIds = Object.keys(scales);
    for (let i = 0; i < scaleIds.length; i++) {
        const scale = scales[scaleIds[i]];
        if (y >= scale.top && y <= scale.bottom && x >= scale.left && x <= scale.right) {
            return scale;
        }
    }
    return null;
}
export const getDatasetType = (type: ChartType): string => {
    switch (type) {
        case ChartTypes.line: return 'line';
        default: return 'bar'
    }
}
