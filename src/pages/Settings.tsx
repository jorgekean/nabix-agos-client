import React from 'react';
// FIX: Corrected the import path to match the project structure.
import { DataTable } from '../components/tables/DataTable';
import type { Column } from '../components/tables/DataTable';

// --- Inline SVG Icons ---
const PencilIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918a4 4 0 01-1.336.932l-3.155 1.262a.5.5 0 01-.65-.65z" />
        <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
    </svg>
);
const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193v-.443A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
    </svg>
);


// --- Mock Data and API Simulation ---
interface AuditLog {
    id: number;
    user: string;
    action: string;
    timestamp: string;
    status: 'success' | 'failed' | 'pending';
}

const mockLogs: AuditLog[] = Array.from({ length: 120 }, (_, i) => { const date = new Date(Date.now() - i * 3600000); return { id: 120 - i, user: `user${(i % 10) + 1}@example.com`, action: ['Logged in', 'Updated profile', 'Deleted item', 'Created new user', 'Changed password'][i % 5], timestamp: date.toLocaleString(), status: ['success', 'failed', 'pending'][i % 3] as AuditLog['status'], }; });

const fetchAuditLogs = async (page: number, pageSize: number, searchTerm: string, filters: Record<string, any>): Promise<{ data: AuditLog[], totalPages: number }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    let filteredData = mockLogs;
    if (searchTerm) { filteredData = filteredData.filter(log => log.user.toLowerCase().includes(searchTerm.toLowerCase()) || log.action.toLowerCase().includes(searchTerm.toLowerCase())); }
    if (filters.status) { filteredData = filteredData.filter(log => log.status === filters.status); }
    if (filters.action) { filteredData = filteredData.filter(log => log.action === filters.action); }
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);
    return { data: paginatedData, totalPages };
};


// --- Settings Component ---
const Settings = () => {
    // Action handlers defined in the parent component
    const handleEdit = (log: AuditLog) => alert(`Editing log ID: ${log.id}`);
    const handleDelete = (log: AuditLog) => alert(`Deleting log ID: ${log.id}`);

    const columns: Column<AuditLog>[] = [
        { accessor: 'id', Header: 'Log ID' },
        { accessor: 'user', Header: 'User' },
        { accessor: 'action', Header: 'Action' },
        { accessor: 'timestamp', Header: 'Timestamp' },
        {
            accessor: 'status',
            Header: 'Status',
            Cell: ({ row }) => {
                const statusColor = {
                    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
                    failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
                    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
                }[row.status];
                return <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${statusColor}`}>{row.status}</span>;
            }
        },
    ];

    const filterableColumns = [
        { key: 'status', label: 'Filter by Status', options: [{ label: 'Success', value: 'success' }, { label: 'Failed', value: 'failed' }, { label: 'Pending', value: 'pending' }] },
        { key: 'action', label: 'Filter by Action', options: [{ label: 'Login', value: 'Logged in' }, { label: 'Updated Profile', value: 'Updated profile' }, { label: 'Deleted Item', value: 'Deleted item' }] }
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">System Audit Logs</h1>
            <DataTable<AuditLog>
                columns={columns}
                fetchData={fetchAuditLogs}
                title="Recent Activity"
                filterableColumns={filterableColumns}
                renderActions={(log) => (
                    <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => handleEdit(log)} className="text-gray-400 transition-colors duration-200 hover:text-orange-600 dark:hover:text-orange-400">
                            <span className="sr-only">Edit</span>
                            <PencilIcon className="h-5 w-5" />
                        </button>
                        <button onClick={() => handleDelete(log)} className="text-gray-400 transition-colors duration-200 hover:text-red-600 dark:hover:text-red-500">
                            <span className="sr-only">Delete</span>
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    </div>
                )}
            />
        </div>
    );
};

export default Settings;

