import { officeService, type Office } from '../pages/office/OfficeService';
import { getAllData } from '../utils/indexedDB';
import { assetCatalogService, type CatalogItem } from './assetCatalogService';


export interface Stock {
    stockID?: number;
    catalogID: number;
    officeID: number;
    quantityOnHand: number;
}

export interface DetailedStock extends Stock {
    catalogItem: CatalogItem;
    office: Office;
}

const STORE_NAME = 'stock';

export const stockService = {
    async getDetailedStockLevels(): Promise<DetailedStock[]> {
        const [stockLevels, catalog, offices] = await Promise.all([
            getAllData<Stock>(STORE_NAME),
            assetCatalogService.getCatalogItems(),
            officeService.getOffices(),
        ]);

        const catalogMap = new Map(catalog.map(i => [i.catalogID!, i]));
        const officeMap = new Map(offices.map(o => [o.officeID!, o]));

        // Filter out any stock records where the catalog item is not a 'Supply'
        return stockLevels
            .map(stock => ({
                ...stock,
                catalogItem: catalogMap.get(stock.catalogID)!,
                office: officeMap.get(stock.officeID)!,
            }))
            .filter(detailedStock => detailedStock.catalogItem?.type === 'Supply');
    },
    // We will add an 'addStock' function here later
};