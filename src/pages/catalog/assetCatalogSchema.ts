import { z } from 'zod';

export const assetCatalogSchema = z.object({
    name: z.string().min(3, "Asset name is required."),
    type: z.enum(['Equipment', 'Supply'], {
        // The property should be 'message' for a simple override.
        message: "Please select an asset type.",
    }),
    unitOfMeasurement: z.string().min(1, "UoM is required.").default('pcs'),
    sku: z.string().optional(),
    description: z.string().optional(),
});

export type AssetCatalogFormData = z.infer<typeof assetCatalogSchema>;