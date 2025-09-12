import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

import { DataTable, type Column } from '../../components/tables/DataTable';
import { type Office, officeService } from './OfficeService';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
// 3. Define the columns for the DataTable
//    This tells the table what headers to display and how to access the data.
const officeColumns: Column<Office>[] = [
    {
        Header: 'Name',
        accessor: 'officeName',
    },
    {
        Header: 'Address',
        accessor: 'address',
    },
];

export const OfficeIndexPage: React.FC = () => {
    // This state key is a trick to force the DataTable to refetch its data
    // after we perform an action like deleting an item.
    const [refreshKey, setRefreshKey] = useState(0);

    // 4. Create the fetchData function required by the DataTable
    //    This function simulates server-side searching and pagination on our mock data.
    const fetchOffices = useCallback(async (page: number, pageSize: number, searchTerm: string) => {
        // Get all data from the mock service
        const allOffices = await officeService.getOffices();

        // Simulate searching
        const filteredOffices = allOffices.filter(office =>
            office.officeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            office.address?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Simulate pagination
        const totalPages = Math.ceil(filteredOffices.length / pageSize);
        const paginatedData = filteredOffices.slice((page - 1) * pageSize, page * pageSize);

        // Return data in the format the DataTable expects
        return { data: paginatedData, totalPages };
    }, []); // This function itself doesn't need dependencies as it always fetches the full list

    const handleDelete = async (officeID: number, officeName: string) => {
        if (window.confirm(`Are you sure you want to delete the office "${officeName}"?`)) {
            await officeService.deleteOffice(officeID);
            // Increment the refresh key to trigger a data refetch in the DataTable
            setRefreshKey(prev => prev + 1);
        }
    };

    // 5. Define the renderActions function required by the DataTable
    //    This function returns the JSX for the edit and delete buttons for each row.
    const renderOfficeActions = useCallback((office: Office) => (
        <div className="flex justify-end space-x-2">
            <Link
                to={`/offices/edit/${office.officeID}`}
                className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-full transition-colors"
            >
                <FaEdit className="h-4 w-4" />
            </Link>
            <button
                onClick={() => handleDelete(office.officeID!, office.officeName)}
                className="p-2 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-full transition-colors"
            >
                <FaTrashAlt className="h-4 w-4" />
            </button>
        </div>
    ), []);


    return (
        <div className="p-4 md:p-2 space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Office Management</h1>
                    <p className="mt-1 text-md text-gray-500 dark:text-gray-400">A list of all office locations in your system.</p>
                </div>
                <Link
                    to="/offices/new"
                    className="btn-primary"
                >
                    <PlusCircle className="h-5 w-5 md:mr-2" />
                    <span className="hidden md:inline">Create Office</span>
                </Link>
            </header>

            {/* 6. Render the DataTable with all the required props */}
            <DataTable<Office | any>
                key={refreshKey} // Use the refreshKey here
                columns={officeColumns}
                fetchData={fetchOffices}
                title="Offices"
                renderActions={renderOfficeActions}
            />
        </div>
    );
};