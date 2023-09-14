export const studentEnrolledCourseMarksFilterableFields: string[] = [
  'academicSemesterId',
  'studentId',
  'studentEnrolledCourseId',
  'examType',
  'courseId',
];

export const studentEnrolledCourseMarksSearchableFields: string[] = [
  'examType',
  'grade',
];

export const studentEnrolledCourseMarksRelationalFields: string[] = [
  'academicSemesterId',
  'studentId',
  'studentEnrolledCourseId',
];
export const studentEnrolledCourseMarksRelationalFieldsMapper: {
  [key: string]: string;
} = {
  academicSemesterId: 'academicSemester',
  studentId: 'student',
  studentEnrolledCourseId: 'studentEnrolledCourse',
};
