import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { academicSemesterController } from './academicSemester.controller';
import { AcademicSemesterValidation } from './academicSemester.validation';
const router = express.Router();

router.get('/', academicSemesterController.getAllSemester);
router.post(
  '/create-semester',
  validateRequest(AcademicSemesterValidation.createZodSemester),
  academicSemesterController.createSemester
);

export const AcademicSemesterRoutes = router;
