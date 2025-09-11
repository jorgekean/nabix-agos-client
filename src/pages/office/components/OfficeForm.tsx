import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { officeSchema, type OfficeFormData } from '../officeSchema';

interface OfficeFormProps {
    initialData?: OfficeFormData;
    onSubmit: SubmitHandler<OfficeFormData>; // RHF's SubmitHandler type is useful here
    mode: 'create' | 'edit';
}

export const OfficeForm: React.FC<OfficeFormProps> = ({ initialData, onSubmit, mode }) => {
    // 1. Initialize React Hook Form with the Zod resolver
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }, // isSubmitting replaces our old isSaving state
    } = useForm<OfficeFormData>({
        resolver: zodResolver(officeSchema),
    });

    // 2. Use useEffect to populate the form with initial data for editing
    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    // The 'onSubmit' prop will be wrapped by RHF's handleSubmit
    const processSubmit: SubmitHandler<OfficeFormData> = async (data) => {
        await onSubmit(data);
    };

    return (
        // 3. RHF's handleSubmit validates the form before calling our onSubmit function
        <form onSubmit={handleSubmit(processSubmit)} className="space-y-6 bg-white p-8 rounded-lg shadow-lg dark:bg-gray-800">
            <div>
                <label htmlFor="officeName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Office Name *</label>
                <input
                    id="officeName"
                    type="text"
                    // 4. Register the input with RHF
                    {...register('officeName')}
                    className={`block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ${errors.officeName ? 'border-red-500' : ''}`}
                    disabled={isSubmitting}
                />
                {/* 5. Display validation errors */}
                {errors.officeName && <p className="mt-1 text-sm text-red-600">{errors.officeName.message}</p>}
            </div>
            <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                <input
                    id="address"
                    type="text"
                    {...register('address')}
                    className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    disabled={isSubmitting}
                />
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
            </div>
            <div className="flex items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    {isSubmitting ? 'Saving...' : (mode === 'create' ? 'Create Office' : 'Save Changes')}
                </button>
                <Link to="/offices" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    Cancel
                </Link>
            </div>
        </form>
    );
};