import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentController } from './academicDepartment.controller';
import { AcademicDepartmentValidation } from './academicDepartment.validations';

const router = express.Router();

router.get('/', AcademicDepartmentController.getAllDepartments);
router.get('/:id', AcademicDepartmentController.getSingleDepartment);

router.post(
  '/',
  validateRequest(AcademicDepartmentValidation.createZodDepartment),
  AcademicDepartmentController.createDepartment
);

router.patch(
  '/:id',
  validateRequest(AcademicDepartmentValidation.updateZodDepartment),
  AcademicDepartmentController.updateDepartment
);

router.delete('/:id', AcademicDepartmentController.deleteDepartment);

export const AcademicDepartmentRoutes = router;
