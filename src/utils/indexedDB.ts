// src/utils/indexedDB.ts

const DB_NAME = 'AssetManagementDB';
const DB_VERSION = 3;

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
            // Create the 'offices' object store if it doesn't exist
            if (!dbInstance.objectStoreNames.contains('offices')) {
                // Use 'officeID' as the key and enable auto-increment
                dbInstance.createObjectStore('offices', { keyPath: 'officeID', autoIncrement: true });
            }

            // Create the 'employees' object store if it doesn't exist
            if (!dbInstance.objectStoreNames.contains('employees')) {
                dbInstance.createObjectStore('employees', { keyPath: 'employeeID', autoIncrement: true });
            }

            if (!dbInstance.objectStoreNames.contains('assets')) {
                dbInstance.createObjectStore('assets', { keyPath: 'assetID', autoIncrement: true });
            }
            // Future object stores (e.g., 'employees', 'assets') can be added here
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