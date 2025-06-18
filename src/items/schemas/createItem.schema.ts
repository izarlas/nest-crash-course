import { z } from "zod";

export const createItemSchema = z
  .object({
    name: z.string(),
    quantity: z.number(),
    description: z.string(),
  })
  .required();

export type CreateItemDto = z.infer<typeof createItemSchema>;
