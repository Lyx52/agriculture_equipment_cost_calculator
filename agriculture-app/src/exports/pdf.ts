import * as jsPDF from 'jspdf'
import { FarmlandModel } from '@/stores/model/farmlandModel.ts'
import { buildHtml } from '@/utils.ts'
import type { IPdfTemplateProps } from '@/props/IPdfTemplateProps.ts'
import PdfTemplate from '@/exports/templates/PdfTemplate.vue'
import html2pdf from 'html2pdf.js'

export const buildPdfReport = (farmland: FarmlandModel) => {
  const doc = new jsPDF.jsPDF({
    putOnlyUsedFonts: false,
    orientation: "landscape",
    unit: 'px',
    format: 'a4',
  });
  const width = doc.internal.pageSize.getWidth() * 1.5;
  const height = doc.internal.pageSize.getHeight() * 1.4;
  doc.setProperties({
    title: "Bruto seguma novērtējums",
  });
  doc.addFont('https://fonts.gstatic.com/s/notoserif/v23/ga6iaw1J5X9T9RW6j9bNVls-hfgvz8JcMofYTa32J4wsL2JAlAhZqFCjwM0Lhq_Szw.ttf', 'Noto Serif', 'normal');
  doc.addFont('https://fonts.gstatic.com/s/notoserif/v23/ga6iaw1J5X9T9RW6j9bNVls-hfgvz8JcMofYTa32J4wsL2JAlAhZT1ejwM0Lhq_Szw.ttf', 'Noto Serif', 'bold');
  doc.setFont("Noto Serif", "normal");
  const html = buildHtml<IPdfTemplateProps>(PdfTemplate, {
    farmland,
    width,
    height,
  });

  html2pdf(html, {
    margin:       3,
    filename:     'myfile.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 3, logging: true, letterRendering: false },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' },
    pagebreak: {
      mode: '',
      before: '.before',
      after: '.after',
      avoid: '.avoid'
    }
  });
}
