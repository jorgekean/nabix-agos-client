import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { DataTable, type Column } from '../../components/tables/DataTable';
import { type DetailedStock, stockService } from '../../services/stockService';

const columns: Column<DetailedStock>[] = [
    {
        Header: 'Supply Name',
        accessor: 'catalogID',
        Cell: ({ row }) => <span className="font-medium text-gray-900 dark:text-white">{row.catalogItem.name}</span>
    },
    {
        Header: 'SKU',
        accessor: 'catalogID', // Base accessor, Cell provides the data
        Cell: ({ row }) => <>{row.catalogItem.sku || 'N/A'}</>
    },
    {
        Header: 'Office Location',
        accessor: 'officeID',
        Cell: ({ row }) => <>{row.office.officeName}</>
    },
    { Header: 'Quantity On Hand', accessor: 'quantityOnHand' },
];

export const StockIndexPage: React.FC = () => {
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchData = useCallback(async (page: number, pageSize: number, searchTerm: string) => {
        // 1. Get all stock levels from the service
        const allStock = await stockService.getDetailedStockLevels();
        const searchLower = searchTerm.toLowerCase();

        // 2. Apply the search filter if a search term exists
        const filtered = searchTerm
            ? allStock.filter(stock =>
                stock.catalogItem.name.toLowerCase().includes(searchLower) ||
                (stock.catalogItem.sku && stock.catalogItem.sku.toLowerCase().includes(searchLower)) ||
                stock.office.officeName.toLowerCase().includes(searchLower)
            )
            : allStock;

        // 3. Calculate total pages based on the *filtered* results
        const totalPages = Math.ceil(filtered.length / pageSize);

        // 4. Extract the data for the current page from the *filtered* results
        const data = filtered.slice((page - 1) * pageSize, page * pageSize);

        return { data, totalPages };
    }, []);

    return (
        <div className="p-4 md:p-2 space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Supply Stock</h1>
                    <p className="mt-1 text-md text-gray-500">View current stock levels for all bulk supplies.</p>
                </div>
                <Link to="/stock/new" className="btn-primary">
                    <PlusCircle className="h-5 w-5 md:mr-2" />
                    <span className="hidden md:inline">Add Stock</span>
                </Link>
            </header>
            <DataTable<DetailedStock | any>
                key={refreshKey}
                columns={columns}
                fetchData={fetchData}
                title="All Supply Stock"
            />
        </div>
    );
};