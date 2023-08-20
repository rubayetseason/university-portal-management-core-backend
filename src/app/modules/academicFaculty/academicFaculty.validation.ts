import { z } from 'zod';

const createZodAcademicFaculty = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
  }),
});

const updateZodAcademicFaculty = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
  }),
});

export const AcademicFacultyValidation = {
  createZodAcademicFaculty,
  updateZodAcademicFaculty,
};
