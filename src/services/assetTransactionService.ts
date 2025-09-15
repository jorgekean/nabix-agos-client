import { employeeService } from '../pages/employee/EmployeeService';
import { officeService } from '../pages/office/OfficeService';
import { addData, getAllData, getAllDataByIndex } from '../utils/indexedDB';

export interface AssetTransaction {
    transactionID?: number;
    instanceID: number;
    action: string; // Will now store the status directly
    officeID?: number;
    employeeID?: number | null;
    notes: string;
    timestamp: string;
}

export interface DetailedAssetTransaction extends AssetTransaction {
    officeName: string;
    employeeName: string | null;
}

const STORE_NAME = 'assetTransactions';

export const assetTransactionService = {
    async addTransaction(transaction: Omit<AssetTransaction, 'transactionID'>): Promise<AssetTransaction> {
        const newId = await addData(STORE_NAME, transaction);
        return { ...transaction, transactionID: newId };
    },

    async getTransactionsForInstance(instanceID: number): Promise<DetailedAssetTransaction[]> {
        const items = await getAllDataByIndex<DetailedAssetTransaction>(STORE_NAME, 'instanceID_idx', instanceID);
        console.log(items);
        return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    },

    // This is the function the history page MUST call
    async getDetailedTransactionsForInstance(instanceID: number): Promise<DetailedAssetTransaction[]> {
        // 1. Fetch all the data concurrently for efficiency
        const [transactions, offices, employees] = await Promise.all([
            getAllDataByIndex<AssetTransaction>(STORE_NAME, 'instanceID_idx', instanceID),
            officeService.getOffices(),
            employeeService.getEmployees()
        ]);

        // 2. Create maps for quick lookups
        const officeMap = new Map(offices.map(o => [o.officeID!, o.officeName]));
        const employeeMap = new Map(employees.map(e => [e.employeeID!, `${e.firstName} ${e.lastName}`]));

        // 3. Map over the raw transactions and enrich them with the names
        const detailed = transactions.map(tx => ({
            ...tx,
            officeName: officeMap.get(tx.officeID!) || 'Unknown Office',
            employeeName: tx.employeeID ? employeeMap.get(tx.employeeID) || 'Unknown Employee' : null,
        }));

        // 4. Sort and return the final, detailed list
        return detailed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    },

    async getRecentTransactions(limit = 5): Promise<AssetTransaction[]> {
        // In our mock setup, we fetch all transactions from the store.
        const allTransactions = await getAllData<AssetTransaction>(STORE_NAME);

        // Then, we sort them by date in descending order to find the most recent.
        const sorted = allTransactions.sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        // And finally, we return the top 'limit' number of transactions.
        return sorted.slice(0, limit);
    },

    async getDetailedTransactionsForInstance(instanceID: number): Promise<DetailedAssetTransaction[]> {
        const [transactions, offices, employees] = await Promise.all([
            getAllDataByIndex<AssetTransaction>(STORE_NAME, 'instanceID_idx', instanceID),
            officeService.getOffices(),
            employeeService.getEmployees()
        ]);

        const officeMap = new Map(offices.map(o => [o.officeID!, o.officeName]));
        const employeeMap = new Map(employees.map(e => [e.employeeID!, `${e.firstName} ${e.lastName}`]));

        const detailed = transactions.map(tx => ({
            ...tx,
            officeName: officeMap.get(tx.officeID!) || 'Unknown Office',
            employeeName: tx.employeeID ? employeeMap.get(tx.employeeID) || 'Unknown Employee' : null,
        }));

        return detailed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
};