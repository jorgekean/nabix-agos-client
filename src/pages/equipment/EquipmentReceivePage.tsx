import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Plus, X } from 'lucide-react';

import { equipmentReceiveSchema, type EquipmentReceiveFormData } from './equipmentReceiveSchema';
import { useCatalog } from '../../hooks/useCatalog';
import { useOffices } from '../office/useOffices';

import { equipmentService } from '../../services/equipmentService';
import { receivingVoucherService } from '../../services/receivingVouchers';
import { useEmployees } from '../../hooks/useEmployee';

export const EquipmentReceivePage: React.FC = () => {
    const navigate = useNavigate();
    const { catalogItems } = useCatalog();
    const { offices } = useOffices();
    const { employees } = useEmployees();

    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<EquipmentReceiveFormData>({
        resolver: zodResolver(equipmentReceiveSchema) as any,
        defaultValues: {
            dateReceived: new Date().toISOString().split('T')[0],
            status: 'In Storage',
            instances: [],
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "instances",
    });

    const onSubmit: SubmitHandler<EquipmentReceiveFormData> = async (data) => {
        const voucher = await receivingVoucherService.addVoucher({
            supplier: data.supplier,
            referenceNumber: data.referenceNumber,
            dateReceived: data.dateReceived,
            receivedByEmployeeId: data.receivedByEmployeeId,
            notes: data.notes,
        });

        const instancePromises = data.instances.map(inst =>
            equipmentService.addInstance({
                catalogID: data.catalogID,
                propertyCode: inst.propertyCode,
                serialNumber: inst.serialNumber,
                status: data.status,
                currentOfficeId: data.currentOfficeId,
                assignedToEmployeeId: null,
                specificLocation: 'Storage',
                receivingVoucherID: voucher.voucherID!,
            })
        );

        await Promise.all(instancePromises);
        navigate('/equipment');
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
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Equipment
                </button>
                <h1 className="text-3xl font-bold">Receive New Equipment</h1>
                <p className="mt-1 text-md text-gray-500">Log a new batch of serialized assets into the system.</p>
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
                            <label htmlFor="referenceNumber" className={labelClasses}>Reference # (PO, Invoice)</label>
                            <input id="referenceNumber" {...register('referenceNumber')} className={`${inputBaseClasses} ${inputNormalClasses}`} />
                        </div>
                        <div>
                            <label htmlFor="receivedByEmployeeId" className="label">Received By</label>
                            <select id="receivedByEmployeeId" {...register('receivedByEmployeeId')} className={`${inputBaseClasses} ${errors.receivedByEmployeeId ? inputErrorClasses : inputNormalClasses}`}>
                                <option value="">Select an employee...</option>
                                {employees.map(emp => (
                                    <option key={emp.employeeID} value={emp.employeeID}>{emp.firstName} {emp.lastName}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="dateReceived" className={labelClasses}>Date Received *</label>
                            <input id="dateReceived" type="date" {...register('dateReceived')} className={`${inputBaseClasses} ${errors.dateReceived ? inputErrorClasses : inputNormalClasses}`} />
                            {errors.dateReceived && <p className={errorMessageClasses}>{errors.dateReceived.message}</p>}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="notes" className="label">Notes</label>
                        <textarea id="notes" {...register('notes')} rows={3} className={`${inputBaseClasses} ${errors.notes ? inputErrorClasses : inputNormalClasses}`} />
                    </div>
                </div>

                {/* Section 2: Asset and Location Details */}
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg space-y-4">
                    <h2 className="text-lg font-semibold">Asset Details (For All Items in Batch)</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="catalogID" className={labelClasses}>Asset Type *</label>
                            <select id="catalogID" {...register('catalogID')} className={`${inputBaseClasses} ${errors.catalogID ? inputErrorClasses : inputNormalClasses}`}>
                                <option value="">Select a type from catalog...</option>
                                {catalogItems.filter(i => i.type === 'Equipment').map(item => (
                                    <option key={item.catalogID} value={item.catalogID}>{item.name}</option>
                                ))}
                            </select>
                            {errors.catalogID && <p className={errorMessageClasses}>{errors.catalogID.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="currentOfficeId" className={labelClasses}>Initial Office Location *</label>
                            <select id="currentOfficeId" {...register('currentOfficeId')} className={`${inputBaseClasses} ${errors.currentOfficeId ? inputErrorClasses : inputNormalClasses}`}>
                                <option value="">Select an office...</option>
                                {offices.map(office => (
                                    <option key={office.officeID} value={office.officeID}>{office.officeName}</option>
                                ))}
                            </select>
                            {errors.currentOfficeId && <p className={errorMessageClasses}>{errors.currentOfficeId.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="status" className={labelClasses}>Initial Status *</label>
                            <select id="status" {...register('status')} className={`${inputBaseClasses} ${errors.status ? inputErrorClasses : inputNormalClasses}`}>
                                <option>In Storage</option>
                                <option>Ready to Deploy</option>
                            </select>
                            {errors.status && <p className={errorMessageClasses}>{errors.status.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Section 3: Dynamic Instance Fields */}
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Individual Items ({fields.length})</h2>
                        <button type="button" onClick={() => append({ propertyCode: '', serialNumber: '' })} className="inline-flex items-center px-3 py-2 bg-white dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-500 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                            <Plus className="h-4 w-4 mr-2" /> Add Item
                        </button>
                    </div>
                    {errors.instances && !errors.instances.root && <p className={errorMessageClasses}>{errors.instances.message}</p>}
                    {errors.instances?.root && <p className={errorMessageClasses}>{errors.instances.root.message}</p>}

                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {fields.map((field, index) => (
                            <div key={field.id} className="grid grid-cols-1 md:grid-cols-[1fr,1fr,auto] gap-4 items-end p-4 border rounded-md dark:border-gray-700">
                                <div>
                                    <label htmlFor={`instances.${index}.propertyCode`} className={`${labelClasses} text-xs`}>Property Code *</label>
                                    <input {...register(`instances.${index}.propertyCode`)} className={`${inputBaseClasses} ${errors.instances?.[index]?.propertyCode ? inputErrorClasses : inputNormalClasses}`} />
                                    {errors.instances?.[index]?.propertyCode && <p className={`${errorMessageClasses} text-xs`}>{errors.instances?.[index]?.propertyCode?.message}</p>}
                                </div>
                                <div>
                                    <label htmlFor={`instances.${index}.serialNumber`} className={`${labelClasses} text-xs`}>Serial Number</label>
                                    <input {...register(`instances.${index}.serialNumber`)} className={`${inputBaseClasses} ${inputNormalClasses}`} />
                                </div>
                                <button type="button" onClick={() => remove(index)} className="p-2 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-full transition-colors">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <Link to="/equipment" className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
                        Cancel
                    </Link>
                    <button type="submit" disabled={isSubmitting || fields.length === 0} className="btn-primary">
                        {isSubmitting ? 'Saving...' : `Receive ${fields.length} Item(s)`}
                    </button>
                </div>
            </form>
        </div>
    );
};