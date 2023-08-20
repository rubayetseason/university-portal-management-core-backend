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

router.patch(
  '/:id',
  validateRequest(AcademicFacultyValidation.updateZodAcademicFaculty),

  AcademicFacultyController.updateAcademicFaculty
);

router.delete('/:id', AcademicFacultyController.deleteAcademicFaculty);

export const AcademicFacultyRoutes = router;
