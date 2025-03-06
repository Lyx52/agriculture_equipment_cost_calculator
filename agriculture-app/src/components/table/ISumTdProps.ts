export type ItemType = any;
export interface ISumTdProps {
  items: ItemType[];
  getProp: (item: ItemType) => number;
}
