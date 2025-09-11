import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Eye } from 'lucide-react'; // Using an 'Eye' icon for details
import { DataTable, type Column } from '../../components/tables/DataTable';
import { receivingVoucherService, type DetailedReceivingVoucher } from '../../services/receivingVouchers';


const columns: Column<DetailedReceivingVoucher>[] = [
    { Header: 'Voucher ID', accessor: 'voucherID' },
    { Header: 'Supplier', accessor: 'supplier' },
    { Header: 'Reference #', accessor: 'referenceNumber' },
    { Header: 'Date Received', accessor: 'dateReceived' },
    { Header: 'Received By', accessor: 'receivedByEmployeeName' },
];

export const ReceivingVoucherIndexPage: React.FC = () => {
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchData = useCallback(async (page: number, pageSize: number, searchTerm: string) => {
        const allVouchers = await receivingVoucherService.getDetailedVouchers();
        // Add filtering logic here if needed
        const totalPages = Math.ceil(allVouchers.length / pageSize);
        const data = allVouchers.slice((page - 1) * pageSize, page * pageSize);
        return { data, totalPages };
    }, []);

    const renderActions = useCallback((voucher: DetailedReceivingVoucher) => (
        <div className="flex justify-end space-x-2">
            <Link to={`/vouchers/edit/${voucher.voucherID}`} className="btn-icon-primary">
                <Pencil className="h-4 w-4" />
            </Link>
            {/* Future: Link to a details page showing all items from this voucher */}
            <button className="btn-icon-secondary" title="View Items (Not Implemented)">
                <Eye className="h-4 w-4" />
            </button>
        </div>
    ), []);

    return (
        <div className="p-4 md:p-6 space-y-6">
            <header>
                <h1 className="text-3xl font-bold">Receiving Vouchers</h1>
                <p className="mt-1 text-md text-gray-500">A log of all procurement and receiving events.</p>
            </header>
            <DataTable<DetailedReceivingVoucher | any>
                key={refreshKey}
                columns={columns}
                fetchData={fetchData}
                title="All Vouchers"
                renderActions={renderActions}
            />
        </div>
    );
};