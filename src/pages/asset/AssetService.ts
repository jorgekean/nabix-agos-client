// src/services/assetMockService.ts
import { addData, getAllData, updateData, deleteData, getDataByKey } from '../../utils/indexedDB';
import { officeService } from '../office/OfficeService';
import { employeeService } from '../employee/EmployeeService';
import { historyService } from './HistoryService';

export interface Asset {
    assetID?: number;
    propertyCode: string;
    name: string;
    type: 'Equipment' | 'Supply';
    description?: string;
    quantity: number;
    unitOfMeasurement?: string;
    status: 'In Storage' | 'Issued' | 'Disposed' | 'Returned';
    currentOfficeId: number;
    assignedToEmployeeId: number | null;
    specificLocation?: string;
}

// A richer type for display purposes
export interface AssetWithDetails extends Asset {
    officeName: string;
    assignedToEmployeeName: string | null;
}

const STORE_NAME = 'assets';
const networkDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const assetService = {
    async getAssets(): Promise<AssetWithDetails[]> {
        await networkDelay(300);
        const [assets, offices, employees] = await Promise.all([
            getAllData<Asset>(STORE_NAME),
            officeService.getOffices(),
            employeeService.getEmployees(),
        ]);

        const officeMap = new Map(offices.map(o => [o.officeID!, o.officeName]));
        const employeeMap = new Map(employees.map(e => [e.employeeID!, `${e.firstName} ${e.lastName}`]));

        return assets.map(asset => ({
            ...asset,
            officeName: officeMap.get(asset.currentOfficeId) || 'Unknown Office',
            assignedToEmployeeName: asset.assignedToEmployeeId ? employeeMap.get(asset.assignedToEmployeeId) || 'Unknown Employee' : 'N/A',
        }));
    },

    async getAssetById(id: number): Promise<Asset | undefined> {
        return getDataByKey<Asset>(STORE_NAME, id);
    },

    async addAsset(asset: Omit<Asset, 'assetID'>): Promise<Asset> {
        // 1. Correctly get the new ID (a number) from addData.
        const newId = await addData(STORE_NAME, asset);

        // 2. Use the newId to log the history entry.
        await historyService.addHistoryEntry({
            assetID: newId,
            action: 'Created',
            timestamp: new Date().toISOString(),
            notes: 'Asset record created in the system.'
        });

        // 3. Return the complete asset object by combining the input data and the new ID.
        return { ...asset, assetID: newId };
    },

    async updateAsset(asset: Asset): Promise<Asset> {
        const oldAsset = await this.getAssetById(asset.assetID!);
        if (!oldAsset) throw new Error("Asset not found");

        // --- HISTORY LOGGING ---
        const changes = [];
        let action: 'Updated' | 'Issued' | 'Returned' | 'Disposed' | 'Transferred' = 'Updated';

        if (oldAsset.status !== asset.status) {
            changes.push(`Status changed from "${oldAsset.status}" to "${asset.status}".`);
            if (asset.status === 'Disposed') action = 'Disposed';
            if (asset.status === 'Issued') action = 'Issued';
        }
        if (oldAsset.assignedToEmployeeId !== asset.assignedToEmployeeId) {
            changes.push(`Assignment changed.`);
            if (oldAsset.assignedToEmployeeId && !asset.assignedToEmployeeId) action = 'Returned';
            else if (!oldAsset.assignedToEmployeeId && asset.assignedToEmployeeId) action = 'Issued';
            else action = 'Transferred';
        }
        if (oldAsset.currentOfficeId !== asset.currentOfficeId) {
            changes.push(`Office location changed.`);
            action = 'Transferred';
        }
        if (oldAsset.specificLocation !== asset.specificLocation) {
            changes.push(`Specific location updated to "${asset.specificLocation}".`);
        }

        if (changes.length > 0) {
            await historyService.addHistoryEntry({
                assetID: asset.assetID!,
                action: action,
                timestamp: new Date().toISOString(),
                notes: changes.join(' ')
            });
        }
        // -----------------------

        return updateData<Asset>(STORE_NAME, asset);
    },

    async deleteAsset(assetID: number): Promise<boolean> {
        return deleteData(STORE_NAME, assetID);
    },
};