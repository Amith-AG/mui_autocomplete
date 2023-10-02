import * as z from "zod";

const fclSchema = z.object({
 hsn:z.object({description:z.string(),hsCode:z.string()}),
  modes: z.literal("FCL"),
  f_quantity: z.coerce.number().min(1).max(32767),
  f_weight: z.coerce.number().min(1).max(32767),
  comment: z.string().min(3).max(160).optional(),
});

const lclSchema = z.object({
  hsn:z.object({description:z.string(),hsCode:z.string()}),
  modes: z.literal("LCL"),
  l_container_type: z.enum(["pallete", "boxes", "package", "bag"]),
  l_loading: z.string().min(1),
  comment: z.string().min(3).max(160),
});

const bulkSchema = z.object({
  hsn:z.object({description:z.string(),hsCode:z.string()}),
  modes: z.literal("BULK"),
  b_loading_rate: z.coerce.number().min(1),
  b_discharge_rate: z.coerce.number().min(1),
  comment: z.string().min(3).max(160),
});

export const FormSchema = z.discriminatedUnion("modes", [
  fclSchema,
  lclSchema,
  bulkSchema,
]);


