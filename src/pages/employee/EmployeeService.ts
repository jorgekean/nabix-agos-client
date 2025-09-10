// src/services/employeeMockService.ts
import { addData, getAllData, updateData, deleteData, getDataByKey } from '../../utils/indexedDB';
import { officeService, type Office } from '../office/OfficeService';

// Base Employee type from our schema
export interface Employee {
    employeeID?: number;
    firstName: string;
    lastName: string;
    email: string;
    currentOfficeId: number | null;
}

// A richer type for display purposes, including the office name
export interface EmployeeWithOffice extends Employee {
    officeName: string | null;
}

const STORE_NAME = 'employees';
const networkDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const employeeService = {
    // GET all employees, enriched with their office name
    async getEmployees(): Promise<EmployeeWithOffice[]> {
        await networkDelay(300);
        const [employees, offices] = await Promise.all([
            getAllData<Employee>(STORE_NAME),
            officeService.getOffices()
        ]);

        const officeMap = new Map<number, string>(offices.map(o => [o.officeID!, o.officeName]));

        return employees.map(emp => ({
            ...emp,
            officeName: emp.currentOfficeId ? officeMap.get(emp.currentOfficeId) || 'Unknown Office' : 'N/A',
        }));
    },

    // GET a single employee by ID
    async getEmployeeById(id: number): Promise<Employee | undefined> {
        await networkDelay(300);
        return getDataByKey<Employee>(STORE_NAME, id);
    },

    // CREATE a new employee
    async addEmployee(employee: Omit<Employee, 'employeeID'>): Promise<Employee> {
        await networkDelay(300);
        const newId = await addData(STORE_NAME, employee);
        return { ...employee, employeeID: newId };
    },

    // UPDATE an existing employee
    async updateEmployee(employee: Employee): Promise<Employee> {
        await networkDelay(300);
        return updateData<Employee>(STORE_NAME, employee);
    },

    // DELETE an employee
    async deleteEmployee(employeeID: number): Promise<boolean> {
        await networkDelay(300);
        return deleteData(STORE_NAME, employeeID);
    },
};