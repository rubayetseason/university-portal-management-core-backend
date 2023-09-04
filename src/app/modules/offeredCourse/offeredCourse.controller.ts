import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { offeredCourseFilterableFields } from './offeredCourse.constants';
import { offeredCourseService } from './offeredCourse.services';

const createOfferedCourses = catchAsync(async (req: Request, res: Response) => {
  const result = await offeredCourseService.createOfferedCourses(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered course created successfully',
    data: result,
  });
});

const getAllOfferedCourses = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, offeredCourseFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await offeredCourseService.getAllOfferedCourses(
    filters,
    options
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered courses fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleOfferedCourses = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await offeredCourseService.getSingleOfferedCourses(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered dourse fetched successfully',
      data: result,
    });
  }
);

const updateOfferedCourses = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await offeredCourseService.updateOfferedCourses(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered course updated successfully',
    data: result,
  });
});

const deleteOfferedCourses = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await offeredCourseService.deleteOfferedCourses(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered course deleted successfully',
    data: result,
  });
});

export const OfferedCourseController = {
  createOfferedCourses,
  getAllOfferedCourses,
  getSingleOfferedCourses,
  updateOfferedCourses,
  deleteOfferedCourses,
};
