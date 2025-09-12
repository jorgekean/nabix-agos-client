import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { equipmentEditSchema, type EquipmentEditFormData } from './equipmentEditSchema';
import { equipmentService, type AssetInstance } from '../../services/equipmentService';
import { useOffices } from '../office/useOffices';
import { useCatalog } from '../../hooks/useCatalog';
import { useEmployees } from '../../hooks/useEmployee';
import { FaComputer } from 'react-icons/fa6';

export const EquipmentEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [instance, setInstance] = useState<AssetInstance | null>(null);
    const { offices, isLoading: officesLoading } = useOffices();
    const { employees, isLoading: employeesLoading } = useEmployees();
    const { catalogItems } = useCatalog();

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<EquipmentEditFormData>({
        resolver: zodResolver(equipmentEditSchema) as any,
    });

    useEffect(() => {
        const instanceId = parseInt(id!, 10);
        if (isNaN(instanceId)) {
            navigate('/equipment');
            return;
        }

        // Fetch the specific instance data
        equipmentService.getInstanceById(instanceId).then(data => {
            if (data) {
                setInstance(data);

                // We only reset the form IF the dropdown data is also ready
                if (!officesLoading && !employeesLoading) {
                    const transformedData = {
                        ...data,
                        currentOfficeId: String(data.currentOfficeId || ''),
                        assignedToEmployeeId: String(data.assignedToEmployeeId || ''),
                    };
                    reset(transformedData as any);
                }
            } else {
                alert('Equipment instance not found');
                navigate('/equipment');
            }
        });
        // Add the loading states to the dependency array
    }, [id, navigate, reset, officesLoading, employeesLoading]);

    const onSubmit: SubmitHandler<EquipmentEditFormData> = async (formData) => {
        const updatedInstance = { ...instance!, ...formData };
        await equipmentService.updateInstance(updatedInstance);
        navigate('/equipment');
    };

    const catalogItemName = catalogItems.find(c => c.catalogID === instance?.catalogID)?.name || '...';

    // Define standard class strings to keep JSX clean
    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";
    const inputBaseClasses = "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm transition focus:outline-none focus:ring-2";
    const inputNormalClasses = "border-gray-300 focus:ring-primary-500 focus:border-primary-500";
    const inputErrorClasses = "border-red-500 focus:ring-red-500 focus:border-red-500";
    const disabledInputClasses = "mt-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 cursor-not-allowed";
    const errorMessageClasses = "mt-1 text-sm text-red-600";

    if (!instance) {
        return <div className="p-6">Loading equipment details...</div>;
    }

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
            <header>
                <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-4 dark:text-gray-400 dark:hover:text-white">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Equipment
                </button>
                <h1 className="text-3xl font-bold">Edit Equipment</h1>
                <p className="mt-1 text-md text-gray-500">Update the status and assignment for: {catalogItemName} ({instance.propertyCode})</p>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-lg shadow-lg dark:bg-gray-800">
                {/* Section 1: Read-Only Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Identifying Information</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClasses}>Asset Name</label>
                            <input value={catalogItemName} disabled className={disabledInputClasses} />
                        </div>
                        <div>
                            <label className={labelClasses}>Property Code</label>
                            <input value={instance.propertyCode} disabled className={disabledInputClasses} />
                        </div>
                        <div>
                            <label className={labelClasses}>Serial Number</label>
                            <input value={instance.serialNumber || 'N/A'} disabled className={disabledInputClasses} />
                        </div>
                    </div>
                </div>

                {/* Section 2: Editable Fields */}
                <div className="space-y-4 pt-4 border-t border-gray-600">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Status & Assignment</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="status" className={labelClasses}>Status *</label>
                            <select id="status" {...register('status')} className={`${inputBaseClasses} ${errors.status ? inputErrorClasses : inputNormalClasses}`}>
                                <option>In Storage</option>
                                <option>Issued</option>
                                <option>Transferred</option>
                                <option>Returned</option>
                                <option>Disposed</option>
                            </select>
                            {errors.status && <p className={errorMessageClasses}>{errors.status.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="currentOfficeId" className={labelClasses}>Current Office *</label>
                            <select id="currentOfficeId" {...register('currentOfficeId')} className={`${inputBaseClasses} ${errors.currentOfficeId ? inputErrorClasses : inputNormalClasses}`}>
                                <option value="">Select an office...</option>
                                {offices.map(office => (
                                    <option key={office.officeID} value={office.officeID}>{office.officeName}</option>
                                ))}
                            </select>
                            {errors.currentOfficeId && <p className={errorMessageClasses}>{errors.currentOfficeId.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="assignedToEmployeeId" className={labelClasses}>Assigned To Employee</label>
                            <select id="assignedToEmployeeId" {...register('assignedToEmployeeId')} className={`${inputBaseClasses} ${inputNormalClasses}`}>
                                <option value="">Unassigned / In Storage</option>
                                {employees.map(e => <option key={e.employeeID} value={e.employeeID}>{e.firstName} {e.lastName}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="specificLocation" className={labelClasses}>Specific Location (e.g., Desk #)</label>
                            <input id="specificLocation" type="text" {...register('specificLocation')} className={`${inputBaseClasses} ${inputNormalClasses}`} />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                    <Link to="/equipment" className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
                        Cancel
                    </Link>
                    <button type="submit" disabled={isSubmitting} className="btn-primary">
                        <FaComputer className="h-5 w-5 mr-2" />
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};