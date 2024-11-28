import type {IOption} from "@/stores/interfaces/IOption";
// Crop calendar: https://ipad.fas.usda.gov/rssiws/al/crop_calendar/europe.aspx

export type CropType = 'spring_wheat' | 'winter_wheat' | 'corn' | 'spring_barley' | 'winter_barley';
export const Crops = {
    'spring_wheat': 'Kvieši, pavasara',
    'winter_wheat': 'Kvieši, ziemas',
    'corn': 'Lauku kukurūza',
    'spring_barley': 'Mieži, pavasara',
    'winter_barley': 'Miezi, ziemas'
} as Record<CropType, string>;
export interface IDateInterval {
    from: string,
    to: string
}
export const dateToString = (date: Date) => date.toISOString().slice(0, 10);
export const currentYear = () => new Date().getFullYear();
export const CropCalendarPlant = {
    'corn': {
        from: dateToString(new Date(currentYear(), 2, 1)),
        to: dateToString(new Date(currentYear(), 4, 31)),
    } as IDateInterval,
    'winter_wheat': {
        from: dateToString(new Date(currentYear(), 8, 1)),
        to: dateToString(new Date(currentYear(), 11, 31)),
    } as IDateInterval,
    'spring_wheat': {
        from: dateToString(new Date(currentYear(), 1, 1)),
        to: dateToString(new Date(currentYear(), 4, 31)),
    } as IDateInterval,
    'spring_barley': {
        from: dateToString(new Date(currentYear(), 3, 1)),
        to: dateToString(new Date(currentYear(), 4, 15)),
    } as IDateInterval,
    'winter_barley': {
        from: dateToString(new Date(currentYear(), 8, 1)),
        to: dateToString(new Date(currentYear(), 9, 31)),
    } as IDateInterval,
} as Record<CropType, IDateInterval>;

export const CropCalendarHarvest = {
    'corn': {
        from: dateToString(new Date(currentYear(), 8, 1)),
        to: dateToString(new Date(currentYear(), 11, 31)),
    } as IDateInterval,
    'winter_wheat': {
        from: dateToString(new Date(currentYear() + 1, 5, 1)),
        to: dateToString(new Date(currentYear() + 1, 7, 31)),
    } as IDateInterval,
    'spring_wheat': {
        from: dateToString(new Date(currentYear(), 6, 1)),
        to: dateToString(new Date(currentYear(), 8, 30)),
    } as IDateInterval,
    'spring_barley': {
        from: dateToString(new Date(currentYear(), 7, 1)),
        to: dateToString(new Date(currentYear(), 8, 15)),
    } as IDateInterval,
    'winter_barley': {
        from: dateToString(new Date(currentYear() + 1, 5, 1)),
        to: dateToString(new Date(currentYear() + 1, 6, 31)),
    } as IDateInterval,
} as Record<CropType, IDateInterval>;

export const CropOptions = Object.keys(Crops)
    .map(c => ({
        text: Crops[c as CropType],
        value: c,
    } as IOption<CropType>));
