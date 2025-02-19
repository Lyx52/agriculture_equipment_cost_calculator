/* eslint-disable  @typescript-eslint/no-explicit-any */

import type { IEquipmentSpecifications } from '@/stores/interface/IEquipmentSpecifications.ts'
import type { RepairCategory } from '@/constants/RepairValue.ts'
import { format, parse } from 'date-fns'
import emitter from '@/stores/emitter.ts'
import { useAuthStore } from '@/stores/auth.ts'
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

export function minBy(values: any[], key: any): any {
  return values.reduce((res, v) => {
    if (!(key in res) || res[key] > v[key]) {
      return v;
    }
    return res;
  }, {});
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
  return minBy(values.map(v => ({value: v, diff: Math.abs(v - value)})), 'diff')['value'];
}

export const dateToString = (date: Date) => date.toISOString().slice(0, 10);

export const currentYear = () => new Date().getFullYear();

export const getBackendUri = () => {
  return import.meta.env.DEV ? 'http://localhost:6969' : 'https://backend.ikarslab.id.lv';
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
    case 'graudaugu_kombains':
    case 'ogu_novaksans_kombains':
      return specs.self_propelled ? 'pasgajejkombains_sp' : 'kombains_sp';
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
      return 'piekabe';
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
      return 'lopbaribas_piekabe';
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
  "USER_ALREADY_EXISTS": "Lietotājs jau eksistē"
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
