import { Status } from '../models/student.model';

export interface CreateStudentDTO {
  name: string;
  age: number;
  email: string;
  phone: string;
  status: Status;
  profile: string;
  password: string;
  role: string;
}

export interface UpdateStudentDTO {
  name?: string;
  age?: number;
  email?: string;
  phone?: string;
  status?: Status;
  profile?: string;
  password?: string;
}
