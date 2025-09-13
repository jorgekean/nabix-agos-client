import { z } from 'zod';

export const stockAdjustSchema = z.object({
    stockID: z.coerce.number().min(1, "You must select a stock item."),

    action: z.enum([
        'Issued',
        'Written Off',
        'Count Correction - Increase',
        'Count Correction - Decrease'
    ], { message: "Please select an action." }),

    quantityChange: z.coerce.number().int().positive("Quantity must be a positive number."),

    notes: z.string().optional(),
});

export type StockAdjustFormData = z.infer<typeof stockAdjustSchema>;