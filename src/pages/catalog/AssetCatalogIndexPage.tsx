import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { DataTable, type Column } from '../../components/tables/DataTable';
import { type CatalogItem, assetCatalogService } from '../../services/assetCatalogService';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const columns: Column<CatalogItem>[] = [
    { Header: 'Name', accessor: 'name' },
    {
        Header: 'Type', accessor: 'type',
        Cell: ({ row }: { row: CatalogItem }) => {
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
    { Header: 'SKU', accessor: 'sku' },
    { Header: 'Unit', accessor: 'unitOfMeasurement' },
];

export const AssetCatalogIndexPage: React.FC = () => {
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchData = useCallback(async (page: number, pageSize: number, searchTerm: string, filters: Record<string, any>) => {
        const allItems = await assetCatalogService.getCatalogItems();
        let filtered = allItems.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.sku?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filters.type) { filtered = filtered.filter(log => log.type === filters.type); }

        const totalPages = Math.ceil(filtered.length / pageSize);
        const data = filtered.slice((page - 1) * pageSize, page * pageSize);
        return { data, totalPages };
    }, []);

    const handleDelete = async (item: CatalogItem) => {
        if (window.confirm(`Are you sure you want to delete the catalog item "${item.name}"?`)) {
            await assetCatalogService.deleteCatalogItem(item.catalogID!);
            // Trigger a refetch by updating the key
            setRefreshKey(prev => prev + 1);
        }
    };

    const renderActions = useCallback((item: CatalogItem) => (
        <div className="flex justify-end space-x-2">
            <Link
                to={`/catalog/edit/${item.catalogID}`}
                className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-full transition-colors"
            >
                <FaEdit className="h-4 w-4" />
            </Link>
            <button
                onClick={() => handleDelete(item)}
                className="p-2 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-full transition-colors"
            >
                <FaTrashAlt className="h-4 w-4" />
            </button>
        </div>
    ), []);

    const filterableColumns = [
        { key: 'type', label: 'Filter by Type', options: [{ label: 'Supply', value: 'Supply' }, { label: 'Equipment', value: 'Equipment' }] }
    ];

    return (
        <div className="p-4 md:p-2 space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Asset Catalog</h1>
                    <p className="mt-1 text-md text-gray-500">Manage the master list of asset types (blueprints).</p>
                </div>
                <Link to="/catalog/new" className="btn-primary">
                    <PlusCircle className="h-5 w-5 md:mr-2" />
                    <span className="hidden md:inline">Add New Item</span>
                </Link>
            </header>
            <DataTable<CatalogItem | any>
                key={refreshKey}
                columns={columns}
                filterableColumns={filterableColumns}
                fetchData={fetchData}
                title="Catalog Items"
                renderActions={renderActions}
            />
        </div>
    );
};