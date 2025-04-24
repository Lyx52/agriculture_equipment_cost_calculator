/// <reference types="vite/client" />
declare const __APP_VERSION__: string;
declare const __APP_BUILD_DATE__: string;
declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | [number, number, number, number];
    filename?: string;
    image?: { type: string; quality: number };
    html2canvas?: { scale: number, logging: boolean, letterRendering: boolean };
    jsPDF?: { unit: string; format: string; orientation: string };
    pagebreak?: {
      mode?: string,
      before?: string,
      after?: string,
      avoid?: string,
    }
  }

  export default function html2pdf(
    element: HTMLElement | string,
    options?: Html2PdfOptions
  ): Promise<void>;
}
