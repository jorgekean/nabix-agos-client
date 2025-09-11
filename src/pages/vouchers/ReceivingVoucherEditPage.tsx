import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { voucherEditSchema, type VoucherEditFormData } from './voucherEditSchema';
import { receivingVoucherService, type ReceivingVoucher } from '../../services/receivingVouchers';
import { useEmployees } from '../../hooks/useEmployee';


export const ReceivingVoucherEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [voucher, setVoucher] = useState<ReceivingVoucher | null>(null);
    const { employees } = useEmployees();

    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<VoucherEditFormData>({
        resolver: zodResolver(voucherEditSchema) as any,
    });

    useEffect(() => {
        const voucherId = parseInt(id!, 10);
        if (isNaN(voucherId)) {
            navigate('/vouchers');
            return;
        }

        receivingVoucherService.getVoucherById(voucherId).then(data => {
            if (data && employees.length > 0) { // 3. Wait for employees to load
                setVoucher(data);
                // 4. Transform ID to string for the form
                const formData = {
                    ...data,
                    receivedByEmployeeId: String(data.receivedByEmployeeId || ''),
                };
                reset(formData);
            } else if (data) {
                setVoucher(data); // Set voucher data if employees not loaded yet
            } else {
                alert('Voucher not found');
                navigate('/vouchers');
            }
        });
    }, [id, navigate, employees, reset]);

    const onSubmit: SubmitHandler<VoucherEditFormData> = async (data) => {
        await receivingVoucherService.updateVoucher({ ...voucher!, ...data });
        navigate('/vouchers');
    };

    // Define standard class strings to keep JSX clean
    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";
    const inputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500";
    const disabledInputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 cursor-not-allowed";


    if (!voucher) {
        return <div className="p-6">Loading voucher...</div>;
    }

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
            <header>
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-4 dark:text-gray-400 dark:hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Vouchers
                </button>
                <h1 className="text-3xl font-bold">Edit Receiving Voucher #{voucher.voucherID}</h1>
                <p className="mt-1 text-md text-gray-500">Correct typos or add notes to this receiving record.</p>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-lg shadow-lg dark:bg-gray-800">
                {/* Read-only fields for context */}
                <div>
                    <label className={labelClasses}>Date Received</label>
                    <input value={voucher.dateReceived} disabled className={disabledInputClasses} />
                </div>

                <div>
                    <label htmlFor="receivedByEmployeeId" className="label">Received By</label>
                    <select id="receivedByEmployeeId" {...register('receivedByEmployeeId')} className={inputClasses}>
                        <option value="">Select an employee...</option>
                        {employees.map(emp => (
                            <option key={emp.employeeID} value={emp.employeeID}>{emp.firstName} {emp.lastName}</option>
                        ))}
                    </select>
                </div>

                {/* Editable fields */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="supplier" className={labelClasses}>Supplier</label>
                        <input id="supplier" {...register('supplier')} className={inputClasses} />
                    </div>
                    <div>
                        <label htmlFor="referenceNumber" className={labelClasses}>Reference #</label>
                        <input id="referenceNumber" {...register('referenceNumber')} className={inputClasses} />
                    </div>
                </div>
                <div>
                    <label htmlFor="notes" className={labelClasses}>Notes</label>
                    <textarea id="notes" {...register('notes')} rows={4} className={inputClasses} />
                </div>

                <div className="flex items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white font-semibold rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                    <Link to="/vouchers" className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
};