/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Course,
  OfferedCourse,
  Prisma,
  SemesterRegistration,
  SemesterRegistrationStatus,
  StudentEnrolledCourseStatus,
  StudentSemesterRegistration,
  StudentSemesterRegistrationCourse,
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { asyncForEach } from '../../../shared/forEachHelper';
import prisma from '../../../shared/prisma';
import { StudentEnrolledCourseMarksService } from '../studentEnrolledCourseMarks/studentEnrolledCourseMarks.services';
import { StudentSemesterPaymentService } from '../studentSemesterPayment/studentSemesterPayment.services';
import { StudentSemesterRegistrationCourseService } from '../studentSemesterRegistrationCourse/studentSemesterRegistrationCourse.services';
import {
  semesterRegistrationRelationalFields,
  semesterRegistrationRelationalFieldsMapper,
  semesterRegistrationSearchableFields,
} from './semesterRegistration.constants';
import {
  IEnrollCoursePayload,
  ISemesterRegistrationFilterRequest,
} from './semesterRegistration.interface';
import { SemesterRegistrationUtils } from './semesterRegistration.utils';

const createSemesterRegistration = async (
  data: SemesterRegistration
): Promise<SemesterRegistration> => {
  const isAnySemesterRegistrationUpcomingOrOngoing =
    await prisma.semesterRegistration.findFirst({
      where: {
        OR: [
          {
            status: SemesterRegistrationStatus.UPCOMING,
          },
          {
            status: SemesterRegistrationStatus.ONGOING,
          },
        ],
      },
    });

  if (isAnySemesterRegistrationUpcomingOrOngoing) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Thers is already an ${isAnySemesterRegistrationUpcomingOrOngoing.status} registration.`
    );
  }

  const result = await prisma.semesterRegistration.create({
    data,
  });

  return result;
};

const getAllSemesterRegistration = async (
  filters: ISemesterRegistrationFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<SemesterRegistration[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: semesterRegistrationSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (semesterRegistrationRelationalFields.includes(key)) {
          return {
            [semesterRegistrationRelationalFieldsMapper[key]]: {
              id: (filterData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereConditions: Prisma.SemesterRegistrationWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.semesterRegistration.findMany({
    include: {
      academicSemester: true,
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.semesterRegistration.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleSemesterRegistration = async (
  id: string
): Promise<SemesterRegistration | null> => {
  const result = await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
    include: {
      academicSemester: true,
    },
  });
  return result;
};

const updateSemesterRegistration = async (
  id: string,
  payload: Partial<SemesterRegistration>
): Promise<SemesterRegistration> => {
  //check if the semester exists
  const isExist = await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Data not found');
  }

  // UPCOMING -> ONGOING -> ENDED
  //cannot go directly from UPCOMING to ENDED and likewise

  if (
    payload.status &&
    isExist.status === SemesterRegistrationStatus.UPCOMING &&
    payload.status !== SemesterRegistrationStatus.ONGOING
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Can only move from UPCOMING to ONGOING'
    );
  }

  if (
    payload.status &&
    isExist.status === SemesterRegistrationStatus.ONGOING &&
    payload.status !== SemesterRegistrationStatus.ENDED
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Can only move from ONGOING to ENDED'
    );
  }

  //update the semester
  const result = await prisma.semesterRegistration.update({
    where: {
      id,
    },
    data: payload,
    include: {
      academicSemester: true,
    },
  });

  return result;
};

const deleteSemesterRegistration = async (
  id: string
): Promise<SemesterRegistration> => {
  const result = await prisma.semesterRegistration.delete({
    where: {
      id,
    },
    include: {
      academicSemester: true,
    },
  });
  return result;
};

const startMyRegistration = async (
  authUserId: string
): Promise<{
  semesterRegistration: SemesterRegistration | null;
  studentSemesterRegistration: StudentSemesterRegistration | null;
}> => {
  //get student info
  const studentInfo = await prisma.student.findFirst({
    where: {
      studentId: authUserId,
    },
  });
  if (!studentInfo) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Student information not found');
  }

  //check if any semester registration is upcoming or ongoing
  const semesterRegistrationInfo = await prisma.semesterRegistration.findFirst({
    where: {
      status: {
        in: [
          SemesterRegistrationStatus.ONGOING,
          SemesterRegistrationStatus.UPCOMING,
        ],
      },
    },
  });

  //if registration is not ongoing, throw error
  if (
    semesterRegistrationInfo?.status === SemesterRegistrationStatus.UPCOMING
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Registration has not started yet'
    );
  }

  //check student registration
  let studentRegistration = await prisma.studentSemesterRegistration.findFirst({
    where: {
      student: {
        id: studentInfo?.id,
      },
      semesterRegistration: {
        id: semesterRegistrationInfo?.id,
      },
    },
  });

  //if not, create one
  if (!studentRegistration) {
    studentRegistration = await prisma.studentSemesterRegistration.create({
      data: {
        student: {
          connect: {
            id: studentInfo?.id,
          },
        },
        semesterRegistration: {
          connect: {
            id: semesterRegistrationInfo?.id,
          },
        },
      },
    });
  }

  return {
    semesterRegistration: semesterRegistrationInfo,
    studentSemesterRegistration: studentRegistration,
  };
};

const enrollIntoCourse = async (
  authUserId: string,
  payload: IEnrollCoursePayload
): Promise<{ message: string }> => {
  return StudentSemesterRegistrationCourseService.enrollIntoCourse(
    authUserId,
    payload
  );
};

const withdrawFromCourse = async (
  authUserId: string,
  payload: IEnrollCoursePayload
): Promise<{ message: string }> => {
  return StudentSemesterRegistrationCourseService.withdrawFromCourse(
    authUserId,
    payload
  );
};

const confirmMyRegistration = async (
  authUserId: string
): Promise<{ message: string }> => {
  //get the semester that is ONGOING
  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING,
    },
  });

  // get studentSemesterRegistration (isConfirmed, totalCreditstaken)
  const studentSemesterRegistration =
    await prisma.studentSemesterRegistration.findFirst({
      where: {
        semesterRegistration: {
          id: semesterRegistration?.id,
        },
        student: {
          studentId: authUserId,
        },
      },
    });

  //if studentSemesterRegistration not found throw error
  if (!studentSemesterRegistration) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You are not recognized for this semester'
    );
  }

  //if student doesnt have any course taken  throw error
  if (studentSemesterRegistration.totalCreditsTaken === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You are not enrolled into any course yet'
    );
  }

  //if creditsTaken < minCredit && creditsTaken > maxCredit
  if (
    studentSemesterRegistration.totalCreditsTaken &&
    semesterRegistration?.minCredit &&
    semesterRegistration.maxCredit &&
    (studentSemesterRegistration.totalCreditsTaken <
      semesterRegistration?.minCredit ||
      studentSemesterRegistration.totalCreditsTaken >
        semesterRegistration?.maxCredit)
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `You can take courses within ${semesterRegistration.minCredit} to ${semesterRegistration.maxCredit} credits`
    );
  }

  //update the confirm field
  await prisma.studentSemesterRegistration.update({
    where: {
      id: studentSemesterRegistration.id,
    },
    data: {
      isConfirmed: true,
    },
  });
  return {
    message: 'Your registration is confirmed',
  };
};

const getMyRegistration = async (authUserId: string) => {
  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING,
    },
    include: {
      academicSemester: true,
    },
  });

  const studentSemesterRegistration =
    await prisma.studentSemesterRegistration.findFirst({
      where: {
        semesterRegistration: {
          id: semesterRegistration?.id,
        },
        student: {
          studentId: authUserId,
        },
      },
      include: {
        student: true,
      },
    });

  return { semesterRegistration, studentSemesterRegistration };
};

const startNewSemester = async (id: string): Promise<{ message: string }> => {
  const semesterRegistration = await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
    include: {
      academicSemester: true,
    },
  });

  //if semesterRegistration not found throw error
  if (!semesterRegistration) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Semester registration not found'
    );
  }

  //if semesterRegistration has not ENDED throw error
  if (semesterRegistration.status !== SemesterRegistrationStatus.ENDED) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Semester registration has not ended yet'
    );
  }

  //if academicSemester has current (started) throw error
  if (semesterRegistration.academicSemester.isCurrent) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Semester has already started');
  }

  //implement update such that when a semester is turned true, other semesters are false
  //turn those semesters false that are previously true
  await prisma.$transaction(async currentTransactionClient => {
    await currentTransactionClient.academicSemester.updateMany({
      where: {
        isCurrent: true,
      },
      data: {
        isCurrent: false,
      },
    });

    await currentTransactionClient.academicSemester.update({
      where: {
        id: semesterRegistration.academicSemester.id,
      },
      data: {
        isCurrent: true,
      },
    });

    //this will return an array of students of those who have confirmed their registration
    const studentSemesterRegistrations =
      await prisma.studentSemesterRegistration.findMany({
        where: {
          semesterRegistration: {
            id,
          },
          isConfirmed: true,
        },
      });

    asyncForEach(
      studentSemesterRegistrations,
      async (studentSemReg: StudentSemesterRegistration) => {
        if (studentSemReg.totalCreditsTaken) {
          const totalPaymentAmount = studentSemReg.totalCreditsTaken * 5000;

          await StudentSemesterPaymentService.createSemesterPayment(
            currentTransactionClient,
            {
              studentId: studentSemReg.studentId,
              academicSemesterId: semesterRegistration.academicSemesterId,
              totalPaymentAmount,
            }
          );
        }

        const studentSemRegCourses =
          await currentTransactionClient.studentSemesterRegistrationCourse.findMany(
            {
              where: {
                semesterRegistration: { id },
                student: { id: studentSemReg.studentId },
              },
              include: {
                offeredCourse: {
                  include: {
                    course: true,
                  },
                },
              },
            }
          );

        asyncForEach(
          studentSemRegCourses,
          async (
            item: StudentSemesterRegistrationCourse & {
              offeredCourse: OfferedCourse & {
                course: Course;
              };
            }
          ) => {
            const isExistEnrolledData =
              await currentTransactionClient.studentEnrolledCourse.findFirst({
                where: {
                  studentId: item.studentId,
                  courseId: item.offeredCourse.courseId,
                  academicSemesterId: semesterRegistration.academicSemesterId,
                },
              });

            if (!isExistEnrolledData) {
              const enrolledCourseData = {
                studentId: item.studentId,
                courseId: item.offeredCourse.courseId,
                academicSemesterId: semesterRegistration.academicSemesterId,
              };

              const studentEnrolledCourseData =
                await currentTransactionClient.studentEnrolledCourse.create({
                  data: enrolledCourseData,
                });

              await StudentEnrolledCourseMarksService.createStudentEnrolledCourseDefaultMarks(
                currentTransactionClient,
                {
                  studentId: item.studentId,
                  studentEnrolledCourseId: studentEnrolledCourseData.id,
                  academicSemesterId: semesterRegistration.academicSemesterId,
                }
              );
            }
          }
        );
      }
    );

    //all these gotten data will store in studentEnrolledCourse table
  });

  return {
    message: 'Semester started successfully',
  };
};

const getMySemesterRegistrationCourses = async (authUserId: string) => {
  //check if student is available
  const student = await prisma.student.findFirst({
    where: {
      studentId: authUserId,
    },
  });

  //check if any semesterRegistration is ONGOING or UPCOMING
  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: {
        in: [
          SemesterRegistrationStatus.UPCOMING,
          SemesterRegistrationStatus.ONGOING,
        ],
      },
    },
    include: {
      academicSemester: true,
    },
  });

  if (!semesterRegistration) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'No semester registration is currently running'
    );
  }

  //get the courses student has COMPLETED
  const studentCompletedCourse = await prisma.studentEnrolledCourse.findMany({
    where: {
      status: StudentEnrolledCourseStatus.COMPLETED,
      student: {
        id: student?.id,
      },
    },
    include: {
      course: true,
    },
  });

  //get the courses student has taken this semester and are currently ONGOING
  const studentCurrentSemesterTakenCourse =
    await prisma.studentSemesterRegistrationCourse.findMany({
      where: {
        student: {
          id: student?.id,
        },
        semesterRegistration: {
          id: semesterRegistration?.id,
        },
      },
      include: {
        offeredCourse: true,
        offeredCourseSection: true,
      },
    });

  //get the courses that are offered by the university this semester
  const offeredCourse = await prisma.offeredCourse.findMany({
    where: {
      semesterRegistration: {
        id: semesterRegistration.id,
      },
      academicDepartment: {
        id: student?.academicDepartmentId,
      },
    },
    include: {
      course: {
        include: {
          preRequisite: {
            include: {
              preRequisite: true,
            },
          },
        },
      },
      offeredCourseSections: {
        include: {
          offeredCourseClassSchedules: {
            include: {
              room: {
                include: {
                  building: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const availableCourses = SemesterRegistrationUtils.getAvailableCourses(
    studentCompletedCourse,
    studentCurrentSemesterTakenCourse,
    offeredCourse
  );
  return availableCourses;
};

export const SemesterRegistrationService = {
  createSemesterRegistration,
  getAllSemesterRegistration,
  getSingleSemesterRegistration,
  updateSemesterRegistration,
  deleteSemesterRegistration,
  startMyRegistration,
  enrollIntoCourse,
  withdrawFromCourse,
  confirmMyRegistration,
  getMyRegistration,
  startNewSemester,
  getMySemesterRegistrationCourses,
};
