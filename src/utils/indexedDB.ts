// src/utils/indexedDB.ts

const DB_NAME = 'AssetManagementDB';
const DB_VERSION = 8;

let db: IDBDatabase;

// This function initializes the database and its object stores
export const initDB = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            console.error('Error opening IndexedDB');
            reject(false);
        };

        request.onsuccess = () => {
            db = request.result;
            resolve(true);
        };

        // This runs if the DB version changes, or if it's the first time running
        request.onupgradeneeded = () => {
            const dbInstance = request.result;
            const transaction = request.transaction;

            // Offices 
            if (!dbInstance.objectStoreNames.contains('offices')) {
                dbInstance.createObjectStore('offices', { keyPath: 'officeID', autoIncrement: true });
            }
            // Employees
            if (!dbInstance.objectStoreNames.contains('employees')) {
                dbInstance.createObjectStore('employees', { keyPath: 'employeeID', autoIncrement: true });
            }
            // AssetCatalog (The "Blueprints")
            if (!dbInstance.objectStoreNames.contains('assetCatalog')) {
                dbInstance.createObjectStore('assetCatalog', { keyPath: 'catalogID', autoIncrement: true });
            }
            // AssetInstances (The physical, serialized items)
            // if (!dbInstance.objectStoreNames.contains('assetInstances')) {
            //     const instanceStore = dbInstance.createObjectStore('assetInstances', { keyPath: 'instanceID', autoIncrement: true });
            //     // Add indexes for easier lookups
            //     instanceStore.createIndex('catalogID_idx', 'catalogID', { unique: false });
            //     instanceStore.createIndex('propertyCode_idx', 'propertyCode', { unique: true });
            // }
            // Stock (For bulk supplies)
            if (!dbInstance.objectStoreNames.contains('stock')) {
                const stockStore = dbInstance.createObjectStore('stock', { keyPath: 'stockID', autoIncrement: true });
                stockStore.createIndex('catalogID_officeID_idx', ['catalogID', 'officeID'], { unique: true });
            }
            // AssetTransactions (The history log)
            if (!dbInstance.objectStoreNames.contains('assetTransactions')) {
                const transactionStore = dbInstance.createObjectStore('assetTransactions', { keyPath: 'transactionID', autoIncrement: true });
                transactionStore.createIndex('instanceID_idx', 'instanceID', { unique: false });
            }
            // ReceivingVouchers (For equipment receipts)
            if (!dbInstance.objectStoreNames.contains('receivingVouchers')) {
                dbInstance.createObjectStore('receivingVouchers', { keyPath: 'voucherID', autoIncrement: true });
            }
            // assetInstances index update for receivingVoucherID
            if (dbInstance.objectStoreNames.contains('assetInstances')) {
                const instanceStore = transaction!.objectStore('assetInstances');
                // Add a new index to find assets by their receiving voucher
                if (!instanceStore.indexNames.contains('receivingVoucherID_idx')) {
                    instanceStore.createIndex('receivingVoucherID_idx', 'receivingVoucherID', { unique: false });
                }
            }
            // StockTransactions (For stock adjustments and history)
            if (!dbInstance.objectStoreNames.contains('stockTransactions')) {
                const stockTxStore = dbInstance.createObjectStore('stockTransactions', { keyPath: 'transactionID', autoIncrement: true });
                // Index to easily find all transactions for a specific stock item
                stockTxStore.createIndex('stockID_idx', 'stockID', { unique: false });
            }
        };
    });
};

// Generic function to add data to a store
export const addData = <T>(storeName: string, data: T): Promise<number> => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.add(data);

        request.onsuccess = () => resolve(request.result as number);
        request.onerror = () => reject(request.error);
    });
};

// Generic function to get all data from a store
export const getAllData = <T>(storeName: string): Promise<T[]> => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result as T[]);
        request.onerror = () => reject(request.error);
    });
};

// Generic function to update an item in a store
export const updateData = <T>(storeName: string, data: T): Promise<T> => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(data);

        request.onsuccess = () => resolve(request.result as T);
        request.onerror = () => reject(request.error);
    });
};

// Generic function to delete an item from a store by its key
export const deleteData = (storeName: string, key: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(key);

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
};

export const getDataByKey = <T>(storeName: string, key: number): Promise<T | undefined> => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);

        request.onsuccess = () => resolve(request.result as T | undefined);
        request.onerror = () => reject(request.error);
    });
};

export const getAllDataByIndex = <T>(storeName: string, indexName: string, query: any): Promise<T[]> => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const index = store.index(indexName);
        const request = index.getAll(query);

        request.onsuccess = () => resolve(request.result as T[]);
        request.onerror = () => reject(request.error);
    });
};