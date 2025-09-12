import { z } from 'zod';

export const equipmentEditSchema = z.object({
    status: z.enum(['In Storage', 'Issued', 'Transferred', 'Returned', 'Disposed'], {
        message: "Please select a status."
    }),
    currentOfficeId: z.coerce.number().min(1, "An office location is required."),
    assignedToEmployeeId: z.string().optional().transform((val) => {
        if (!val) return null;
        const parsed = parseInt(val, 10);
        return isNaN(parsed) ? null : parsed;
    }),
    specificLocation: z.string().optional(),
});

export type EquipmentEditFormData = z.infer<typeof equipmentEditSchema>;