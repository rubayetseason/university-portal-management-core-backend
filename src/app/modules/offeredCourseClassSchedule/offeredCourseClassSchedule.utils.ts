import { OfferedCourseClassSchedule } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { hasTimeConflict } from '../../../shared/timeConflict';

const checkRoomAvailable = async (data: OfferedCourseClassSchedule) => {
  //check from the sent req data, if that day, that room has any class or not from the offeredCourseClassSchedule table
  const alreadyBookedRoomOnDay =
    await prisma.offeredCourseClassSchedule.findMany({
      where: {
        dayOfWeek: data.dayOfWeek,
        room: {
          id: data.roomId,
        },
      },
    });

  //if doesn't exists, give empty array
  //if exists, give array of objects
  //but payload data and alreadyBookedRoomOnDay gives too much JSON which is not needed, need only startTime, endTime, dayOfWeek

  //so separate those data
  const classScheduleDataFromTable = alreadyBookedRoomOnDay.map(schedule => ({
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    dayOfWeek: schedule.dayOfWeek,
  }));
  //here will again get array of objects if classSchedule exists in db, but will get only the startTime, endTime, dayOfWeek

  const classScheduleDataFromPayload = {
    startTime: data.startTime,
    endTime: data.endTime,
    dayOfWeek: data.dayOfWeek,
  };

  //after separation
  if (
    hasTimeConflict(classScheduleDataFromTable, classScheduleDataFromPayload)
  ) {
    throw new ApiError(httpStatus.CONFLICT, 'Room is already booked');
  }
};

const checkFacultyAvailable = async (data: OfferedCourseClassSchedule) => {
  const alreadyFcultyAssigned =
    await prisma.offeredCourseClassSchedule.findMany({
      where: {
        dayOfWeek: data.dayOfWeek,
        faculty: {
          id: data.facultyId,
        },
      },
    });

  const facultyAssignDataFromTable = alreadyFcultyAssigned.map(schedule => ({
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    dayOfWeek: schedule.dayOfWeek,
  }));

  const facultyAssignDataFromPayload = {
    startTime: data.startTime,
    endTime: data.endTime,
    dayOfWeek: data.dayOfWeek,
  };

  if (
    hasTimeConflict(facultyAssignDataFromTable, facultyAssignDataFromPayload)
  ) {
    throw new ApiError(httpStatus.CONFLICT, 'Faculty is already booked');
  }
};

export const OfferedCourseClassScheduleUtils = {
  checkRoomAvailable,
  checkFacultyAvailable,
};
