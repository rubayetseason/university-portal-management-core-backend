import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { offeredCourseClassScheduleFilterableFields } from './offeredCourseClassSchedule.constants';
import { OfferedCourseClassScheduleService } from './offeredCourseClassSchedule.services';

const createClassSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferedCourseClassScheduleService.createClassSchedule(
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Class schedule created successfully',
    data: result,
  });
});

const getAllClassSchedule = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, offeredCourseClassScheduleFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await OfferedCourseClassScheduleService.getAllClassSchedule(
    filters,
    options
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Class schedules fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleClassSchedule = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await OfferedCourseClassScheduleService.getSingleClassSchedule(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Class schedule fetched successfully',
      data: result,
    });
  }
);

const updateClassSchedule = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OfferedCourseClassScheduleService.updateClassSchedule(
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Class schedule updated successfully',
    data: result,
  });
});

const deleteClassSchedule = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OfferedCourseClassScheduleService.deleteClassSchedule(
    id
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Class schedule deleted successfully',
    data: result,
  });
});

export const OfferedCourseClassScheduleController = {
  createClassSchedule,
  getAllClassSchedule,
  getSingleClassSchedule,
  updateClassSchedule,
  deleteClassSchedule,
};
