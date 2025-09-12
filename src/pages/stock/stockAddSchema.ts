import { z } from 'zod';

export const stockAddSchema = z.object({
    // Voucher Details
    supplier: z.string().optional(),
    referenceNumber: z.string().optional(),
    dateReceived: z.string().min(1, "Date is required."),
    receivedByEmployeeId: z.string().optional().transform((val) => {
        if (!val) return null;
        const parsed = parseInt(val, 10);
        return isNaN(parsed) ? null : parsed;
    }),
    notes: z.string().optional(),

    // Stock Details
    catalogID: z.coerce.number().min(1, "Please select a supply item."),
    officeID: z.coerce.number().min(1, "Please select an office location."),
    quantityToAdd: z.coerce.number().int().min(1, "Quantity must be at least 1."),
});

export type StockAddFormData = z.infer<typeof stockAddSchema>;