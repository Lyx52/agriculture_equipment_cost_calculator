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

export type ChartType = 'Bar' | 'Line' | 'PolarArea' | 'Doughnut' | 'Pie' | 'BarAndLine';
export const ChartTypes = {
    'Bar': 'Stabiņu',
    'Line': 'Līniju',
    'BarAndLine': 'Stabiņu un Līniju',
    'PolarArea': 'Area',
    'Doughnut': 'Sektoru',
    'Pie': 'Sektoru (Pilns)'
} as Record<ChartType, string>;