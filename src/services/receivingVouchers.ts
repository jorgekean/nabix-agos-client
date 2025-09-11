import { addData, getAllData, getDataByKey, updateData } from '../utils/indexedDB';
import { employeeService, type Employee } from '../pages/employee/EmployeeService';

export interface ReceivingVoucher {
    voucherID?: number;
    supplier?: string;
    referenceNumber?: string;
    dateReceived: string;
    receivedByEmployeeId?: number | null;
    notes?: string;
}

export interface DetailedReceivingVoucher extends ReceivingVoucher {
    receivedByEmployeeName: string | null;
}

const STORE_NAME = 'receivingVouchers';

export const receivingVoucherService = {
    async getDetailedVouchers(): Promise<DetailedReceivingVoucher[]> {
        const [vouchers, employees] = await Promise.all([
            getAllData<ReceivingVoucher>(STORE_NAME),
            employeeService.getEmployees()
        ]);

        const employeeMap = new Map<number, string>(employees.map(e => [e.employeeID!, `${e.firstName} ${e.lastName}`]));

        return vouchers.map(v => ({
            ...v,
            receivedByEmployeeName: v.receivedByEmployeeId ? employeeMap.get(v.receivedByEmployeeId) || 'Unknown' : 'N/A',
        }));
    },

    async getVoucherById(id: number): Promise<ReceivingVoucher | undefined> {
        return getDataByKey<ReceivingVoucher>(STORE_NAME, id);
    },

    async addVoucher(voucher: Omit<ReceivingVoucher, 'voucherID'>): Promise<ReceivingVoucher> {
        const newId = await addData(STORE_NAME, voucher);
        return { ...voucher, voucherID: newId };
    },

    async updateVoucher(voucher: ReceivingVoucher): Promise<ReceivingVoucher> {
        return updateData<ReceivingVoucher>(STORE_NAME, voucher);
    }
};