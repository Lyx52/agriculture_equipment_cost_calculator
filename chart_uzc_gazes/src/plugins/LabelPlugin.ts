import {defaults, type Plugin} from "chart.js";
import {fontString, renderText, toFont} from "chart.js/helpers";
import {getScaleUnderPoint} from "@/chart_utils";
import {last, max, min} from "@/utils";

export default {
    id: 'custom_label_plugin',
    afterDraw(chart, args, options) {
        const { data, ctx,  } = chart;

        ctx.font = fontString(
            defaults.font.size!,
            defaults.font.style!,
            defaults.font.family!,
        )
        const fontOpt = toFont({
            size: defaults.font.size!,
            style: defaults.font.style!,
            family: defaults.font.family!,
        })
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#000';
        // for (let i = 0; i < chart.data.labels!.length; i++) {
        //     const meta = chart.getDatasetMeta(i);
        //     for (const elem of meta.data) {
        //         const scale = getScaleUnderPoint(elem.x, elem.y, chart);
        //         ctx.fillText(i.toString(), scale!.x, scale!.y - 20);
        //     }
        // }
        // let dataLabels = data?.dataLabels ?? [];
        // if (data.datasets.length < 1 || dataLabels.length < 1) return;
        // const metasets = data.datasets.map((_, i) => chart.getDatasetMeta(i));
        // const allElements = metasets.flatMap(ms => ms.data)
        // let firstLabelXPositions = chart.getDatasetMeta(0).data.map(d => d.x);
        // let firstLabelYPositions = chart.getDatasetMeta(0).data.map(d => d.y);
        // let lastLabelXPositions = chart.getDatasetMeta(data.datasets.length - 1).data.map(d => d.x);
        //
        // for (let i = 0; i < firstLabelXPositions.length; i++) {
        //
        //     if (data.datasets.length > 1) {
        //         let filteredElements = allElements.filter(e => e.x >= (firstLabelXPositions[i] - defaults.font.size!) && e.x <= lastLabelXPositions[i]);
        //         renderText(ctx, dataLabels[i].toString(), 0, 0, fontOpt, {
        //             rotation: 270 * (Math.PI / 180),
        //             translation: [
        //                 (firstLabelXPositions[i] + lastLabelXPositions[i] - defaults.font.size!) / 2, max(filteredElements, e => e.y) - 100
        //             ]
        //         })
        //     } else {
        //         renderText(ctx, dataLabels[i].toString(), 0, 0, fontOpt, {
        //             rotation: 270 * (Math.PI / 180),
        //             translation: [
        //                 (firstLabelXPositions[i] - defaults.font.size!), firstLabelYPositions[i]
        //             ]
        //         })
        //     }
        // }
    },
} as Plugin<'bar'>
