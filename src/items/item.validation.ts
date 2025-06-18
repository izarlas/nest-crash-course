import { z } from "zod";

export const itemValidationSchema = z
  .object({
    name: z.string(),
    quantity: z.number(),
    description: z.string(),
  })
  .required();

export type ItemValidationDto = z.infer<typeof itemValidationSchema>;
