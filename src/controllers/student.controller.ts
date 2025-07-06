import { Request, Response } from 'express';
import { StudentService } from '../services/student.services';
import { CreateStudentDTO, UpdateStudentDTO } from '../types/student.dto';

export class StudentController {
    constructor(private studentService: StudentService) { }

    async loadLogin(req: Request, res: Response): Promise<void> {
        res.set('Cache-Control', 'no-store');
        res.render('login', { title: 'Login' });
    }

    async loadSignUp(req: Request, res: Response): Promise<void> {
        res.set('Cache-Control', 'no-store');
        res.render('signup', { title: 'Sign Up' });
    }

    async signupStudent(req: Request, res: Response): Promise<void> {
        try {
            const body = req.body as CreateStudentDTO;
            body.profile = req.file?.filename || '';
            body.role = 'student';

            const student = await this.studentService.registerStudent(body);
            res.status(201).json({ message: 'Registered', student });
        } catch (err) {
            console.error('Signup error:', err);
            res.status(500).json({ message: 'Error registering student' });
        }
    }

    async loginStudent(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        try {
            const student = await this.studentService.authenticateStudent(email, password);
            if (!student) {
                res.status(401).json({ message: 'Invalid email or password' });
                return;
            }

            req.session.student = {
                id: student.id,
                name: student.name,
                email: student.email,
                role: student.role,
            };

            const redirectUrl = student.role === 'admin' ? '/students' : '/home';
            res.status(200).json({ message: `Welcome ${student.name}`, redirectUrl });
        } catch (err) {
            console.error('Login error:', err);
            res.status(500).json({ message: 'Login failed' });
        }
    }

    async loadHome(req: Request, res: Response): Promise<void> {
        try {
            const sessionStudent = req.session.student;

            if (!sessionStudent) {
                res.redirect('/login');
                return;
            }

            const student = await this.studentService.findStudentByEmail(sessionStudent.email);

            if (!student) {
                res.status(404).send('Student not found');
                return;
            }

            res.render('home', {
                title: 'Home',
                name: student.name,
                profile: student.profile,
                email: student.email
            });
        } catch (error) {
            console.error('Error loading home:', error);
            res.status(500).send('Something went wrong');
        }
    }


    async logout(req: Request, res: Response): Promise<void> {
        req.session.destroy((err) => {
            if (err) {
                console.error('Logout error:', err);
                return res.status(500).send('Failed to logout');
            }
            res.clearCookie('connect.sid');
            res.redirect('/login');
        });
    }

    async createStudent(req: Request, res: Response): Promise<void> {
        try {
            const body = req.body as CreateStudentDTO;
            body.profile = req.file?.filename || '';
            const student = await this.studentService.createStudent(body);
            res.status(201).json({ message: 'Created', student });
        } catch (error) {
            console.error('Create error:', error);
            res.status(500).json({ message: 'Error creating student' });
        }
    }

    async listStudents(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = 5;
            const data = await this.studentService.listStudents(page, limit);
            res.render('students', {
                ...data,
                currentPage: page,
            });
        } catch (err) {
            console.error('List error:', err);
            res.status(500).send('Internal error');
        }
    }

    async showCreateForm(req: Request, res: Response): Promise<void> {
        try {
            res.render('create-student', { title: 'Create Student' });
        } catch (err) {
            console.error('Error loading create form:', err);
            res.status(500).send('Something went wrong');
        }
    }

    async showEditForm(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id);

        try {
            const student = await this.studentService.findById(id);
            if (!student) {
                res.status(404).render('404', { message: 'Student not found' });
                return;
            }

            res.render('edit-student', { title: 'Edit Student', student });
        } catch (err) {
            console.error('Error loading student for edit:', err);
            res.status(500).send('Internal Server Error');
        }
    }


    async updateStudent(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id);
        try {
            const data = req.body as UpdateStudentDTO;
            data.profile = req.file?.filename;
            const updated = await this.studentService.updateStudent(id, data);
            if (!updated) {
                res.status(404).json({ message: 'Not found' });
            }
            res.status(200).json({ message: 'Updated', student : updated, redirectUrl: '/students' });
        } catch (err) {
            res.status(400).json({ message: 'Failed to update' });
        }
    }

    async blockStudent(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id);
        try {
            const result = await this.studentService.updateStatus(id, req.body.status);
            if (!result) {
                res.status(404).json({ message: 'Not found' });
            }
            res.status(200).json({ message: 'Status updated', student : result });
        } catch (err) {
            res.status(500).json({ message: 'Error updating status' });
        }
    }

    async deleteStudent(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id);
        try {
            const result = await this.studentService.deleteStudent(id);
            if (!result) {
                res.status(404).json({ message: 'Not found' });
            }
            res.status(200).json({ message: 'Deleted' });
        } catch (err) {
            res.status(500).json({ message: 'Error deleting student' });
        }
    }
}