import express from 'express';
import { StudentController } from '../controllers/student.controller';
import { StudentService } from '../services/student.services';
import { StudentModel } from '../models/student.model';
import { isAdmin, isStudent, isAlreadyLoggedIn } from '../middlewares/auth';
import upload from '../middlewares/upload';


const studentModel = new StudentModel();
const studentService = new StudentService(studentModel);
const studentController = new StudentController(studentService);

const router = express.Router();

// Authentication pages
router.get('/login', isAlreadyLoggedIn, studentController.loadLogin.bind(studentController));
router.post('/login', studentController.loginStudent.bind(studentController));

router.get('/signup', isAlreadyLoggedIn, studentController.loadSignUp.bind(studentController));
router.post('/signup', upload.single('profile'), studentController.signupStudent.bind(studentController));

router.get('/logout', studentController.logout.bind(studentController));

// Student-only page
router.get('/home', isStudent, studentController.loadHome.bind(studentController));

// Admin-only pages
router.get('/students', isAdmin, studentController.listStudents.bind(studentController));
router.get('/create', isAdmin, studentController.showCreateForm.bind(studentController));
router.post('/create', isAdmin, upload.single('profile'), studentController.createStudent.bind(studentController));
router.get('/edit/:id', isAdmin, studentController.showEditForm.bind(studentController));
router.put('/update/:id', isAdmin, upload.single('profile'), studentController.updateStudent.bind(studentController));
router.delete('/:id', isAdmin, studentController.deleteStudent.bind(studentController));
router.patch('/block/:id', isAdmin, studentController.blockStudent.bind(studentController));

export default router;