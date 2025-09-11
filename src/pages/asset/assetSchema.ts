// src/pages/assets/assetSchema.ts
import { z } from 'zod';

export const assetSchema = z.object({
    propertyCode: z.string().min(3, "Property code is required."),
    name: z.string().min(3, "Asset name is required."),
    type: z.enum(['Equipment', 'Supply'], { required_error: "Please select an asset type." }),
    description: z.string().optional(),
    quantity: z.coerce.number().int().min(1, "Quantity must be at least 1."),
    unitOfMeasurement: z.string().optional(),
    status: z.enum(['In Storage', 'Issued', 'Disposed', 'Returned'], { required_error: "Please select a status." }),
    currentOfficeId: z.coerce.number({ required_error: "An office location is required." }).min(1, "An office location is required."),
    assignedToEmployeeId: z.string().optional().transform((val) => {
        if (!val) return null;
        const parsed = parseInt(val, 10);
        return isNaN(parsed) ? null : parsed;
    }),
    specificLocation: z.string().optional(),
});

export type AssetFormData = z.infer<typeof assetSchema>;