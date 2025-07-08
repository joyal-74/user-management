export enum Status {
  Active = 'Active',
  Blocked = 'Blocked',
}

export interface Student {
  id: string | number;
  name: string;
  age: number;
  email: string;
  phone: string;
  status: Status;
  profile: string;
  password: string;
  role: string;
}