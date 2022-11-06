import { Observable } from 'rxjs';

export type Input = {
  field: string;
  type: any;
  label: string;
  formControl: any;
  messageError?: () => string;
  placeholder?: string;
  hide?: boolean;
  icon?: string;
};
export type SelectInput = {
  field: string;
  type: any;
  label: string;
  formControl: any;
  messageError?: () => string;
  values?: Observable<any[]>;
  placeholder?: string;
  icon?: string;
  hide?: boolean;
};
