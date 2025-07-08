import { Student } from '../types/student.interface';

export interface IStudentModel {
  findAll(): Promise<Student[]>;
  findById(id: string | number): Promise<Student | null>;
  findByEmail(email: string): Promise<Student | null>;
  create(student: Omit<Student, 'id'>): Promise<Student>;
  updateStatus(id: string | number, data: Partial<Student>): Promise<Student | null>;
  update(id: string | number, data: Partial<Student>): Promise<Student | null>;
  delete(id: string | number): Promise<boolean>;
  findPaginated(limit: number, offset: number): Promise<Student[]>;
  countAll(): Promise<number>;
}
