import type {IOption} from "@/stores/interfaces/IOption";
import {
    type EquipmentSubType,
    EquipmentSubTypes,
    type EquipmentType,
    type EquipmentTypeCategory
} from "@/stores/constants/EquipmentTypes";

export type OperationType =
    "liming" |
    "ploughing" |
    "deep_ripping" |
    "disking" |
    "field_surface_leveling" |
    "cultivation" |
    "combined_soil_tillage" |
    "sowing_without_tillage" |
    "sowing_with_fertilizer_application" |
    "sowing_with_overseeding_and_harrowing" |
    "sowing_with_overseeding_without_harrowing" |
    "sowing_with_soil_tillage_no_fertilizer" |
    "sowing_with_soil_tillage_with_fertilizer" |
    "sowing_with_deep_tillage_and_fertilizer" |
    "direct_sowing_in_sod" |
    "rolling" |
    "harrowing" |
    "fertilizer_application_surface" |
    "spraying" |
    "organic_fertilizer_spreading" |
    "liquid_organic_fertilizer_surface_application_no_incorporation" |
    "liquid_organic_fertilizer_surface_application_with_incorporation" |
    "liquid_organic_fertilizer_injection" |
    "liquid_organic_fertilizer_spreading_no_incorporation" |
    "harvest_with_straw_chopping" |
    "harvest_without_straw_chopping" |
    "straw_chopping" |
    "straw_incorporation" |
    "baling" |
    "grass_mowing" |
    "grass_windrowing" |
    "non_baled_grass_removal" |
    "bale_wrapping" |
    "bale_loading_removal" |
    "aftermath_shredding" |
    "cover_crop_rolling" |
    "other";

export const Operations = {
    "liming": "Kaļķošana",
    "ploughing": "Aršana",
    "deep_ripping": "Dziļirdināšana",
    "disking": "Šķīvošana/diskošana",
    "field_surface_leveling": "Lauka virsmas šļūkšana",
    "cultivation": "Kultivēšana",
    "combined_soil_tillage": "Kombinētā augsnes pirmapstrāde (rugaines kultivators+diski+veltnis)",
    "sowing_without_tillage": "Sēšana, bez augsnes apstrādes",
    "sowing_with_fertilizer_application": "Sēšana kopā ar minerālmēslu iestrādi, bez augsnes papildapstrādes",
    "sowing_with_overseeding_and_harrowing": "Sēšana ar pasēšanu (āboliņa, stiebrzāļu vai cita), kopā ar ecēšanu",
    "sowing_with_overseeding_without_harrowing": "Sēšana ar pasēšanu (āboliņa, stiebrzāļu vai cita), bez ecēšanas",
    "sowing_with_soil_tillage_no_fertilizer": "Sēja kopā ar augsnes apstrādi sēklas dziļumā, bez minerālmēslu iestrādes",
    "sowing_with_soil_tillage_with_fertilizer": "Sēja kopā ar augsnes apstrādi sēklas dziļumā, ar minerālmēslu iestrādi",
    "sowing_with_deep_tillage_and_fertilizer": "Sēja kopā ar augsnes apstrādi 20 cm dziļumā, ar minerālmēslu iestrādi",
    "direct_sowing_in_sod": "Tiešsēja velēnā sēklas dzļumā",
    "rolling": "Pievelšana",
    "harrowing": "Ecēšana",
    "fertilizer_application_surface": "Minerālmēslu izkliedēšana (virssēja)",
    "spraying": "Smidzināšana (AAL, mikroelementi)",
    "organic_fertilizer_spreading": "Organiskā mēslojuma izkliedēšana uz lauka virsmas",
    "liquid_organic_fertilizer_surface_application_no_incorporation": "Šķidro organisko mēslu izliešana uz lauka virsmas bez iestrādes, (nokarenās caurules vai sprauslas)",
    "liquid_organic_fertilizer_surface_application_with_incorporation": "Šķidro organisko mēslu izliešana uz lauka virsmas ar iestrādi (nokarenās caurules vai sprauslas)",
    "liquid_organic_fertilizer_injection": "Šķidro organisko mēslu inžekcija augsnē, jelkādā tās formā",
    "liquid_organic_fertilizer_spreading_no_incorporation": "Šķidro organisko mēslu izkliede bez iestrādes (deflektorplate)",
    "harvest_with_straw_chopping": "Ražas novākšana, ar smalcinātu salmu izkliedēšanu",
    "harvest_without_straw_chopping": "Ražas novākšana, bez salmu smalcināšanaas un izkliedēšanas",
    "straw_chopping": "Salmu smalcināšana (ja nenotiek vienlaikus ar ražas novākšanu)",
    "straw_incorporation": "Salmu ieecēšana (izlīdzina un iejauc augsnē)",
    "baling": "Salmu vai zāles rituļu presēšana",
    "grass_mowing": "Zālāju pļaušana",
    "grass_windrowing": "Zālāju vālošana",
    "non_baled_grass_removal": "Nepresētas zāles novešana no lauka (pļaušana ar iekraušanu)",
    "bale_wrapping": "Rituļu ietīšana",
    "bale_loading_removal": "Rituļu iekraušana, novešana no lauka",
    "aftermath_shredding": "Atāla smalcināšana",
    "cover_crop_rolling": "Starpkultūras pievelšana un sadalīšana"
} as Record<OperationType, string>;

export const OperationOptions = Object.keys(Operations)
    .map(operationType => ({
        text: Operations[operationType as OperationType],
        value: operationType
    })) as IOption<OperationType>[];

export const getEquipmentSubTypesByOperation = (equipmentTypeCategory: EquipmentTypeCategory, operationType: OperationType): EquipmentSubType[] => {
    if (equipmentTypeCategory === 'tractor') {
        return ['tractor_4x2', 'tractor_4x4'];
    }
    return Object.keys(EquipmentSubTypes) as EquipmentSubType[];
};
