import { z } from 'zod';

const createZodBuilding = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
  }),
});

const updateZodBuilding = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
  }),
});

export const BuildingValidation = {
  createZodBuilding,
  updateZodBuilding,
};
