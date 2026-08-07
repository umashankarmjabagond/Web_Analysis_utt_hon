import { z } from "zod";

export const propertiesSchema = z.object({
  warningThreshold: z
    .string()
    .regex(/^\d{1,3}(\.\d{1,2})?$/, "Enter a valid percentage")
    .refine((value) => Number(value) >= 0 && Number(value) <= 100, {
      message: "Value must be between 0 and 100",
    }),

  abortThreshold: z
    .string()
    .regex(/^\d{1,3}(\.\d{1,2})?$/, "Enter a valid percentage")
    .refine((value) => Number(value) >= 0 && Number(value) <= 100, {
      message: "Value must be between 0 and 100",
    }),

  referenceColumn: z.string(),

  badDataExpression: z.string(),

  replacementExpression: z.string(),
});

export type PropertiesFormData = z.infer<typeof propertiesSchema>
