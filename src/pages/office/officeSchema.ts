import { z } from 'zod';

// This schema defines the validation rules for the office form.
export const officeSchema = z.object({
    officeName: z.string().min(3, { message: "Office name must be at least 3 characters long." }).max(100),
    address: z.string().max(255).optional().nullable(), // Address is optional
});

// We can infer the TypeScript type directly from the schema.
export type OfficeFormData = z.infer<typeof officeSchema>;