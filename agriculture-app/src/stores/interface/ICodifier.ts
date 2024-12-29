export interface ICodifier {
  name: string,
  code: string,
  parent_code: string|undefined,
  value: string|undefined,
  children: ICodifier[]
}
