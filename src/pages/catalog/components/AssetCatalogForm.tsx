import React from 'react';
import { Link } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { assetCatalogSchema, type AssetCatalogFormData } from '../assetCatalogSchema';
import { QrCodeIcon } from 'lucide-react';

interface AssetCatalogFormProps {
    initialData?: AssetCatalogFormData;
    onSubmit: SubmitHandler<AssetCatalogFormData>;
    mode: 'create' | 'edit';
}

export const AssetCatalogForm: React.FC<AssetCatalogFormProps> = ({ initialData, onSubmit, mode }) => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AssetCatalogFormData>({
        resolver: zodResolver(assetCatalogSchema) as any,
        defaultValues: initialData || { unitOfMeasurement: 'pcs' },
    });

    React.useEffect(() => { if (initialData) reset(initialData); }, [initialData, reset]);

    // Define standard class strings to keep JSX clean
    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";
    const inputBaseClasses = "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm transition focus:outline-none focus:ring-2";
    const inputNormalClasses = "border-gray-300 focus:ring-primary-500 focus:border-primary-500";
    const inputErrorClasses = "border-red-500 focus:ring-red-500 focus:border-red-500";
    const errorMessageClasses = "mt-1 text-sm text-red-600";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-lg shadow-lg dark:bg-gray-800">
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className={labelClasses}>Asset Name *</label>
                    <input id="name" type="text" {...register('name')} className={`${inputBaseClasses} ${errors.name ? inputErrorClasses : inputNormalClasses}`} />
                    {errors.name && <p className={errorMessageClasses}>{errors.name.message}</p>}
                </div>
                <div>
                    <label htmlFor="sku" className={labelClasses}>SKU / Product Code</label>
                    <input id="sku" type="text" {...register('sku')} className={`${inputBaseClasses} ${errors.sku ? inputErrorClasses : inputNormalClasses}`} />
                    {errors.sku && <p className={errorMessageClasses}>{errors.sku.message}</p>}
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="type" className={labelClasses}>Type *</label>
                    <select id="type" {...register('type')} className={`${inputBaseClasses} ${errors.type ? inputErrorClasses : inputNormalClasses}`}>
                        <option value="Equipment">Equipment</option>
                        <option value="Supply">Supply</option>
                    </select>
                    {errors.type && <p className={errorMessageClasses}>{errors.type.message}</p>}
                </div>
                <div>
                    <label htmlFor="unitOfMeasurement" className={labelClasses}>Unit of Measurement *</label>
                    <input id="unitOfMeasurement" type="text" {...register('unitOfMeasurement')} className={`${inputBaseClasses} ${errors.unitOfMeasurement ? inputErrorClasses : inputNormalClasses}`} />
                    {errors.unitOfMeasurement && <p className={errorMessageClasses}>{errors.unitOfMeasurement.message}</p>}
                </div>
            </div>
            <div>
                <label htmlFor="description" className={labelClasses}>Description</label>
                <textarea id="description" {...register('description')} rows={3} className={`${inputBaseClasses} ${inputNormalClasses}`} />
            </div>
            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <Link to="/catalog" className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-gray-400">

                    Cancel
                </Link>
                <button type="submit" disabled={isSubmitting} className="btn-primary">
                    <QrCodeIcon className="h-5 w-5 mr-2" />
                    {isSubmitting ? 'Saving...' : (mode === 'create' ? 'Create Catalog' : 'Save Changes')}
                </button>

            </div>
        </form>
    );
};