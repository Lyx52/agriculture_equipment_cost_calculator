export interface IOperation {
  id: string;
  user_farmland_id: string|undefined;
  operation_code: string|undefined;
  tractor_or_combine_id: string|undefined;
  machine_id: string|undefined;
  employee_or_external_service_id: string|undefined;
}
