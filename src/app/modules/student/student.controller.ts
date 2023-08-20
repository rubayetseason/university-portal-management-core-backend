import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { studentFilterableFields } from './student.constants';
import { StudentService } from './student.services';

const createStudent = catchAsync(async (req: Request, res: Response) => {
    const result = await StudentService.createStudent(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student created successfully',
        data: result
    });
});

const getAllStudents = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, studentFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await StudentService.getAllStudents(filters, options);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Students fetched successfully',
        meta: result.meta,
        data: result.data
    });
});

const getSingleStudent= catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await StudentService.getSingleStudent(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student fetched successfully',
        data: result
    });
});


export const StudentController = {
    createStudent,
    getAllStudents,
    getSingleStudent
};