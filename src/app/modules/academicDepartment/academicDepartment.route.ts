import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentController } from './academicDepartment.controller';
import { AcademicDepartmentValidation } from './academicDepartment.validations';

const router = express.Router();

router.get('/', AcademicDepartmentController.getAllDepartments);
router.get('/:id', AcademicDepartmentController.getSingleDepartment);

router.post(
  '/',
  validateRequest(AcademicDepartmentValidation.createZodSemester),
  AcademicDepartmentController.createDepartment
);

export const AcademicDepartmentRoutes = router;
