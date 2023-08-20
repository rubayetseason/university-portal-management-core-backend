import { z } from 'zod';

const createZodDepartment = z.object({
    body: z.object({
        title: z.string({
            required_error: 'Title is required'
        }),
        academicFacultyId: z.string({
            required_error: 'Academic faculty id is required'
        })
    })
});

const updateZodDepartment = z.object({
    body: z.object({
        title: z.string().optional(),
        academicFacultyId: z.string().optional()
    })
});

export const AcademicDepartmentValidation = {
    createZodDepartment,
    updateZodDepartment
};