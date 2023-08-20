import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { StudentController } from './student.controller';
import { StudentValidation } from './student.validations';

const router = express.Router();

router.get('/', StudentController.getAllStudents);

router.get('/:id', StudentController.getSingleStudent);

router.post(
    '/',
    validateRequest(StudentValidation.createZodStudent),
    StudentController.createStudent
);

export const StudentRoutes = router;