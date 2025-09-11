import { z } from 'zod';

export const voucherEditSchema = z.object({
    receivedByEmployeeId: z.string().optional().transform((val) => {
        if (!val) return null;
        const parsed = parseInt(val, 10);
        return isNaN(parsed) ? null : parsed;
    }),
    supplier: z.string().optional(),
    referenceNumber: z.string().optional(),
    notes: z.string().optional(),
    // We only validate the editable fields. Date, items, etc., are immutable.
});

export type VoucherEditFormData = z.infer<typeof voucherEditSchema>;