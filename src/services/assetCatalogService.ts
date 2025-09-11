// src/services/assetCatalogService.ts
import { addData, getAllData, updateData, deleteData, getDataByKey } from '../utils/indexedDB';

export interface CatalogItem {
    catalogID?: number;
    name: string;
    type: 'Equipment' | 'Supply';
    description?: string;
    unitOfMeasurement: string;
    sku?: string;
}

const STORE_NAME = 'assetCatalog';

export const assetCatalogService = {
    async getCatalogItems(): Promise<CatalogItem[]> {
        return getAllData<CatalogItem>(STORE_NAME);
    },
    async getCatalogItemById(id: number): Promise<CatalogItem | undefined> {
        return getDataByKey<CatalogItem>(STORE_NAME, id);
    },
    async addCatalogItem(item: Omit<CatalogItem, 'catalogID'>): Promise<CatalogItem> {
        const newId = await addData(STORE_NAME, item);
        return { ...item, catalogID: newId };
    },
    async updateCatalogItem(item: CatalogItem): Promise<CatalogItem> {
        return updateData<CatalogItem>(STORE_NAME, item);
    },
    async deleteCatalogItem(id: number): Promise<boolean> {
        // Note: In a real app, you'd check if any instances are using this catalog item first.
        return deleteData(STORE_NAME, id);
    },
};