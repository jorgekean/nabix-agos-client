import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, PlusCircle, Edit, History } from 'lucide-react';
import { DataTable, type Column } from '../../components/tables/DataTable';
import { assetService, type AssetWithDetails } from './AssetService';

// Defines the columns that the DataTable will display for assets.
const assetColumns: Column<AssetWithDetails>[] = [
    {
        Header: 'Name',
        accessor: 'name',
        // Example of a custom cell renderer to make the name bold
        Cell: ({ row }) => <span className="font-medium text-gray-900 dark:text-white">{row.name}</span>
    },
    { Header: 'Property Code', accessor: 'propertyCode' },
    {
        Header: 'Type',
        accessor: 'type',
        // Add this Cell renderer function
        Cell: ({ row }: { row: AssetWithDetails }) => {
            const isSupply = row.type === 'Supply';

            // Base classes for the pill style
            const baseClasses = "px-3 py-1 rounded-full text-xs font-medium inline-block";

            // Conditional classes for the color
            const colorClasses = isSupply
                ? "bg-primary-100 text-primary-800"
                : "bg-secondary-100 text-secondary-800";

            return (
                <span className={`${baseClasses} ${colorClasses}`}>
                    {row.type}
                </span>
            );
        },
    },
    { Header: 'Status', accessor: 'status' },
    { Header: 'Office', accessor: 'officeName' },
    { Header: 'Assigned To', accessor: 'assignedToEmployeeName' },
];

export const AssetIndexPage: React.FC = () => {
    // State key to trigger a data refetch in the DataTable after a deletion.
    const [refreshKey, setRefreshKey] = useState(0);

    // Function passed to the DataTable to fetch and filter data.
    const fetchAssets = useCallback(async (page: number, pageSize: number, searchTerm: string, filters: Record<string, any>) => {
        const allAssets = await assetService.getAssets();

        // Client-side filtering logic based on the search term.
        let filtered = allAssets.filter(asset => {
            const searchLower = searchTerm.toLowerCase();
            return (
                asset.name.toLowerCase().includes(searchLower) ||
                asset.propertyCode.toLowerCase().includes(searchLower) ||
                asset.type.toLowerCase().includes(searchLower) ||
                asset.status.toLowerCase().includes(searchLower) ||
                asset.officeName.toLowerCase().includes(searchLower) ||
                asset.assignedToEmployeeName?.toLowerCase().includes(searchLower)
            );
        });

        if (filters.type) { filtered = filtered.filter(log => log.type === filters.type); }
        if (filters.status) { filtered = filtered.filter(log => log.status === filters.status); }

        // Client-side pagination.
        const totalPages = Math.ceil(filtered.length / pageSize);
        const data = filtered.slice((page - 1) * pageSize, page * pageSize);

        return { data, totalPages };
    }, []);

    // Handles the deletion of an asset.
    const handleDelete = async (asset: AssetWithDetails) => {
        if (window.confirm(`Are you sure you want to delete the asset "${asset.name}"?`)) {
            await assetService.deleteAsset(asset.assetID!);
            // Trigger a refetch by updating the key.
            setRefreshKey(prev => prev + 1);
        }
    };

    // Renders the Edit and Delete buttons for each row.
    const renderAssetActions = useCallback((asset: AssetWithDetails) => (
        <div className="flex justify-end space-x-2">
            <Link to={`/assets/history/${asset.assetID}`} className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-full transition-colors">
                <History className="h-4 w-4" />
            </Link>
            <Link to={`/assets/edit/${asset.assetID}`} className="p-2 text-primary-600 hover:text-primary-900 hover:bg-primary-100 rounded-full transition-colors">
                <Edit className="h-4 w-4" />
            </Link>
            <button onClick={() => handleDelete(asset)} className="p-2 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-full transition-colors">
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
    ), []);

    const filterableColumns = [
        { key: 'type', label: 'Filter by Type', options: [{ label: 'Supply', value: 'Supply' }, { label: 'Equipment', value: 'Equipment' }] },
        { key: 'status', label: 'Filter by Status', options: [{ label: 'In Storage', value: 'In Storage' }, { label: 'Issued', value: 'Issued' }, { label: 'Returned', value: 'Returned' }, { label: 'Disposed', value: 'Disposed' }] }
    ];

    return (
        <div className="p-4 md:p-6 space-y-6">
            <header className="flex flex-col sm:flex-row justify-between sm:items-center space-y-4 sm:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Asset Management</h1>
                    <p className="mt-1 text-md text-gray-500 dark:text-gray-400">Browse, search, and manage all company assets.</p>
                </div>
                <Link to="/assets/new" className="inline-flex items-center justify-center p-2 md:px-4 md:py-2 bg-primary text-white font-semibold rounded-full md:rounded-md shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all self-end sm:self-center">
                    <PlusCircle className="h-5 w-5 md:mr-2" />
                    <span className="hidden md:inline">Add Asset</span>
                </Link>
            </header>
            <DataTable<AssetWithDetails | any>
                key={refreshKey}
                columns={assetColumns}
                fetchData={fetchAssets}
                title="All Assets"
                renderActions={renderAssetActions}
                filterableColumns={filterableColumns}
            />
        </div>
    );
};