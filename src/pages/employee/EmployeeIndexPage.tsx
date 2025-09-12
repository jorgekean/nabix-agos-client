// src/pages/employees/EmployeeIndexPage.tsx
import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { DataTable, type Column } from '../../components/tables/DataTable';
import { employeeService, type EmployeeWithOffice } from '../employee/EmployeeService';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const employeeColumns: Column<EmployeeWithOffice>[] = [
    { Header: 'First Name', accessor: 'firstName' },
    { Header: 'Last Name', accessor: 'lastName' },
    { Header: 'Email', accessor: 'email' },
    { Header: 'Office', accessor: 'officeName' },
];

export const EmployeeIndexPage: React.FC = () => {
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchEmployees = useCallback(async (page: number, pageSize: number, searchTerm: string) => {
        const allEmployees = await employeeService.getEmployees();
        const filtered = allEmployees.filter(emp =>
            `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.officeName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const totalPages = Math.ceil(filtered.length / pageSize);
        const data = filtered.slice((page - 1) * pageSize, page * pageSize);
        return { data, totalPages };
    }, []);

    const handleDelete = async (employee: EmployeeWithOffice) => {
        if (window.confirm(`Delete ${employee.firstName} ${employee.lastName}?`)) {
            await employeeService.deleteEmployee(employee.employeeID!);
            setRefreshKey(prev => prev + 1);
        }
    };

    const renderActions = useCallback((employee: EmployeeWithOffice) => (
        <div className="flex justify-end space-x-2">
            <Link to={`/employees/edit/${employee.employeeID}`}
                className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-full transition-colors">
                <FaEdit className="h-4 w-4" />
            </Link>
            <button onClick={() => handleDelete(employee)} className="p-2 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-full transition-colors">
                <FaTrashAlt className="h-4 w-4" />
            </button>
        </div>
    ), []);

    return (
        <div className="p-4 md:p-2 space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Employee Management</h1>
                    <p className="mt-1 text-md text-gray-500 dark:text-gray-400">Manage all employees in the system.</p>
                </div>
                <Link
                    to="/employees/new"
                    className="btn-primary"
                >
                    <PlusCircle className="h-5 w-5 md:mr-2" />
                    <span className="hidden md:inline">Create Employee</span>
                </Link>
            </header>
            <DataTable<EmployeeWithOffice | any>
                key={refreshKey}
                columns={employeeColumns}
                fetchData={fetchEmployees}
                title="Employees"
                renderActions={renderActions}
            />
        </div>
    );
};