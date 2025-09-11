import { addData, getAllDataByIndex } from "../../utils/indexedDB";


export interface HistoryEntry {
    historyID?: number;
    assetID: number;
    action: 'Created' | 'Updated' | 'Issued' | 'Returned' | 'Disposed' | 'Transferred';
    timestamp: string;
    notes: string;
}

const STORE_NAME = 'assetHistory';

export const historyService = {
    async addHistoryEntry(entry: Omit<HistoryEntry, 'historyID'>): Promise<HistoryEntry> {
        const newId = await addData(STORE_NAME, entry);
        return { ...entry, historyID: newId };
    },

    async getHistoryForAsset(assetID: number): Promise<HistoryEntry[]> {
        // We get the items and then sort them client-side by timestamp descending
        const items = await getAllDataByIndex<HistoryEntry>(STORE_NAME, 'assetID_idx', assetID);
        return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
};