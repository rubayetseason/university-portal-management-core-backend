import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { StudentEnrolledCourseController } from './studentEnrolledCourse.controller';
import { StudentEnrolledCourseValidation } from './studentEnrolledCourse.validation';

const router = express.Router();

router.get('/', StudentEnrolledCourseController.getAllStudentEnrolledCourse);

router.get(
  '/:id',
  StudentEnrolledCourseController.getSingleStudentEnrolledCourse
);

router.post(
  '/',
  validateRequest(
    StudentEnrolledCourseValidation.createZodStudentEnrolledCourse
  ),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  StudentEnrolledCourseController.createStudentEnrolledCourse
);

router.patch(
  '/:id',
  validateRequest(
    StudentEnrolledCourseValidation.updateZodStudentEnrolledCourse
  ),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  StudentEnrolledCourseController.updateStudentEnrolledCourse
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  StudentEnrolledCourseController.deleteStudentEnrolledCourse
);

export const StudentEnrolledCourseRoutes = router;
