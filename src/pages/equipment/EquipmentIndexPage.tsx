import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, PlusCircle, History } from 'lucide-react';
import { DataTable, type Column } from '../../components/tables/DataTable';
import { type AssetInstanceDetails, equipmentService } from '../../services/equipmentService';

const columns: Column<AssetInstanceDetails>[] = [
    {
        Header: 'Name',
        accessor: 'catalogID',
        Cell: ({ row }) => <span className="font-medium text-gray-900 dark:text-white">{row.catalogItem.name}</span>
    },
    { Header: 'Property Code', accessor: 'propertyCode' },
    { Header: 'Status', accessor: 'status' },
    {
        Header: 'Office',
        accessor: 'currentOfficeId',
        Cell: ({ row }) => <>{row.office.officeName}</>
    },
    {
        Header: 'Assigned To',
        accessor: 'assignedToEmployeeId',
        Cell: ({ row }) => <>{row.employee ? `${row.employee.firstName} ${row.employee.lastName}` : 'N/A'}</>
    },
];

export const EquipmentIndexPage: React.FC = () => {
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchData = useCallback(async (page: number, pageSize: number, searchTerm: string) => {
        // 1. Get all instances from the service
        const allInstances = await equipmentService.getDetailedInstances();
        const searchLower = searchTerm.toLowerCase();

        // 2. Apply the search filter if a search term exists
        const filtered = searchTerm
            ? allInstances.filter(inst =>
                inst.catalogItem.name.toLowerCase().includes(searchLower) ||
                inst.propertyCode.toLowerCase().includes(searchLower) ||
                inst.status.toLowerCase().includes(searchLower) ||
                inst.office.officeName.toLowerCase().includes(searchLower) ||
                (inst.employee && `${inst.employee.firstName} ${inst.employee.lastName}`.toLowerCase().includes(searchLower))
            )
            : allInstances;

        // 3. Calculate total pages based on the *filtered* results
        const totalPages = Math.ceil(filtered.length / pageSize);

        // 4. Extract the data for the current page from the *filtered* results
        const data = filtered.slice((page - 1) * pageSize, page * pageSize);

        return { data, totalPages };
    }, []);

    const handleDelete = async (instance: AssetInstanceDetails) => {
        if (window.confirm(`Delete asset "${instance.catalogItem.name}" (${instance.propertyCode})?`)) {
            await equipmentService.deleteInstance(instance.instanceID!);
            setRefreshKey(prev => prev + 1);
        }
    };

    const renderActions = useCallback((instance: AssetInstanceDetails) => (
        <div className="flex justify-end space-x-2">
            <Link to={`/equipment/history/${instance.instanceID}`} className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
                <History className="h-4 w-4" />
            </Link>
            <Link to={`/equipment/edit/${instance.instanceID}`} className="p-2 text-primary-600 hover:text-primary-900 hover:bg-primary-100 rounded-full transition-colors">
                <Pencil className="h-4 w-4" />
            </Link>
            <button onClick={() => handleDelete(instance)} className="p-2 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-full transition-colors">
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
    ), []);

    return (
        <div className="p-4 md:p-2 space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Equipment</h1>
                    <p className="mt-1 text-md text-gray-500">Manage all individual, serialized assets.</p>
                </div>
                <Link to="/equipment/new" className="btn-primary">
                    <PlusCircle className="h-5 w-5 md:mr-2" />
                    <span className="hidden md:inline">Receive Equipment</span>
                </Link>
            </header>
            <DataTable<AssetInstanceDetails | any>
                key={refreshKey}
                columns={columns}
                fetchData={fetchData}
                title="All Equipment"
                renderActions={renderActions}
            />
        </div>
    );
};