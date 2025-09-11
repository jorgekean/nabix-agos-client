import React from 'react';
import { Link } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { assetSchema, type AssetFormData } from '../assetSchema';
import { useOffices } from '../../office/useOffices';
import { useEmployees } from '../../../hooks/useEmployee';
import { QrCodeIcon } from 'lucide-react';

export const AssetForm: React.FC<{ initialData?: AssetFormData; onSubmit: SubmitHandler<AssetFormData>; mode: 'create' | 'edit' }> = ({ initialData, onSubmit, mode }) => {
    const { offices } = useOffices();
    const { employees } = useEmployees();

    const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<AssetFormData>({
        resolver: zodResolver(assetSchema) as any,
        defaultValues: initialData || { quantity: 1, status: 'In Storage', type: 'Equipment' },
    });

    const assetType = watch('type');

    React.useEffect(() => {
        // We now wait for BOTH initialData to exist AND for the offices list to have loaded.
        // This prevents the form from trying to set a value on an empty dropdown.
        if (initialData && offices.length > 0) {
            const transformedData = {
                ...initialData,
                currentOfficeId: String(initialData.currentOfficeId || ''),
                assignedToEmployeeId: String(initialData.assignedToEmployeeId || ''),
            };
            reset(transformedData as any);
        }
    }, [initialData, offices, employees, reset]);

    const inputBaseClasses = "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm transition focus:outline-none focus:ring-1";
    const inputNormalClasses = "border-gray-300 focus:ring-primary-500 focus:border-primary-500";
    const inputErrorClasses = "border-red-500 focus:ring-red-500 focus:border-red-500";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-lg shadow-lg dark:bg-gray-800">
            {/* Asset Name & Property Code */}
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Asset Name *</label>
                    <input id="name" type="text" {...register('name')} className={`${inputBaseClasses} ${errors.name ? inputErrorClasses : inputNormalClasses}`} />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                </div>
                <div>
                    <label htmlFor="propertyCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Property Code *</label>
                    <input id="propertyCode" type="text" {...register('propertyCode')} className={`${inputBaseClasses} ${errors.propertyCode ? inputErrorClasses : inputNormalClasses}`} />
                    {errors.propertyCode && <p className="mt-1 text-sm text-red-600">{errors.propertyCode.message}</p>}
                </div>
            </div>

            {/* Type & Status */}
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type *</label>
                    <select id="type" {...register('type')} className={`${inputBaseClasses} ${errors.type ? inputErrorClasses : inputNormalClasses}`}>
                        <option value="Equipment">Equipment</option>
                        <option value="Supply">Supply</option>
                    </select>
                    {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
                </div>
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status *</label>
                    <select id="status" {...register('status')} className={`${inputBaseClasses} ${errors.status ? inputErrorClasses : inputNormalClasses}`}>
                        <option>In Storage</option>
                        <option>Issued</option>
                        <option>Returned</option>
                        <option>Disposed</option>
                    </select>
                    {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>}
                </div>
            </div>

            {/* Conditional Fields for "Supply" Type */}
            {assetType === 'Supply' && (
                <div className="grid md:grid-cols-2 gap-6 p-4 border border-gray-200 rounded-md bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600">
                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity *</label>
                        <input id="quantity" type="number" {...register('quantity')} className={`${inputBaseClasses} ${errors.quantity ? inputErrorClasses : inputNormalClasses}`} />
                        {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="unitOfMeasurement" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit of Measurement</label>
                        <input id="unitOfMeasurement" type="text" {...register('unitOfMeasurement')} placeholder="e.g., box, piece, ream" className={`${inputBaseClasses} ${inputNormalClasses}`} />
                    </div>
                </div>
            )}

            {/* Location & Assignment */}
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="currentOfficeId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Office Location *</label>
                    <select id="currentOfficeId" {...register('currentOfficeId')} className={`${inputBaseClasses} ${errors.currentOfficeId ? inputErrorClasses : inputNormalClasses}`}>
                        <option value="">Select an Office</option>
                        {offices.map(o => <option key={o.officeID} value={o.officeID}>{o.officeName}</option>)}
                    </select>
                    {errors.currentOfficeId && <p className="mt-1 text-sm text-red-600">{errors.currentOfficeId.message}</p>}
                </div>
                <div>
                    <label htmlFor="assignedToEmployeeId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assigned To Employee</label>
                    <select id="assignedToEmployeeId" {...register('assignedToEmployeeId')} className={`${inputBaseClasses} ${inputNormalClasses}`}>
                        <option value="">Unassigned / In Storage</option>
                        {employees.map(e => <option key={e.employeeID} value={e.employeeID}>{e.firstName} {e.lastName}</option>)}
                    </select>
                </div>
            </div>
            <div>
                <label htmlFor="specificLocation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Specific Location (e.g., Desk #, Closet)</label>
                <input id="specificLocation" type="text" {...register('specificLocation')} className={`${inputBaseClasses} ${inputNormalClasses}`} />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea id="description" {...register('description')} rows={3} className={`${inputBaseClasses} ${inputNormalClasses}`} />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <Link to="/assets" className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-gray-400">

                    Cancel
                </Link>
                <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white font-semibold rounded-md shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <QrCodeIcon className="h-5 w-5 mr-2" />
                    {isSubmitting ? 'Saving...' : (mode === 'create' ? 'Create Asset' : 'Save Changes')}
                </button>

            </div>
        </form>
    );
};