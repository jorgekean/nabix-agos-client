// src/pages/employees/employeeSchema.ts
import { z } from 'zod';

export const employeeSchema = z.object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters." }).max(100),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }).max(100),
    email: z.string().email({ message: "Please enter a valid email address." }),
    currentOfficeId: z.coerce.number().nullable(), // Coerce input to number, allows null
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;