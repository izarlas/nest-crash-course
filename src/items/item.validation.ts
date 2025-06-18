import { z } from "zod";

export const itemValidationSchema = z
  .object({
    name: z.string(),
    quantity: z.number(),
    description: z.string(),
  })
  .required();

export const partialItemValidationSchema = z
  .object({
    name: z.string(),
    quantity: z.number(),
    description: z.string(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type ItemValidationDto = z.infer<typeof itemValidationSchema>;

export type PartialItemValidationDto = z.infer<
  typeof partialItemValidationSchema
>;
