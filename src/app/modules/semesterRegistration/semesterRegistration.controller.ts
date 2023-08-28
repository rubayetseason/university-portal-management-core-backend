import { Request,Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { SemesterRegistrationService } from "./semesterRegistration.services";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import { semesterRegistrationFilterableFields } from "./semesterRegistration.constants";

const createSemesterRegistration = catchAsync(async (req: Request, res: Response) => {
    const result = await SemesterRegistrationService.createSemesterRegistration(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Semester Registration created",
        data: result
    })
})

const getAllSemesterRegistration = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, semesterRegistrationFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await SemesterRegistrationService.getAllSemesterRegistration(filters, options);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'SemesterRegistrations fetched successfully',
        meta: result.meta,
        data: result.data
    });
})

const getSingleSemesterRegistration = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await SemesterRegistrationService.getSingleSemesterRegistration(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'SemesterRegistration fetched successfully',
        data: result
    });
})

const updateSemesterRegistration = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await SemesterRegistrationService.updateSemesterRegistration(id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'SemesterRegistration updated successfully',
        data: result
    });
})


const deleteSemesterRegistration = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await SemesterRegistrationService.deleteSemesterRegistration(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'SemesterRegistration deleted successfully',
        data: result
    });
})

export const SemesterRegistrationController = {
    createSemesterRegistration,
    getAllSemesterRegistration,
    getSingleSemesterRegistration,
    updateSemesterRegistration,
    deleteSemesterRegistration
}