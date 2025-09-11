import { addData, getAllDataByIndex } from '../utils/indexedDB';

export interface AssetTransaction {
    transactionID?: number;
    instanceID: number;
    action: 'Received' | 'Updated' | 'Issued' | 'Returned' | 'Disposed' | 'Transferred' | 'Deleted';
    notes: string;
    timestamp: string;
}

const STORE_NAME = 'assetTransactions';

export const assetTransactionService = {
    async addTransaction(transaction: Omit<AssetTransaction, 'transactionID'>): Promise<AssetTransaction> {
        const newId = await addData(STORE_NAME, transaction);
        return { ...transaction, transactionID: newId };
    },

    async getTransactionsForInstance(instanceID: number): Promise<AssetTransaction[]> {
        const items = await getAllDataByIndex<AssetTransaction>(STORE_NAME, 'instanceID_idx', instanceID);
        return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
};