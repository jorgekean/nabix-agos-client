// src/services/officeMockService.ts
import { addData, getAllData, updateData, deleteData, getDataByKey } from '../../utils/indexedDB';

// Define the Office type based on the schema
export interface Office {
    officeID?: number; // Optional because it's auto-generated on creation
    officeName: string;
    address?: string | null;
}

const STORE_NAME = 'offices';

// Simulate network delay for a more realistic feel
const networkDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const officeService = {
    // GET all offices
    async getOffices(): Promise<Office[]> {
        await networkDelay(300); // Simulate API latency
        return getAllData<Office>(STORE_NAME);
    },

    // CREATE a new office
    async addOffice(office: Omit<Office, 'officeID'>): Promise<Office> {
        await networkDelay(300);
        const newId = await addData(STORE_NAME, office);
        return { ...office, officeID: newId };
    },

    // UPDATE an existing office
    async updateOffice(office: Office): Promise<Office> {
        await networkDelay(300);
        return updateData<Office>(STORE_NAME, office);
    },

    // DELETE an office
    async deleteOffice(officeID: number): Promise<boolean> {
        await networkDelay(300);
        return deleteData(STORE_NAME, officeID);
    },

    async getOfficeById(id: number): Promise<Office | undefined> {
        await networkDelay(300);
        return getDataByKey<Office>(STORE_NAME, id);
    },
};