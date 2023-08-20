import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemesterController } from './academicSemester.controller';
import { AcademicSemesterValidation } from './academicSemester.validation';
const router = express.Router();

router.get('/', AcademicSemesterController.getAllSemester);
router.get('/:id', AcademicSemesterController.getSingleSemester);
router.post(
  '/create-semester',
  validateRequest(AcademicSemesterValidation.createZodSemester),
  AcademicSemesterController.createSemester
);

export const AcademicSemesterRoutes = router;
