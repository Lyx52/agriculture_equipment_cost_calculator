import { calculateRepairValue } from '@/utils'

export function getRepairValueForUsageHoursNew(equipmentType: RepairCategory, totalUsageHours: number): number {
  // Category, RF1, RF2, totalUsageHours
  // traktors_4x2 0.007 2.0 12000
  // traktors_4x4 0.003 2.0 16000
  // plough 0.290 1.8 2000
  // smagie_diski 0.180 1.7 2000
  // tandema_disks 0.180 1.7 2000
  // cizelarkls_700 0.280 1.4 2000
  // lauku_kultivators 0.270 1.4 2000
  // ecesas 0.270 1.4 2000
  // rullveida_veltnis_mulcetajs 0.160 1.3 2000
  // rotejosas_ecesas 0.360 2.0 2000
  // rindstarpu_kultivators 0.170 2.2 2000
  // heders_uzkarinams 0.050 2.3 2000
  // kartupelu_novaksanas_kombains 0.190 1.4 2500
  // plaujmasinakondicionieris 0.180 1.6 2500
  // plaujmasinakondicionieris_rotacijas 0.440 2.0 2000
  // siena_grabeklis 0.170 1.4 2500
  // kipu_prese 0.230 1.8 2000
  // kipu_prese_liela 0.100 1.8 3000
  // lopbaribas_novaksanas_kombains_velkamais 0.150 1.6 2000
  // lopbaribas_kombains_sp 0.030 2.0 4000
  // kombains_sp 0.025 2.1 3000
  // pasgajejkombains_sp 0.025 2.1 3000
  // kokvilnas_novaksanas_kombains_sp 0.110 1.8 3000
  // plaujmasina_piku 0.460 1.7 2000
  // plaujmasinas_rotacijas 0.440 2.0 2000
  // lielo_ritulu_prese 0.430 1.8 1500
  // cukurbiesu_kombains 0.590 1.3 1500
  // rindu_staditajs 0.320 2.1 1500
  // graudu_sejmasina 0.320 2.1 1500
  // meslojuma_izkliedetajs 0.160 1.6 3000
  // stangu_tipa_smidzinatajs 0.410 1.3 1500
  // smidzinatajs_ar_pneimatiskais 0.410 1.3 1500
  // pupinu_novilcejsvilcejs 0.180 1.6 2500
  // stublaju_smalcinatajs 0.180 1.6 2500
  // lopbaribas_putejs 0.630 1.3 1200
  // piekabe 0.015 1.3 3000
  // lopbaribas_piekabe 0.160 1.6 2000
  switch(equipmentType) {
    case 'traktors_4x2': return calculateRepairValue(0.007, 2.0, Math.min(12000, totalUsageHours));
    case 'traktors_4x4': return calculateRepairValue(0.003, 2.0, Math.min(16000, totalUsageHours));
    case 'plough': return calculateRepairValue(0.290, 1.8, Math.min(2000, totalUsageHours));
    case 'smagie_diski': return calculateRepairValue(0.180, 1.7, Math.min(2000, totalUsageHours));
    case 'tandema_disks': return calculateRepairValue(0.180, 1.7, Math.min(2000, totalUsageHours));
    case 'cizelarkls_700': return calculateRepairValue(0.280, 1.4, Math.min(2000, totalUsageHours));
    case 'lauku_kultivators': return calculateRepairValue(0.270, 1.4, Math.min(2000, totalUsageHours));
    case 'ecesas': return calculateRepairValue(0.270, 1.4, Math.min(2000, totalUsageHours));
    case 'rullveida_veltnis_mulcetajs': return calculateRepairValue(0.160, 1.3, Math.min(2000, totalUsageHours));
    case 'rotejosas_ecesas': return calculateRepairValue(0.360, 2.0, Math.min(2000, totalUsageHours));
    case 'rindstarpu_kultivators': return calculateRepairValue(0.170, 2.2, Math.min(2000, totalUsageHours));
    case 'heders_uzkarinams': return calculateRepairValue(0.050, 2.3, Math.min(2000, totalUsageHours));
    case 'kartupelu_novaksanas_kombains': return calculateRepairValue(0.190, 1.4, Math.min(2500, totalUsageHours));
    case 'plaujmasinakondicionieris': return calculateRepairValue(0.180, 1.6, Math.min(2500, totalUsageHours));
    case 'plaujmasinakondicionieris_rotacijas': return calculateRepairValue(0.440, 2.0, Math.min(2000, totalUsageHours));
    case 'siena_grabeklis': return calculateRepairValue(0.170, 1.4, Math.min(2500, totalUsageHours));
    case 'kipu_prese': return calculateRepairValue(0.230, 1.8, Math.min(2000, totalUsageHours));
    case 'kipu_prese_liela': return calculateRepairValue(0.100, 1.8, Math.min(3000, totalUsageHours));
    case 'lopbaribas_novaksanas_kombains_velkamais': return calculateRepairValue(0.150, 1.6, Math.min(2000, totalUsageHours));
    case 'lopbaribas_kombains_sp': return calculateRepairValue(0.030, 2.0, Math.min(4000, totalUsageHours));
    case 'kombains_sp': return calculateRepairValue(0.025, 2.1, Math.min(3000, totalUsageHours));
    case 'pasgajejkombains_sp': return calculateRepairValue(0.025, 2.1, Math.min(3000, totalUsageHours));
    case 'kokvilnas_novaksanas_kombains_sp': return calculateRepairValue(0.110, 1.8, Math.min(3000, totalUsageHours));
    case 'plaujmasina_piku': return calculateRepairValue(0.460, 1.7, Math.min(2000, totalUsageHours));
    case 'plaujmasinas_rotacijas': return calculateRepairValue(0.440, 2.0, Math.min(2000, totalUsageHours));
    case 'lielo_ritulu_prese': return calculateRepairValue(0.430, 1.8, Math.min(1500, totalUsageHours));
    case 'cukurbiesu_kombains': return calculateRepairValue(0.590, 1.3, Math.min(1500, totalUsageHours));
    case 'rindu_staditajs': return calculateRepairValue(0.320, 2.1, Math.min(1500, totalUsageHours));
    case 'graudu_sejmasina': return calculateRepairValue(0.320, 2.1, Math.min(1500, totalUsageHours));
    case 'meslojuma_izkliedetajs': return calculateRepairValue(0.160, 1.6, Math.min(3000, totalUsageHours));
    case 'stangu_tipa_smidzinatajs': return calculateRepairValue(0.410, 1.3, Math.min(1500, totalUsageHours));
    case 'smidzinatajs_ar_pneimatiskais': return calculateRepairValue(0.410, 1.3, Math.min(1500, totalUsageHours));
    case 'pupinu_novilcejsvilcejs': return calculateRepairValue(0.180, 1.6, Math.min(2500, totalUsageHours));
    case 'stublaju_smalcinatajs': return calculateRepairValue(0.180, 1.6, Math.min(2500, totalUsageHours));
    case 'lopbaribas_putejs': return calculateRepairValue(0.630, 1.3, Math.min(1200, totalUsageHours));
    case 'piekabe': return calculateRepairValue(0.015, 1.3, Math.min(3000, totalUsageHours));
    case 'lopbaribas_piekabe': return calculateRepairValue(0.160, 1.6, Math.min(2000, totalUsageHours));
  }
  return 0;
}

export type RepairCategory = 'traktors_4x2' | 'traktors_4x4' | 'plough' | 'smagie_diski' | 'tandema_disks' | 'cizelarkls_700' | 'lauku_kultivators' | 'ecesas' | 'rullveida_veltnis_mulcetajs' | 'rotejosas_ecesas' | 'rindstarpu_kultivators' | 'heders_uzkarinams' | 'kartupelu_novaksanas_kombains' | 'plaujmasinakondicionieris' | 'plaujmasinakondicionieris_rotacijas' | 'siena_grabeklis' | 'kipu_prese' | 'kipu_prese_liela' | 'lopbaribas_novaksanas_kombains_velkamais' | 'lopbaribas_kombains_sp' | 'kombains_sp' | 'pasgajejkombains_sp' | 'kokvilnas_novaksanas_kombains_sp' | 'plaujmasina_piku' | 'plaujmasinas_rotacijas' | 'lielo_ritulu_prese' | 'cukurbiesu_kombains' | 'rindu_staditajs' | 'graudu_sejmasina' | 'meslojuma_izkliedetajs' | 'stangu_tipa_smidzinatajs' | 'smidzinatajs_ar_pneimatiskais' | 'pupinu_novilcejsvilcejs' | 'stublaju_smalcinatajs' | 'lopbaribas_putejs' | 'piekabe' | 'lopbaribas_piekabe';

