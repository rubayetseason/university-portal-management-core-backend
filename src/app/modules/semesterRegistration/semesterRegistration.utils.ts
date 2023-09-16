/* eslint-disable @typescript-eslint/no-explicit-any */
const getAvailableCourses = (
  studentCompletedCourses: any,
  studentCurrentlyTakenCourses: any,
  offeredCourses: any
) => {
  //get completedCourses id
  const completedCoursesId = studentCompletedCourses.map(
    (course: any) => course.courseId
  );

  const availableCoursesList = offeredCourses
    .filter(
      (offeredCourse: any) =>
        //availableCoursesList is array that doesnt includes the courses that a student already taken
        !completedCoursesId.includes(offeredCourse.courseId)
    )
    .filter((course: any) => {
      //check if prerequisite is completed or not
      const preRequisites = course.course.preRequisite;
      if (preRequisites.length === 0) {
        return true;
      } else {
        //if prerequisite is available
        //get prerequisiteCourses id
        const preRequisiteIds = preRequisites.map(
          (preRequisite: any) => preRequisite.preRequisiteId
        );
        //check if in prerequisiteCourses array every courses are fulfilled or not
        //every function returns true if all satisfies else returns false
        return preRequisiteIds.every((id: string) =>
          completedCoursesId.includes(id)
        );
      }
    }) //check if students currently taken courses
    .map((course: any) => {
      const isAlreadyTakenCourse = studentCurrentlyTakenCourses.find(
        (c: any) => c.offeredCourseId === course.id
      );

      if (isAlreadyTakenCourse) {
        course.offeredCourseSections.map((section: any) => {
          if (section.id === isAlreadyTakenCourse.offeredCourseSectionId) {
            section.isTaken = true;
          } else {
            section.isTaken = false;
          }
        });
        return {
          ...course,
          isTaken: true,
        };
      } else {
        course.offeredCourseSections.map((section: any) => {
          section.isTaken = false;
        });
        return {
          ...course,
          isTaken: false,
        };
      }
    });

  return availableCoursesList;
};

export const SemesterRegistrationUtils = {
  getAvailableCourses,
};
