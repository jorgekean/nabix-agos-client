// src/services/assetInstanceService.ts
import { employeeService, type Employee } from '../pages/employee/EmployeeService';
import { officeService, type Office } from '../pages/office/OfficeService';
import { addData, getAllData, updateData, deleteData, getDataByKey } from '../utils/indexedDB';
import { assetCatalogService, type CatalogItem } from './assetCatalogService';
import { assetTransactionService, type AssetTransaction } from './assetTransactionService';

export interface AssetInstance {
    instanceID?: number;
    catalogID: number;
    propertyCode: string;
    serialNumber?: string;
    status: 'In Storage' | 'Transferred' | 'Issued' | 'Returned' | 'Disposed';
    currentOfficeId: number;
    assignedToEmployeeId: number | null;
    specificLocation?: string;
    receivingVoucherID: number | null;
}

export interface AssetInstanceDetails extends AssetInstance {
    catalogItem: CatalogItem;
    office: Office;
    employee: Employee | null;
}

const STORE_NAME = 'assetInstances';

export const equipmentService = {
    async getDetailedInstances(): Promise<AssetInstanceDetails[]> {
        const [instances, catalog, offices, employees] = await Promise.all([
            getAllData<AssetInstance>(STORE_NAME),
            assetCatalogService.getCatalogItems(),
            officeService.getOffices(),
            employeeService.getEmployees(),
        ]);

        const catalogMap = new Map(catalog.map(i => [i.catalogID!, i]));
        const officeMap = new Map(offices.map(o => [o.officeID!, o]));
        const employeeMap = new Map(employees.map(e => [e.employeeID!, e]));

        return instances.map(inst => ({
            ...inst,
            catalogItem: catalogMap.get(inst.catalogID)!,
            office: officeMap.get(inst.currentOfficeId)!,
            employee: inst.assignedToEmployeeId ? employeeMap.get(inst.assignedToEmployeeId) || null : null,
        }));
    },

    async getInstanceById(id: number): Promise<AssetInstance | undefined> {
        return getDataByKey<AssetInstance>(STORE_NAME, id);
    },

    async addInstance(instance: Omit<AssetInstance, 'instanceID'>): Promise<AssetInstance> {
        const newId = await addData(STORE_NAME, instance);
        const newInstance = { ...instance, instanceID: newId };

        // Log the new, detailed transaction
        await assetTransactionService.addTransaction({
            instanceID: newId,
            action: instance.status, // The action is the initial status
            officeID: instance.currentOfficeId,
            employeeID: instance.assignedToEmployeeId,
            notes: `Asset instance created with property code ${instance.propertyCode}.`,
            timestamp: new Date().toISOString(),
        });

        return newInstance;
    },

    async updateInstance(instance: AssetInstance): Promise<AssetInstance> {
        const oldInstance = await this.getInstanceById(instance.instanceID!);
        if (!oldInstance) throw new Error("Instance not found");

        const changes = [];
        if (oldInstance.status !== instance.status) {
            changes.push(`Status changed from "${oldInstance.status}" to "${instance.status}".`);
        }
        if (oldInstance.assignedToEmployeeId !== instance.assignedToEmployeeId) {
            changes.push(`Assignment updated.`);
        }
        if (oldInstance.currentOfficeId !== instance.currentOfficeId) {
            changes.push(`Office location updated.`);
        }

        // Log the new, detailed transaction if anything changed
        if (changes.length > 0) {
            await assetTransactionService.addTransaction({
                instanceID: instance.instanceID!,
                action: instance.status, // The action is the new status
                officeID: instance.currentOfficeId,
                employeeID: instance.assignedToEmployeeId,
                notes: changes.join(' '),
                timestamp: new Date().toISOString(),
            });
        }
        return updateData<AssetInstance>(STORE_NAME, instance);
    },

    async deleteInstance(id: number): Promise<boolean> {
        await assetTransactionService.addTransaction({
            instanceID: id,
            action: 'Deleted',
            notes: 'Asset instance record was deleted from the system.',
            timestamp: new Date().toISOString(),
        });
        return deleteData(STORE_NAME, id);
    }
};