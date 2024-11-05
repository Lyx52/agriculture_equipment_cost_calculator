import type {Chart, ChartTypeRegistry} from "chart.js";

export const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false
}
export type ChartType = 'bar' | 'line';
export const ChartTypes = {
    'bar': 'Stabiņu',
    'line': 'Līniju'
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
