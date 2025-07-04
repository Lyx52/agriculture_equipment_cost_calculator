/* eslint-disable  @typescript-eslint/no-explicit-any */
import type { IEquipmentSpecifications } from '@/stores/interface/IEquipmentSpecifications.ts'
import type { RepairCategory } from '@/constants/RepairValue.ts'
import { format, parse } from 'date-fns'
import emitter from '@/stores/emitter.ts'
import { useAuthStore } from '@/stores/auth.ts'
import { createApp, h } from 'vue'
import type { Component } from 'vue'
import { Chart, type ChartType } from 'chart.js'
export function sum(values: number[]): number {
  return values.reduce((res, val) => {
    return res + val;
  }, 0);
}
export function avg(values: number[]): number {
  return sum(values) / values.length;
}
export function max(values: number[]): number {
  return values.reduce((res, val) => {
    return Math.max(res, val);
  }, Number.NEGATIVE_INFINITY);
}
export function first<T>(values: T[]): T|undefined {
  return values.length > 0 ? values[0] : undefined;
}
export function minByKey(values: any[], key: any): any {
  return values.reduce((res, v) => {
    if (!(key in res) || res[key] > v[key]) {
      return v;
    }
    return res;
  }, {});
}

export function minBy<T>(values: T[], getProp: (item: T) => number|undefined): T|undefined {
  return values.reduce((result: T|undefined, value: T) => {
    if (!result) return value;
    const a = getProp(result) as number;
    const b = getProp(value) as number;
    if (a > b) {
      return value;
    }

    return result;
  }, undefined);
}

export function maxBy<T>(values: T[], getProp: (item: T) => number|undefined): T|undefined {
  return values.reduce((result: T|undefined, value: T) => {
    if (!result) return value;
    const a = getProp(result) as number;
    const b = getProp(value) as number;
    if (a < b) {
      return value;
    }

    return result;
  }, undefined);
}

export function groupedBy<T>(values: T[], getProp: (item: T) => string|undefined): Record<string, T[]> {
  return values.reduce((res: Record<string, T[]>, value: T) => {
    const key = getProp(value);
    if (!key) return res;
    if (!res[key]) {
      res[key] = [];
    }
    res[key].push(value);
    return res;
  }, {} as Record<string, T[]>);
}

export function uniqueBy<T>(values: T[], getProp: (item: T) => any|undefined): any[] {
  return values.reduce((res: any[], value: T) => {
    const propValue = getProp(value);
    if (propValue && !res.includes(propValue)) {
      res.push(propValue);
    }
    return res;
  }, [] as any[]);
}

export function sumBy<T>(values: T[], getProp: (item: T) => number): number {
  return values.reduce((res: number, value: T) => {
    const gotValue = getProp(value);
    return res + gotValue;
  }, 0);
}

export function getClosestValue(values: any[], value: any) {
  return minBy<any>(values.map(v => ({value: v, diff: Math.abs(v - value)})), (item: any) => item.diff).value;
}

export function sortBy<T>(
  array: T[],
  getProp: (item: T) => any,
  ascending: boolean = true
): T[] {
  return array.sort((a, b) => {
    if (getProp(a) < getProp(b)) return ascending ? -1 : 1;
    if (getProp(a) > getProp(b)) return ascending ? 1 : -1;
    return 0;
  });
}

export const dateToString = (date: Date) => date.toISOString().slice(0, 10);

export const currentYear = () => new Date().getFullYear();

export const getBackendUri = () => {
  return import.meta.env.DEV ? '' : 'https://backend.ikarslab.id.lv';
  //return import.meta.env.DEV ? 'http://localhost:6969' : 'https://backend.ikarslab.id.lv';
}
export type FetchMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
export const fetchBackend = async (method: FetchMethod, url: string, body: any|undefined = undefined) => {
  const authStore = useAuthStore();
  return await fetch(url, {
    method: method as string,
    headers: {
      'Content-Type': 'application/json',
      ...(authStore.isLoggedIn ? { 'Authorization': `Bearer ${authStore.token}` } : {})
    },
    credentials: 'include',
    ...(body ? { body: JSON.stringify(body) } : {})
  });

}

export const arraysEqual = (a: any[], b: any[]): boolean => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }

  return true;
}

export const parseJwt = (token: string): undefined|any => {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return undefined;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [header, payload, signature] = parts;
    const data = atob(payload);
    return JSON.parse(data);
  } catch(e) {
    console.log(e);
    return undefined;
  }
}

export const yearsBetweenDates = (startDate: Date|undefined): number[] => {
  const yearsBetween = (new Date()).getFullYear() - (startDate ?? new Date).getFullYear();
  return Array.from({ length: yearsBetween + 1 }).map((_, i) => (new Date()).getFullYear() - i)
}

export type MachineTypeCode = "tractor" | "combine" | "plough" | "other_soil_tilage" | "planter_sower_sprayer" | "mower_chipper" | "press" | "swather_rake" | "transport" | "other";

export const mapEquipmentTypeCode = (specs: IEquipmentSpecifications, equipmentType: string): RepairCategory | undefined => {
  switch (equipmentType) {
    case 'traktors_4x2':
      return 'traktors_4x2';
    case 'traktors_4x4':
    case 'traktors_kezu':
      return 'traktors_4x4';
    case 'kipu_prese':
      return 'kipu_prese';
    case 'kartupelu_novaksanas_kombains':
      return 'kartupelu_novaksanas_kombains';
    case 'ecesas':
    case 'freze':
    case 'dzilirdinatajs':
    case 'valotajsarditajs':
      return 'ecesas';
    case 'kombaina_heders':
      return 'heders_uzkarinams';
    case 'darzenu_stadama_masina':
    case 'kartupelu_stadama_masina':
    case 'auglu_koku_un_ogulaju_stadama_masina':
    case 'stadu_konteineru_pildisanas_un_stadisanas_iekarta':
      return 'rindu_staditajs';
    case 'ritulu_prese':
    case 'prese_ar_ietineju':
    case 'ietinejs':
    case 'pleves_ieklajejs':
      return 'lielo_ritulu_prese';
    case 'skidrmeslu_cisterna':
    case 'skidrmeslu_izkliedes_caurulvadu_sistema':
    case 'skidrmeslu_izkliedetaja_aprikojums':
    case 'organisko_meslu_izkliedetajs':
    case 'mineralmeslu_un_kalka_izkliedetajs':
    case 'tunelu_sistema_skabbaribai':
      return 'meslojuma_izkliedetajs';
    case 'darzenu_novaksanas_kombains':
      return specs.self_propelled ? 'lopbaribas_kombains_sp' : 'lopbaribas_novaksanas_kombains_velkamais';
    case 'graudaugu_kombains':
    case 'ogu_novaksans_kombains':
      return specs.self_propelled ? 'kombains_sp' : 'lopbaribas_novaksanas_kombains_velkamais';
    case 'sejmasina':
    case 'sikseklu_sejmasina':
    case 'precizas_izsejas_sejmasina':
      return 'graudu_sejmasina';
    case 'rindstarpu_kultivators':
      return 'rindstarpu_kultivators';
    case 'rugaines_kultivators':
    case 'kultivators':
    case 'komposta_apversejs':
    case 'kartupelu_vagotajs':
      return 'lauku_kultivators';
    case 'arkls':
      return 'plough';
    case 'plaujmasina':
    case 'maurina_plaujmasina':
    case 'lakstu_plavejs':
      const hasConditioner = specs.self_propelled;
      const hasDiscShredder = specs.shredder_type === 'disc';
      if (hasConditioner && hasDiscShredder) {
        return 'plaujmasinakondicionieris_rotacijas';
      } else if (hasConditioner) {
        return 'plaujmasinakondicionieris';
      } else if (hasDiscShredder) {
        return 'plaujmasinas_rotacijas';
      } else {
        return 'plaujmasina_piku';
      }
    case 'veltnis':
    case 'skabbaribas_blietetajveltnis':
    case 'akmenu_vacejs':
      return 'plaujmasinakondicionieris';
    case 'trimmeris':
      return 'plaujmasinas_rotacijas';
    case 'diski':
      return 'smagie_diski';
    case 'razas_novaksanas_platforma':
      return 'lopbaribas_piekabe';
    case 'salmu_smalcinatajsizkliedetajs':
    case 'skeldotajs':
    case 'mulceris':
      return 'stublaju_smalcinatajs';
    case 'miglotajs':
    case 'smidzinatajs':
    case 'udens_suknis':
      return 'smidzinatajs_ar_pneimatiskais';
    case 'laistisanas_iekarta':
    case 'sluce':
      return 'stangu_tipa_smidzinatajs';
    case 'savacejpiekabe':
      return 'piekabe';
    default:
      return undefined;
  }
};

export const internalDateFormat = "yyyy-MM-dd";
export const strToDate = (value: string) => {
  return parse(value, internalDateFormat, new Date());
}

export const dateToStr = (value: Date) => {
  return format(value, internalDateFormat);
}

export const ErrorTranslations = {
  "USER_ALREADY_EXISTS": "Lietotājs jau eksistē",
  "NAME": "Lauks 'nosaukums' ir obligāts",
  "LOGIN_FAILED": "Neizdevās pieslēgties, pārbaudiet paroli un e-pastu!"
} as Record<string, string>;

export const validateProblem = async (response: Response) => {
  if (response.ok) return false;
  try {
    const data = await response.json();
    if (data.errors) {
      const errorKey = Object.keys(data.errors)[0];
      emitter.emit('error', ErrorTranslations[errorKey] || errorKey);
      return true;
    }
  } catch (e) {
    console.log(e);
  }
  emitter.emit('error', 'Radās kļūda!')
}

export const calculateRemainingValue = (c1: number, c2: number, c3: number, n: number, h: number): number => {
  const valueFactor = c1 - c2 * Math.sqrt(n) - c3 * Math.sqrt(h);
  // Ensure that valueFactor is not negative before squaring
  const adjustedValueFactor = Math.max(valueFactor, 0);
  return 100 * Math.pow(adjustedValueFactor, 2);
}

export const calculateRepairValue = (rf1: number, rf2: number, accumulatedHours: number): number => {
  return rf1 * Math.pow(accumulatedHours / 1000, rf2);
}

export const DisplayNumber = (value: number|undefined|string, fraction: number = 2, defaultEmptyValue = '-'): string => {
  return isNaN(Number(value)) || !isFinite(Number(value)) ? defaultEmptyValue : Number(value).toFixed(fraction);
}

export const NanAsZero = (value: number|undefined): number => {
  return isNaN(Number(value)) || !isFinite(Number(value)) ? 0 : Number(value);
}

export const DownloadFileFromBuffer = (buffer: any, fileName: string, contentType: string) => {
  const uint8Array = buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : new Uint8Array(buffer);
  const blob = new Blob([uint8Array], { type: contentType });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = fileName;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const buildHtml = async <TProps>($component: Component, props: TProps = {} as TProps): Promise<string> => {
  return new Promise((resolve) => {
    const $container = document.createElement('div');

    // Create and mount the app
    const $app = createApp({
      render() {
        return h($component, props);
      },
    });

    // Mount the app to the container and get the HTML
    $app.mount($container);
    const html = $container.innerHTML;

    $app.unmount();
    resolve(html);
  });
}

export const renderChartJs = <CType extends ChartType>(type: CType, width: number, height: number, config: any) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const chart = new Chart(canvas.getContext('2d')!, {
    type: type,
    ...config,
  });
  return chart.toBase64Image();
}
