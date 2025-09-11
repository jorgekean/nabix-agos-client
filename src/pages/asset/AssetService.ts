// src/services/assetMockService.ts
import { addData, getAllData, updateData, deleteData, getDataByKey } from '../../utils/indexedDB';
import { officeService } from '../office/OfficeService';
import { employeeService } from '../employee/EmployeeService';

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
        const newId = await addData(STORE_NAME, asset);
        return { ...asset, assetID: newId };
    },

    async updateAsset(asset: Asset): Promise<Asset> {
        return updateData<Asset>(STORE_NAME, asset);
    },

    async deleteAsset(assetID: number): Promise<boolean> {
        return deleteData(STORE_NAME, assetID);
    },
};