import { Status } from '../types/student.interface';

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

export type UpdateStudentDTO = Partial<CreateStudentDTO>;

// export interface UpdateStudentDTO {
//   name?: string;
//   age?: number;
//   email?: string;
//   phone?: string;
//   status?: Status;
//   profile?: string;
//   password?: string;
// }