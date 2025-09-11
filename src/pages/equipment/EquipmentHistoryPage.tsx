import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { type AssetInstanceDetails, equipmentService } from '../../services/equipmentService';
import { type AssetTransaction, assetTransactionService } from '../../services/assetTransactionService';

export const EquipmentHistoryPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [instance, setInstance] = useState<AssetInstanceDetails | null>(null);
    const [transactions, setTransactions] = useState<AssetTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const instanceId = parseInt(id!, 10);
        if (isNaN(instanceId)) {
            navigate('/equipment');
            return;
        }

        // Fetch both the asset's details and its history concurrently
        Promise.all([
            equipmentService.getDetailedInstances().then(instances => instances.find(i => i.instanceID === instanceId)),
            assetTransactionService.getTransactionsForInstance(instanceId)
        ]).then(([instanceDetails, transactionLogs]) => {
            if (instanceDetails) {
                setInstance(instanceDetails);
                setTransactions(transactionLogs);
            } else {
                alert('Equipment not found');
                navigate('/equipment');
            }
            setIsLoading(false);
        });
    }, [id, navigate]);

    if (isLoading) {
        return <div className="p-6 text-gray-700 dark:text-gray-300">Loading equipment history...</div>;
    }

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
            <header>
                <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-4 dark:text-gray-400 dark:hover:text-white">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Equipment
                </button>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Equipment History</h1>
                <p className="mt-1 text-md text-gray-500 dark:text-gray-400">Complete lifecycle for: {instance?.catalogItem.name} ({instance?.propertyCode})</p>
            </header>

            {/* Equipment Details Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Current Details</h2>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="font-medium text-gray-500">Property Code:</div> <div>{instance?.propertyCode}</div>
                    <div className="font-medium text-gray-500">Serial Number:</div> <div>{instance?.serialNumber || 'N/A'}</div>
                    <div className="font-medium text-gray-500">Status:</div> <div><span className="font-semibold text-primary-600">{instance?.status}</span></div>
                    <div className="font-medium text-gray-500">Current Office:</div> <div>{instance?.office.officeName}</div>
                    <div className="font-medium text-gray-500">Assigned To:</div> <div>{instance?.employee ? `${instance.employee.firstName} ${instance.employee.lastName}` : 'Unassigned'}</div>
                    <div className="font-medium text-gray-500">Specific Location:</div> <div>{instance?.specificLocation || 'N/A'}</div>
                </div>
            </div>

            {/* History Timeline */}
            <div>
                <h2 className="text-xl font-semibold my-6">Timeline</h2>
                <div className="flow-root">
                    <ul className="-mb-8">
                        {transactions.map((item, index) => (
                            <li key={item.transactionID}>
                                <div className="relative pb-8">
                                    {index !== transactions.length - 1 && <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true" />}
                                    <div className="relative flex items-start space-x-3">
                                        <div>
                                            <span className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center ring-8 ring-gray-100 dark:ring-gray-900">
                                                <Clock className="h-5 w-5 text-gray-500" />
                                            </span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div>
                                                <div className="text-sm">
                                                    <p className="font-medium text-gray-900 dark:text-white">{item.action}</p>
                                                </div>
                                                <p className="mt-0.5 text-sm text-gray-500">{item.notes}</p>
                                            </div>
                                            <div className="mt-2 text-sm text-gray-500">
                                                <time dateTime={item.timestamp}>{new Date(item.timestamp).toLocaleString()}</time>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {transactions.length === 0 && <p className="text-sm text-gray-500">No history found for this asset.</p>}
                </div>
            </div>

        </div>
    );
};