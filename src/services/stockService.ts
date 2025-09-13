import { officeService, type Office } from '../pages/office/OfficeService';
import { addData, getAllData, getAllDataByIndex, getDataByKey, updateData } from '../utils/indexedDB';
import { assetCatalogService, type CatalogItem } from './assetCatalogService';


export interface Stock {
    stockID?: number;
    catalogID: number;
    officeID: number;
    quantityOnHand: number;
}

export interface StockTransaction {
    transactionID?: number;
    stockID: number;
    action: 'Stock Added' | 'Issued' | 'Count Correction - Increase' | 'Count Correction - Decrease' | 'Written Off';
    quantityChange: number;
    notes?: string;
    timestamp: string;
}

export interface DetailedStock extends Stock {
    catalogItem: CatalogItem;
    office: Office;
}

const STOCK_STORE_NAME = 'stock';
const TRANSACTION_STORE_NAME = 'stockTransactions';

export const stockService = {
    async getDetailedStockLevels(): Promise<DetailedStock[]> {
        const [stockLevels, catalog, offices] = await Promise.all([
            getAllData<Stock>(STOCK_STORE_NAME),
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


    async addStock(
        catalogID: number,
        officeID: number,
        quantityToAdd: number
    ): Promise<Stock> {
        const allStock = await getAllData<Stock>(STOCK_STORE_NAME);
        const existingStock = allStock.find(
            s => s.catalogID === catalogID && s.officeID === officeID
        );

        if (existingStock) {
            // If stock exists, update the quantity
            const updatedStock = {
                ...existingStock,
                quantityOnHand: existingStock.quantityOnHand + quantityToAdd,
            };
            return updateData<Stock>(STOCK_STORE_NAME, updatedStock);
        } else {
            // If stock doesn't exist, create a new record
            const newStock = {
                catalogID,
                officeID,
                quantityOnHand: quantityToAdd,
            };
            const newId = await addData(STOCK_STORE_NAME, newStock);
            return { ...newStock, stockID: newId };
        }
    },
    async adjustStockQuantity(
        stockID: number,
        action: StockTransaction['action'],
        quantityChange: number,
        notes?: string
    ): Promise<Stock> {
        const stockItem = await getDataByKey<Stock>(STOCK_STORE_NAME, stockID);
        if (!stockItem) {
            throw new Error("Stock item not found.");
        }

        let newQuantity = stockItem.quantityOnHand;

        // Calculate the new quantity based on the action
        if (action === 'Issued' || action === 'Count Correction - Decrease' || action === 'Written Off') {
            newQuantity -= quantityChange;
        } else {
            newQuantity += quantityChange;
        }

        // Crucial check to prevent negative stock
        if (newQuantity < 0) {
            throw new Error("Stock quantity cannot be negative.");
        }

        const updatedStockItem = { ...stockItem, quantityOnHand: newQuantity };

        // Create the transaction log entry
        const transaction: Omit<StockTransaction, 'transactionID'> = {
            stockID,
            action,
            quantityChange,
            notes,
            timestamp: new Date().toISOString(),
        };

        // Perform both database operations
        await Promise.all([
            updateData<Stock>(STOCK_STORE_NAME, updatedStockItem),
            addData(TRANSACTION_STORE_NAME, transaction)
        ]);

        return updatedStockItem;
    },
    async getTransactionsForStockItem(stockID: number): Promise<StockTransaction[]> {
        const items = await getAllDataByIndex<StockTransaction>(TRANSACTION_STORE_NAME, 'stockID_idx', stockID);
        // Sort with the most recent transaction first
        return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
};