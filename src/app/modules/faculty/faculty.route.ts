import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyController } from './faculty.controller';
import { FacultyValidation } from './faculty.validations';

const router = express.Router();

router.get('/', FacultyController.getAllFaculties);

router.get('/:id', FacultyController.getSingleFaculty);

router.post(
  '/',
  validateRequest(FacultyValidation.createZodFaculty),
  FacultyController.createFaculty
);

router.patch(
  '/:id',
  validateRequest(FacultyValidation.updateZodFaculty),
  FacultyController.updateFaculty
);

router.delete('/:id', FacultyController.deleteFaculty);

export const FacultyRoutes = router;
