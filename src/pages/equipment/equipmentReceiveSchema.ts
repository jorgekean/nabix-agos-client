import { z } from 'zod';

// Schema for a single new instance
const instanceSchema = z.object({
    propertyCode: z.string().min(1, "Property Code is required."),
    serialNumber: z.string().optional(),
});

// The main schema for the entire receiving form
export const equipmentReceiveSchema = z.object({
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

    // Shared Instance Details
    catalogID: z.coerce.number().min(1, "Please select an asset type from the catalog."),
    currentOfficeId: z.coerce.number().min(1, "Please select an office location."),
    status: z.string().min(1, "Status is required."),

    // Array of new instances to be created
    instances: z.array(instanceSchema).min(1, "You must add at least one piece of equipment."),
});

export type EquipmentReceiveFormData = z.infer<typeof equipmentReceiveSchema>;