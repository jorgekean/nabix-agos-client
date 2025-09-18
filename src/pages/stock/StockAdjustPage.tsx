import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';

import { stockAdjustSchema, type StockAdjustFormData } from './stockAdjustSchema';
import { stockService } from '../../services/stockService';
import { useStockLevels } from '../../hooks/useStockLevels';


export const StockAdjustPage: React.FC = () => {
    const navigate = useNavigate();
    const { stockLevels, isLoading } = useStockLevels(); // Assumes a simple hook to fetch stock

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<StockAdjustFormData>({
        resolver: zodResolver(stockAdjustSchema) as any,
    });

    const onSubmit: SubmitHandler<StockAdjustFormData> = async (data) => {
        try {
            await stockService.adjustStockQuantity(
                data.stockID,
                data.action,
                data.quantityChange,
                data.notes
            );
            navigate('/supplies');
        } catch (error: any) {
            // In a real app, show a proper toast notification
            alert(`Error: ${error.message}`);
        }
    };

    // Define standard class strings to keep JSX clean
    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";
    const inputBaseClasses = "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm transition focus:outline-none focus:ring-2";
    const inputNormalClasses = "border-gray-300 focus:ring-primary-500 focus:border-primary-500";
    const inputErrorClasses = "border-red-500 focus:ring-red-500 focus:border-red-500";
    const errorMessageClasses = "mt-1 text-sm text-red-600";

    return (
        <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
            <header>
                <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-4 dark:text-gray-400 dark:hover:text-white">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Supplies
                </button>
                <h1 className="text-3xl font-bold">Adjust Supply Stock</h1>
                <p className="mt-1 text-md text-gray-500">Log a new transaction like issuing supplies or correcting inventory counts.</p>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg space-y-6">
                <div>
                    <label htmlFor="stockID" className={labelClasses}>Stock Item to Adjust *</label>
                    <select id="stockID" {...register('stockID')} disabled={isLoading} className={`${inputBaseClasses} ${errors.stockID ? inputErrorClasses : inputNormalClasses}`}>
                        <option value="">Select an item...</option>
                        {stockLevels.map(item => (
                            <option key={item.stockID} value={item.stockID}>
                                {item.catalogItem.name} (at {item.office.officeName}) - On Hand: {item.quantityOnHand}
                            </option>
                        ))}
                    </select>
                    {errors.stockID && <p className={errorMessageClasses}>{errors.stockID.message}</p>}
                </div>

                <div>
                    <label htmlFor="action" className={labelClasses}>Action *</label>
                    <select id="action" {...register('action')} className={`${inputBaseClasses} ${errors.action ? inputErrorClasses : inputNormalClasses}`}>
                        <option value="">Select an action...</option>
                        <option>Issued</option>
                        <option>Written Off</option>
                        <option>Count Correction - Increase</option>
                        <option>Count Correction - Decrease</option>
                    </select>
                    {errors.action && <p className={errorMessageClasses}>{errors.action.message}</p>}
                </div>

                <div>
                    <label htmlFor="quantityChange" className={labelClasses}>Quantity *</label>
                    <input id="quantityChange" type="number" {...register('quantityChange')} className={`${inputBaseClasses} ${errors.quantityChange ? inputErrorClasses : inputNormalClasses}`} />
                    {errors.quantityChange && <p className={errorMessageClasses}>{errors.quantityChange.message}</p>}
                </div>

                <div>
                    <label htmlFor="notes" className={labelClasses}>Notes</label>
                    <textarea id="notes" {...register('notes')} rows={3} className={`${inputBaseClasses} ${inputNormalClasses}`} />
                </div>

                <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <Link to="/supplies" className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
                        Cancel
                    </Link>
                    <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white font-semibold rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {isSubmitting ? 'Saving Transaction...' : 'Submit Adjustment'}
                    </button>

                </div>
            </form>
        </div>
    );
};