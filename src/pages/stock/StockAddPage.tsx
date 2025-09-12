import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';

import { stockAddSchema, type StockAddFormData } from './stockAddSchema';
import { useCatalog } from '../../hooks/useCatalog';
import { useOffices } from '../office/useOffices';
import { useEmployees } from '../../hooks/useEmployee';
import { stockService } from '../../services/stockService';
import { receivingVoucherService } from '../../services/receivingVouchers';

export const StockAddPage: React.FC = () => {
    const navigate = useNavigate();
    const { catalogItems } = useCatalog();
    const { offices } = useOffices();
    const { employees } = useEmployees();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<StockAddFormData>({
        resolver: zodResolver(stockAddSchema) as any,
        defaultValues: {
            dateReceived: new Date().toISOString().split('T')[0],
        }
    });

    const onSubmit: SubmitHandler<StockAddFormData> = async (data) => {
        // 1. Create the voucher for the delivery
        await receivingVoucherService.addVoucher({
            supplier: data.supplier,
            referenceNumber: data.referenceNumber,
            dateReceived: data.dateReceived,
            receivedByEmployeeId: data.receivedByEmployeeId,
            notes: data.notes,
        });

        // 2. Add the quantity to the stock table
        await stockService.addStock(data.catalogID, data.officeID, data.quantityToAdd);

        navigate('/supplies');
    };
    // Define standard class strings to keep JSX clean
    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";
    const inputBaseClasses = "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm transition focus:outline-none focus:ring-2";
    const inputNormalClasses = "border-gray-300 focus:ring-primary-500 focus:border-primary-500";
    const inputErrorClasses = "border-red-500 focus:ring-red-500 focus:border-red-500";
    const errorMessageClasses = "mt-1 text-sm text-red-600";

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
            <header>
                <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-4 dark:text-gray-400 dark:hover:text-white">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Supplies
                </button>
                <h1 className="text-3xl font-bold">Add Supply Stock</h1>
                <p className="mt-1 text-md text-gray-500">Record a new delivery of bulk supply items.</p>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Section 1: Voucher Details */}
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg space-y-4">
                    <h2 className="text-lg font-semibold">Delivery Details</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="supplier" className={labelClasses}>Supplier</label>
                            <input id="supplier" {...register('supplier')} className={`${inputBaseClasses} ${inputNormalClasses}`} />
                        </div>
                        <div>
                            <label htmlFor="referenceNumber" className={labelClasses}>Reference #</label>
                            <input id="referenceNumber" {...register('referenceNumber')} className={`${inputBaseClasses} ${inputNormalClasses}`} />
                        </div>
                        <div>
                            <label htmlFor="dateReceived" className={labelClasses}>Date Received *</label>
                            <input id="dateReceived" type="date" {...register('dateReceived')} className={`${inputBaseClasses} ${errors.dateReceived ? inputErrorClasses : inputNormalClasses}`} />
                            {errors.dateReceived && <p className={errorMessageClasses}>{errors.dateReceived.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="receivedByEmployeeId" className={labelClasses}>Received By</label>
                            <select id="receivedByEmployeeId" {...register('receivedByEmployeeId')} className={`${inputBaseClasses} ${inputNormalClasses}`}>
                                <option value="">Select an employee...</option>
                                {employees.map(emp => (
                                    <option key={emp.employeeID} value={emp.employeeID}>{emp.firstName} {emp.lastName}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="notes" className={labelClasses}>Notes</label>
                        <textarea id="notes" {...register('notes')} rows={3} className={`${inputBaseClasses} ${inputNormalClasses}`} />
                    </div>
                </div>

                {/* Section 2: Stock Details */}
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg space-y-4">
                    <h2 className="text-lg font-semibold">Stock Details</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="catalogID" className={labelClasses}>Supply Item *</label>
                            <select id="catalogID" {...register('catalogID')} className={`${inputBaseClasses} ${errors.catalogID ? inputErrorClasses : inputNormalClasses}`}>
                                <option value="">Select a supply from catalog...</option>
                                {catalogItems.filter(i => i.type === 'Supply').map(item => (
                                    <option key={item.catalogID} value={item.catalogID}>{item.name}</option>
                                ))}
                            </select>
                            {errors.catalogID && <p className={errorMessageClasses}>{errors.catalogID.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="officeID" className={labelClasses}>Add to Office *</label>
                            <select id="officeID" {...register('officeID')} className={`${inputBaseClasses} ${errors.officeID ? inputErrorClasses : inputNormalClasses}`}>
                                <option value="">Select an office...</option>
                                {offices.map(office => (
                                    <option key={office.officeID} value={office.officeID}>{office.officeName}</option>
                                ))}
                            </select>
                            {errors.officeID && <p className={errorMessageClasses}>{errors.officeID.message}</p>}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="quantityToAdd" className={labelClasses}>Quantity to Add *</label>
                        <input id="quantityToAdd" type="number" {...register('quantityToAdd')} className={`${inputBaseClasses} ${errors.quantityToAdd ? inputErrorClasses : inputNormalClasses}`} />
                        {errors.quantityToAdd && <p className={errorMessageClasses}>{errors.quantityToAdd.message}</p>}
                    </div>
                </div>

                <div className="flex items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white font-semibold rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {isSubmitting ? 'Saving...' : 'Add Stock to Inventory'}
                    </button>
                    <Link to="/supplies" className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
};