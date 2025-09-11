import React from 'react';
import { Link } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeSchema, type EmployeeFormData } from '../employeeSchema';
import { useOffices } from '../../office/useOffices';
import { UserPlus2Icon } from 'lucide-react';

interface EmployeeFormProps {
    initialData?: EmployeeFormData;
    onSubmit: SubmitHandler<EmployeeFormData>;
    mode: 'create' | 'edit';
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({ initialData, onSubmit, mode }) => {
    const { offices, isLoading: officesLoading } = useOffices();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<EmployeeFormData>({
        resolver: zodResolver(employeeSchema) as any,
        defaultValues: initialData,
    });

    React.useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-lg shadow-lg dark:bg-gray-800">
            {/* First Name */}
            <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name *</label>
                <input
                    id="firstName"
                    type="text"
                    {...register('firstName')}
                    disabled={isSubmitting}
                    className={`block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ${errors.firstName ? 'border-red-500' : ''}`}
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
            </div>

            {/* Last Name */}
            <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name *</label>
                <input
                    id="lastName"
                    type="text"
                    {...register('lastName')}
                    disabled={isSubmitting}
                    className={`block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ${errors.lastName ? 'border-red-500' : ''}`}
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
            </div>

            {/* Email */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label>
                <input
                    id="email"
                    type="email"
                    {...register('email')}
                    disabled={isSubmitting}
                    className={`block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            {/* Office Dropdown */}
            <div>
                <label htmlFor="currentOfficeId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Office</label>
                <select
                    id="currentOfficeId"
                    {...register('currentOfficeId')}
                    disabled={isSubmitting || officesLoading}
                    className={`block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ${errors.currentOfficeId ? 'border-red-500' : ''}`}
                >
                    <option value="">Unassigned</option>
                    {offices.map(office => (
                        <option key={office.officeID} value={office.officeID}>{office.officeName}</option>
                    ))}
                </select>
                {errors.currentOfficeId && <p className="mt-1 text-sm text-red-600">{errors.currentOfficeId.message}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <Link
                    to="/employees"
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary"
                >
                    <UserPlus2Icon className="h-5 w-5 mr-2" />
                    {isSubmitting ? 'Saving...' : (mode === 'create' ? 'Create Employee' : 'Save Changes')}
                </button>
            </div>
        </form>
    );
};