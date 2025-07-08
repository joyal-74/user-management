import { IStudentModel } from '../interfaces/IStudentModel';
import { CreateStudentDTO, UpdateStudentDTO } from '../types/student.dto';
import bcrypt from 'bcryptjs';
import { Status } from '../types/student.interface';

export class StudentService {
    constructor(private studentModel: IStudentModel) {}

    async registerStudent(data: CreateStudentDTO) {
        data.password = await bcrypt.hash(data.password, 10);
        return this.studentModel.create(data);
    }

    async authenticateStudent(email: string, password: string) {
        const student = await this.studentModel.findByEmail(email);
        if (!student) return null;

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return null;

        return student;
    }

    async createStudent(data: Omit<CreateStudentDTO, 'password'>) {
        const password = await bcrypt.hash('changeme', 10);
        return this.studentModel.create({
            ...data,
            password,
            role: 'student',
        });
    }


    async updateStudent(id: number, data: UpdateStudentDTO) {
        return this.studentModel.update(id, data);
    }

    async findStudentByEmail(email: string) {
        return this.studentModel.findByEmail(email);
    }

    async listStudents(page: number, limit: number) {
        const offset = (page - 1) * limit;
        const students = await this.studentModel.findPaginated(limit, offset);
        const total = await this.studentModel.countAll();
        return {
            students,
            totalStudents: total,
            totalPages: Math.ceil(total / limit),
            from: offset + 1,
            to: Math.min(offset + limit, total),
        };
    }

    async updateStatus(id: number, status: Status) {
        return this.studentModel.updateStatus(id, { status });
    }

    async deleteStudent(id: number) {
        return this.studentModel.delete(id);
    }

    async findById(id: number) {
        return this.studentModel.findById(id);
    }
}
