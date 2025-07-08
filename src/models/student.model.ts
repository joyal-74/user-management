import db from '../utils/db';
import { Student, Status } from '../types/student.interface';
import { IStudentModel } from '../interfaces/IStudentModel';

export class SQLStudentModel implements IStudentModel {
    async findAll(): Promise<Student[]> {
        const result = await db.query("SELECT * FROM students WHERE role='student' ORDER BY id DESC");
        return result.rows;
    }

    async findById(id: string | number): Promise<Student | null> {
        const result = await db.query('SELECT * FROM students WHERE id = $1', [id]);
        return result.rows[0] || null;
    }

    async findByEmail(email: string): Promise<Student | null> {
        const result = await db.query('SELECT * FROM students WHERE email = $1', [email]);
        return result.rows[0] || null;
    }

    async create(student: Omit<Student, 'id'>): Promise<Student> {
        const { name, age, email, phone, status = Status.Active, profile, password, role } = student;
        const result = await db.query(
            'INSERT INTO students (name, age, email, phone, status, profile, password, role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [name, age, email, phone, status, profile, password, role]
        );
        return result.rows[0];
    }

    async updateStatus(id: string | number, student: Partial<Omit<Student, 'id'>>): Promise<Student | null> {
        const status = student.status;
        const result = await db.query(
            'UPDATE students SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        return result.rows[0];
    }

    async update(id: string | number, student: Partial<Omit<Student, 'id'>>): Promise<Student | null> {
        const existing = await this.findById(id);
        if (!existing) return null;

        const name = student.name ?? existing.name;
        const age = student.age ?? existing.age;
        const email = student.email ?? existing.email;
        const phone = student.phone ?? existing.phone;
        const status = student.status ?? existing.status;
        const profile = student.profile ?? existing.profile;

        const result = await db.query(
            'UPDATE students SET name = $1, age = $2, email = $3, phone = $4, status = $5, profile = $6 WHERE id = $7 RETURNING *',
            [name, age, email, phone, status, profile, id]
        );
        return result.rows[0];
    }

    async delete(id: string | number): Promise<boolean> {
        const result = await db.query('DELETE FROM students WHERE id = $1', [id]);
        return (result.rowCount ?? 0) > 0;
    }

    async findPaginated(limit: number, offset: number): Promise<Student[]> {
        const result = await db.query(
            "SELECT * FROM students WHERE role='student' ORDER BY id DESC LIMIT $1 OFFSET $2",
            [limit, offset]
        );
        return result.rows;
    }

    async countAll(): Promise<number> {
        const result = await db.query('SELECT COUNT(*) FROM students');
        return parseInt(result.rows[0].count, 10);
    }
}
