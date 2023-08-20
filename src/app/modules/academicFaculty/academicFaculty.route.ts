import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicFacultyController } from './academicFaculty.contoller';
import { AcademicFacultyValidation } from './academicFaculty.validation';

const router = express.Router();

router.get('/', AcademicFacultyController.getAllAcademicFaculties);
router.get('/:id', AcademicFacultyController.getSingleAcademicFaculty);

router.post(
  '/',
  validateRequest(AcademicFacultyValidation.createZodAcademicFaculty),
  AcademicFacultyController.createAcademicFaculty
);

export const AcademicFacultyRoutes = router;
