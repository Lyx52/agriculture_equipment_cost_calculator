import type {IOption} from "@/stores/interfaces/IOption";
export const CropTypes = {
    111: 'V_Kvieši',
    112: 'Z_Kvieši',
    113: 'V_Kvieši, ar pasēju',
    115: 'V_Speltas kvieši',
    116: 'Z_Speltas kvieši',
    117: 'Z_Kvieši, ar pasēju',
    118: 'V_Speltas kvieši, ar pasēju',
    119: 'Z_Speltas kvieši, ar pasēju',
    121: 'Rudzi',
    122: 'Rudzi, Kaupo',
    123: 'Rudzi,  populācijas, izņemot "Kaupo"',
    125: 'Rudzi, ar pasēju',
    126: 'Rudzi, Kaupo, ar pasēju',
    127: 'Rudzi,  populācijas, izņemot "Kaupo", ar pasēju',
    131: 'V_Mieži',
    132: 'Z_Mieži',
    133: 'V_Mieži, ar pasēju',
    135: 'Z_Mieži, ar pasēju ',
    140: 'Auzas',
    141: 'Auzas, ar pasēju',
    150: 'V_Tritikāle',
    151: 'Z_Tritikāle',
    152: 'V_Tritikāle, ar pasēju',
    154: 'Z_Tritikāle, ar pasēju',
    160: 'Griķi',
    161: 'Griķi ar tauriņz. Pasēju',
    170: 'Kaņepes',
    211: 'V_Rapsis',
    212: 'Z_Rapsis',
    213: 'V_Ripsis',
    214: 'Z_Ripsis',
    215: 'Sinepe',
    216: 'Sinepe ar tauriņz. Pasēju',
    310: 'Lini, šķiedras',
    330: 'Lini, eļļas',
    410: 'Lauka pupas',
    420: 'Zirņi',
    430: 'Lupīna',
    441: 'V_Vīķi',
    442: 'Z_Vīķi',
    443: 'Soja',
    445: 'Graudaugu un zirņu maisījums, kur zirņi >50%',
    446: 'Graudaugu un zirņu maisījums, kur zirņi >50%, ar stiebrzāļu vai tauriņziežu pasēju',
    447: 'Graudaugu un vīķu maisījums, kur vīķi >50%',
    610: 'Papuve',
    611: 'Zaļmēslojuma papuve',
    713: 'Citur neminētas stiebrzāles',
    715: 'Facēlija',
    716: 'Facēlija ar tauriņz. Pasēju',
    720: 'Aramzemē sēts stiebrzāļu un/vai lopbarības zālaugu (iesk. proteīnaugu) maisījums',
    723: 'Sarkanais āboliņš',
    724: 'Baltais āboliņš',
    725: 'Bastarda āboliņš',
    726: 'Lucerna',
    727: 'Austrumu galega',
    728: 'Ragainais vanagnadziņš',
    729: 'Amoliņš',
    731: 'Pļavas timotiņš, sēklas ieguvei',
    732: 'Pļavas auzene, sēklas ieguvei',
    733: 'Hibrīdā airene, sēklas ieguvei',
    734: 'Daudzziedu viengadīgā airene, sēklas ieguvei',
    735: 'Sarkanā auzene, sēklas ieguvei',
    736: 'Ganību airene, sēklas ieguvei',
    737: 'Niedru auzene, sēklas ieguvei',
    738: 'Pļavas skarene, sēklas ieguvei',
    739: 'Kamolzāle, sēklas ieguvei',
    741: 'Citur neminēta kukurūza',
    760: 'Stiebz. vai tauriņz. maisīj., tauriņz.>50%',
    761: 'Auzeņairene sēklai',
    781: 'Inkarnāta āboliņš',
    791: 'Kukurūza biogāzes ieguvei',
    991: 'Auzas50/ baltā sinepe6',
    992: 'Baltā sinepe10/ redīss6(rutks10)',
    993: 'Auzas120/ vīķi7/ facēlija1',
    994: 'Airene15/ griķi20/ facēlija1',
    995: 'Airene10(Auza50)/ inkarnātāb10/ facēlija1',
    996: 'Rudzi50/ rapsis2/ facēlija1',
    998: 'Facēlija5/ vīķi30/ sinepe5',
    988: 'Sakņu redīss',
    999: 'Pasējs'
} as Record<number, string>;

export interface IDateInterval {
    from: string,
    to: string
}
export const dateToString = (date: Date) => date.toISOString().slice(0, 10);
export const currentYear = () => new Date().getFullYear();
export const CropCalendarPlant = {
    // 'corn': {
    //     from: dateToString(new Date(currentYear(), 2, 1)),
    //     to: dateToString(new Date(currentYear(), 4, 31)),
    // } as IDateInterval,
    // 'winter_wheat': {
    //     from: dateToString(new Date(currentYear(), 8, 1)),
    //     to: dateToString(new Date(currentYear(), 11, 31)),
    // } as IDateInterval,
    // 'spring_wheat': {
    //     from: dateToString(new Date(currentYear(), 1, 1)),
    //     to: dateToString(new Date(currentYear(), 4, 31)),
    // } as IDateInterval,
    // 'spring_barley': {
    //     from: dateToString(new Date(currentYear(), 3, 1)),
    //     to: dateToString(new Date(currentYear(), 4, 15)),
    // } as IDateInterval,
    // 'winter_barley': {
    //     from: dateToString(new Date(currentYear(), 8, 1)),
    //     to: dateToString(new Date(currentYear(), 9, 31)),
    // } as IDateInterval,
} as Record<number, IDateInterval>;
export const DefaultDateIntervalPlant = {
    from: dateToString(new Date(currentYear(), 8, 1)),
    to: dateToString(new Date(currentYear(), 9, 31)),
} as IDateInterval;
export const CropCalendarHarvest = {
    // 'corn': {
    //     from: dateToString(new Date(currentYear(), 8, 1)),
    //     to: dateToString(new Date(currentYear(), 11, 31)),
    // } as IDateInterval,
    // 'winter_wheat': {
    //     from: dateToString(new Date(currentYear() + 1, 5, 1)),
    //     to: dateToString(new Date(currentYear() + 1, 7, 31)),
    // } as IDateInterval,
    // 'spring_wheat': {
    //     from: dateToString(new Date(currentYear(), 6, 1)),
    //     to: dateToString(new Date(currentYear(), 8, 30)),
    // } as IDateInterval,
    // 'spring_barley': {
    //     from: dateToString(new Date(currentYear(), 7, 1)),
    //     to: dateToString(new Date(currentYear(), 8, 15)),
    // } as IDateInterval,
    // 'winter_barley': {
    //     from: dateToString(new Date(currentYear() + 1, 5, 1)),
    //     to: dateToString(new Date(currentYear() + 1, 6, 31)),
    // } as IDateInterval,
} as Record<number, IDateInterval>;

export const DefaultDateIntervalHarvest = {
    from: dateToString(new Date(currentYear() + 1, 5, 1)),
    to: dateToString(new Date(currentYear() + 1, 6, 31)),
} as IDateInterval;

export const CropTypeOptions = Object.keys(CropTypes)
    .map(c => ({
        text: CropTypes[Number(c)],
        value: Number(c),
    } as IOption<number>));
