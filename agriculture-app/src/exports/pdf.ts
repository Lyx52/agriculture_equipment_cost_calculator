import * as jsPDF from 'jspdf'
import { FarmlandModel } from '@/stores/model/farmlandModel.ts'
import { buildHtml } from '@/utils.ts'
import type { IPdfTemplateProps } from '@/props/IPdfTemplateProps.ts'
import PdfTemplate from '@/exports/templates/PdfTemplate.vue'

const buildReportHtml = (farmland: FarmlandModel, width: number, height: number) => {
  return buildHtml<IPdfTemplateProps>(PdfTemplate, {
    farmland,
    width,
    height,
  });
}
export const buildPdfReport = (farmland: FarmlandModel) => {
  const scalingFactor = 0.4;
  const pageWidth = 500 / scalingFactor;
  const pageHeight = 330 / scalingFactor;

  const doc = new jsPDF.jsPDF({
    putOnlyUsedFonts: false,
    orientation: "landscape",
    unit: 'px',
    format: 'a4',
  });
  doc.setProperties({
    title: "Bruto seguma novērtējums",
  });
  doc.addFont('https://fonts.gstatic.com/s/notoserif/v23/ga6iaw1J5X9T9RW6j9bNVls-hfgvz8JcMofYTa32J4wsL2JAlAhZqFCjwM0Lhq_Szw.ttf', 'Noto Serif', 'normal');
  doc.addFont('https://fonts.gstatic.com/s/notoserif/v23/ga6iaw1J5X9T9RW6j9bNVls-hfgvz8JcMofYTa32J4wsL2JAlAhZT1ejwM0Lhq_Szw.ttf', 'Noto Serif', 'bold');
  doc.setFont("Noto Serif", "normal");

  doc.html(buildReportHtml(farmland, pageWidth, pageHeight),  {
    callback: function (pdf) {
      pdf.save("bruto_seguma_novertejums.pdf");
    },
    html2canvas: {
      scale: scalingFactor,
    },
  });
}
