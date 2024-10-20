export interface IResponse<TData> {
    data: TData[];
    recordsTotal: number;
    recordsFiltered: number;
    start: number;
    length: number;
    draw: number;
}