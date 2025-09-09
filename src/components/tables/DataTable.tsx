import React, { useState, useEffect } from 'react';
// 1. Import the necessary icons from lucide-react
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

// --- Custom Hooks ---
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

// --- Type Definitions ---
export interface Column<T> {
    accessor: keyof T;
    Header: string;
    Cell?: (data: { row: T }) => React.ReactNode;
}
interface FilterOption { label: string; value: string | number; }
interface FilterableColumn { key: string; label: string; options: FilterOption[]; }
interface FetchResult<T> { data: T[]; totalPages: number; }

interface DataTableProps<T> {
    columns: Column<T>[];
    fetchData: (page: number, pageSize: number, searchTerm: string, filters: Record<string, any>) => Promise<FetchResult<T>>;
    title: string;
    filterableColumns?: FilterableColumn[];
    pageSize?: number;
    renderActions?: (row: T) => React.ReactNode;
}

export function DataTable<T extends { id: any }>({
    columns,
    fetchData,
    title,
    filterableColumns = [],
    pageSize = 10,
    renderActions,
}: DataTableProps<T>) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState<Record<string, any>>({});
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const result = await fetchData(currentPage, pageSize, debouncedSearchTerm, filters);
                setData(result.data);
                setTotalPages(result.totalPages);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [currentPage, debouncedSearchTerm, filters, fetchData, pageSize]);

    useEffect(() => { setCurrentPage(1); }, [debouncedSearchTerm, filters]);

    const handleFilterChange = (key: string, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="overflow-hidden rounded-xl bg-white shadow-lg dark:bg-gray-800">
            {/* Header: Title, Search, Filters */}
            <div className="p-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h2>
                    <div className="relative">
                        {/* 2. Use the imported Search icon */}
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border-gray-300 bg-gray-50 py-2 pl-10 pr-4 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                        />
                    </div>
                </div>
                {filterableColumns.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {filterableColumns.map(filter => (
                            <div key={filter.key}>
                                <label htmlFor={filter.key} className="sr-only">{filter.label}</label>
                                <select
                                    id={filter.key}
                                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                                    className="w-full rounded-lg border-gray-300 bg-gray-50 text-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                >
                                    <option value="">{filter.label}</option>
                                    {filter.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            {columns.map(col => <th key={String(col.accessor)} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">{col.Header}</th>)}
                            {renderActions && <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                        {loading ? (
                            <tr><td colSpan={columns.length + (renderActions ? 1 : 0)} className="py-16 text-center text-gray-500">Loading...</td></tr>
                        ) : data.length > 0 ? (
                            data.map(row => (
                                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    {columns.map(col => <td key={String(col.accessor)} className="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{col.Cell ? col.Cell({ row }) : String(row[col.accessor])}</td>)}
                                    {renderActions && <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">{renderActions(row)}</td>}
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={columns.length + (renderActions ? 1 : 0)} className="py-16 text-center text-gray-500">No data found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 p-4 dark:border-gray-700">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                        {/* 3. Use the imported ChevronLeft icon */}
                        <ChevronLeft className="mr-2 h-5 w-5" /> Previous
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                        {/* 4. Use the imported ChevronRight icon */}
                        Next <ChevronRight className="ml-2 h-5 w-5" />
                    </button>
                </div>
            )}
        </div>
    );
}