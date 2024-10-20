import type {IOption} from "@/stores/interfaces/IOption";

export interface IBSpinningSelectProps {
    id: string;
    title?: string;
    label?: string;
    options: IOption<any>[];
    isSpinning: boolean;
}