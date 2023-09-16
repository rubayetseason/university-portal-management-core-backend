import express from 'express';
import { AcademicDepartmentRoutes } from '../modules/academicDepartment/academicDepartment.route';
import { AcademicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.route';
import { AcademicSemesterRoutes } from '../modules/academicSemester/academicSemester.route';
import { BuildingRoutes } from '../modules/building/building.route';
import { CourseRoutes } from '../modules/course/course.route';
import { FacultyRoutes } from '../modules/faculty/faculty.route';
import { OfferedCourseRoutes } from '../modules/offeredCourse/offeredCourse.route';
import { OfferedCourseClassScheduleRoutes } from '../modules/offeredCourseClassSchedule/offeredCourseClassSchedule.route';
import { OfferedCourseSectionRoutes } from '../modules/offeredCourseSection/offeredCourseSection.route';
import { RoomRoutes } from '../modules/room/room.route';
import { SemesterRegistrationRoutes } from '../modules/semesterRegistration/semesterRegistration.route';
import { StudentRoutes } from '../modules/student/student.route';
import { StudentEnrolledCourseRoutes } from '../modules/studentEnrolledCourse/studentEnrolledCourse.route';
import { StudentEnrolledCourseMarksRoutes } from '../modules/studentEnrolledCourseMarks/studentEnrolledCourseMarks.route';
import { studentSemesterPaymentRoutes } from '../modules/studentSemesterPayment/studentSemesterPayment.route';

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/academic-semester',
    route: AcademicSemesterRoutes,
  },
  {
    path: '/academic-department',
    route: AcademicDepartmentRoutes,
  },
  {
    path: '/academic-faculty',
    route: AcademicFacultyRoutes,
  },
  {
    path: '/faculty',
    route: FacultyRoutes,
  },
  {
    path: '/student',
    route: StudentRoutes,
  },
  {
    path: '/building',
    route: BuildingRoutes,
  },
  {
    path: '/room',
    route: RoomRoutes,
  },
  {
    path: '/course',
    route: CourseRoutes,
  },
  {
    path: '/semester-registration',
    route: SemesterRegistrationRoutes,
  },
  {
    path: '/offered-course',
    route: OfferedCourseRoutes,
  },
  {
    path: '/offered-course-section',
    route: OfferedCourseSectionRoutes,
  },
  {
    path: '/offered-course-class-schedule',
    route: OfferedCourseClassScheduleRoutes,
  },
  {
    path: '/student-enrolled-course',
    route: StudentEnrolledCourseRoutes,
  },
  {
    path: '/student-enrolled-course-marks',
    route: StudentEnrolledCourseMarksRoutes,
  },
  {
    path: '/student-semester-payment',
    route: studentSemesterPaymentRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
