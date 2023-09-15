import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { StudentEnrolledCourseMarksConroller } from './studentEnrolledCourseMarks.controller';
import { StudentEnrolledCourseMarksValidation } from './studentEnrolledCourseMarks.validation';

const router = express.Router();

router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.FACULTY),
  StudentEnrolledCourseMarksConroller.getAllMarks
);

router.get(
  '/my-marks',
  auth(ENUM_USER_ROLE.STUDENT),
  StudentEnrolledCourseMarksConroller.getMyCourseMarks
);

router.patch(
  '/update-student-marks',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.FACULTY),
  validateRequest(StudentEnrolledCourseMarksValidation.updateZodStudentMarks),
  StudentEnrolledCourseMarksConroller.updateStudentMarks
);
router.patch(
  '/update-final-total-marks',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.FACULTY),
  validateRequest(
    StudentEnrolledCourseMarksValidation.updateZodStudentCourseFinalTotalMarks
  ),
  StudentEnrolledCourseMarksConroller.updateFinalTotalMarks
);

export const StudentEnrolledCourseMarksRoutes = router;
