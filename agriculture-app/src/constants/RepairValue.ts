import { calculateRepairValue } from '@/utils'

export function getRepairValueForUsageHoursNew(equipmentType: RepairCategory, totalUsageHours: number): number {
  // Category, RF1, RF2
  // traktors_4x2 0.007 2.0
  // traktors_4x4 0.003 2.0
  // plough 0.290 1.8
  // smagie_diski 0.180 1.7
  // tandema_disks 0.180 1.7
  // cizelarkls_700 0.280 1.4
  // lauku_kultivators 0.270 1.4
  // ecesas 0.270 1.4
  // rullveida_veltnis_mulcetajs 0.160 1.3
  // rotejosas_ecesas 0.360 2.0
  // rindstarpu_kultivators 0.170 2.2
  // heders_uzkarinams 0.050 2.3
  // kartupelu_novaksanas_kombains 0.190 1.4
  // plaujmasinakondicionieris 0.180 1.6
  // plaujmasinakondicionieris_rotacijas 0.440 2.0
  // siena_grabeklis 0.170 1.4
  // kipu_prese 0.230 1.8
  // kipu_prese_liela 0.100 1.8
  // lopbaribas_novaksanas_kombains_velkamais 0.150 1.6
  // lopbaribas_kombains_sp 0.030 2.0
  // kombains_sp 0.025 2.1
  // pasgajejkombains_sp 0.025 2.1
  // kokvilnas_novaksanas_kombains_sp 0.110 1.8
  // plaujmasina_piku 0.460 1.7
  // plaujmasinas_rotacijas 0.440 2.0
  // lielo_ritulu_prese 0.430 1.8
  // cukurbiesu_kombains 0.590 1.3
  // rindu_staditajs 0.320 2.1
  // graudu_sejmasina 0.320 2.1
  // meslojuma_izkliedetajs 0.160 1.6
  // stangu_tipa_smidzinatajs 0.410 1.3
  // smidzinatajs_ar_pneimatiskais 0.410 1.3
  // pupinu_novilcejsvilcejs 0.180 1.6
  // stublaju_smalcinatajs 0.180 1.6
  // lopbaribas_putejs 0.630 1.3
  // piekabe 0.015 1.3
  // lopbaribas_piekabe 0.160 1.6

  switch(equipmentType) {
    case 'traktors_4x2': return calculateRepairValue(0.007, 2.0, totalUsageHours);
    case 'traktors_4x4': return calculateRepairValue(0.003, 2.0, totalUsageHours);
    case 'plough': return calculateRepairValue(0.290, 1.8, totalUsageHours);
    case 'smagie_diski': return calculateRepairValue(0.180, 1.7, totalUsageHours);
    case 'tandema_disks': return calculateRepairValue(0.180, 1.7, totalUsageHours);
    case 'cizelarkls_700': return calculateRepairValue(0.280, 1.4, totalUsageHours);
    case 'lauku_kultivators': return calculateRepairValue(0.270, 1.4, totalUsageHours);
    case 'ecesas': return calculateRepairValue(0.270, 1.4, totalUsageHours);
    case 'rullveida_veltnis_mulcetajs': return calculateRepairValue(0.160, 1.3, totalUsageHours);
    case 'rotejosas_ecesas': return calculateRepairValue(0.360, 2.0, totalUsageHours);
    case 'rindstarpu_kultivators': return calculateRepairValue(0.170, 2.2, totalUsageHours);
    case 'heders_uzkarinams': return calculateRepairValue(0.050, 2.3, totalUsageHours);
    case 'kartupelu_novaksanas_kombains': return calculateRepairValue(0.190, 1.4, totalUsageHours);
    case 'plaujmasinakondicionieris': return calculateRepairValue(0.180, 1.6, totalUsageHours);
    case 'plaujmasinakondicionieris_rotacijas': return calculateRepairValue(0.440, 2.0, totalUsageHours);
    case 'siena_grabeklis': return calculateRepairValue(0.170, 1.4, totalUsageHours);
    case 'kipu_prese': return calculateRepairValue(0.230, 1.8, totalUsageHours);
    case 'kipu_prese_liela': return calculateRepairValue(0.100, 1.8, totalUsageHours);
    case 'lopbaribas_novaksanas_kombains_velkamais': return calculateRepairValue(0.150, 1.6, totalUsageHours);
    case 'lopbaribas_kombains_sp': return calculateRepairValue(0.030, 2.0, totalUsageHours);
    case 'kombains_sp': return calculateRepairValue(0.025, 2.1, totalUsageHours);
    case 'pasgajejkombains_sp': return calculateRepairValue(0.025, 2.1, totalUsageHours);
    case 'kokvilnas_novaksanas_kombains_sp': return calculateRepairValue(0.110, 1.8, totalUsageHours);
    case 'plaujmasina_piku': return calculateRepairValue(0.460, 1.7, totalUsageHours);
    case 'plaujmasinas_rotacijas': return calculateRepairValue(0.440, 2.0, totalUsageHours);
    case 'lielo_ritulu_prese': return calculateRepairValue(0.430, 1.8, totalUsageHours);
    case 'cukurbiesu_kombains': return calculateRepairValue(0.590, 1.3, totalUsageHours);
    case 'rindu_staditajs': return calculateRepairValue(0.320, 2.1, totalUsageHours);
    case 'graudu_sejmasina': return calculateRepairValue(0.320, 2.1, totalUsageHours);
    case 'meslojuma_izkliedetajs': return calculateRepairValue(0.160, 1.6, totalUsageHours);
    case 'stangu_tipa_smidzinatajs': return calculateRepairValue(0.410, 1.3, totalUsageHours);
    case 'smidzinatajs_ar_pneimatiskais': return calculateRepairValue(0.410, 1.3, totalUsageHours);
    case 'pupinu_novilcejsvilcejs': return calculateRepairValue(0.180, 1.6, totalUsageHours);
    case 'stublaju_smalcinatajs': return calculateRepairValue(0.180, 1.6, totalUsageHours);
    case 'lopbaribas_putejs': return calculateRepairValue(0.630, 1.3, totalUsageHours);
    case 'piekabe': return calculateRepairValue(0.015, 1.3, totalUsageHours);
    case 'lopbaribas_piekabe': return calculateRepairValue(0.160, 1.6, totalUsageHours);
  }
  return 0;
}

export type RepairCategory = 'traktors_4x2' | 'traktors_4x4' | 'plough' | 'smagie_diski' | 'tandema_disks' | 'cizelarkls_700' | 'lauku_kultivators' | 'ecesas' | 'rullveida_veltnis_mulcetajs' | 'rotejosas_ecesas' | 'rindstarpu_kultivators' | 'heders_uzkarinams' | 'kartupelu_novaksanas_kombains' | 'plaujmasinakondicionieris' | 'plaujmasinakondicionieris_rotacijas' | 'siena_grabeklis' | 'kipu_prese' | 'kipu_prese_liela' | 'lopbaribas_novaksanas_kombains_velkamais' | 'lopbaribas_kombains_sp' | 'kombains_sp' | 'pasgajejkombains_sp' | 'kokvilnas_novaksanas_kombains_sp' | 'plaujmasina_piku' | 'plaujmasinas_rotacijas' | 'lielo_ritulu_prese' | 'cukurbiesu_kombains' | 'rindu_staditajs' | 'graudu_sejmasina' | 'meslojuma_izkliedetajs' | 'stangu_tipa_smidzinatajs' | 'smidzinatajs_ar_pneimatiskais' | 'pupinu_novilcejsvilcejs' | 'stublaju_smalcinatajs' | 'lopbaribas_putejs' | 'piekabe' | 'lopbaribas_piekabe';

