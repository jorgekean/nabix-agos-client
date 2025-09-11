// src/pages/assets/AssetHistoryPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { assetService, type AssetWithDetails } from './AssetService';
import { historyService, type HistoryEntry } from './HistoryService';

export const AssetHistoryPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [asset, setAsset] = useState<AssetWithDetails | null>(null);
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const assetId = parseInt(id!, 10);
        if (isNaN(assetId)) {
            navigate('/assets');
            return;
        }

        Promise.all([
            assetService.getAssets().then(assets => assets.find(a => a.assetID === assetId)),
            historyService.getHistoryForAsset(assetId)
        ]).then(([assetDetails, historyLogs]) => {
            if (assetDetails) {
                setAsset(assetDetails);
                setHistory(historyLogs);
            } else {
                alert('Asset not found');
                navigate('/assets');
            }
            setIsLoading(false);
        });
    }, [id, navigate]);

    if (isLoading) {
        return <div className="p-6">Loading asset history...</div>;
    }

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
            <header>
                <button onClick={() => navigate(-1)} className="btn-secondary-responsive mb-4">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Assets
                </button>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Asset History</h1>
                <p className="mt-1 text-md text-gray-500 dark:text-gray-400">Complete lifecycle for: {asset?.name}</p>
            </header>

            {/* Asset Details Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Current Status</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="font-medium text-gray-500">Property Code:</div> <div>{asset?.propertyCode}</div>
                    <div className="font-medium text-gray-500">Status:</div> <div><span className="font-semibold text-primary-600">{asset?.status}</span></div>
                    <div className="font-medium text-gray-500">Current Office:</div> <div>{asset?.officeName}</div>
                    <div className="font-medium text-gray-500">Assigned To:</div> <div>{asset?.assignedToEmployeeName}</div>
                </div>
            </div>

            {/* History Timeline */}
            <div>
                <h2 className="text-xl font-semibold my-4">Timeline</h2>
                <div className="flow-root">
                    <ul className="-mb-8">
                        {history.map((item, index) => (
                            <li key={item.historyID}>
                                <div className="relative pb-8">
                                    {index !== history.length - 1 && <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true" />}
                                    <div className="relative flex items-center space-x-3">
                                        <div>
                                            <span className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                                                <Clock className="h-5 w-5 text-gray-500" />
                                            </span>
                                        </div>
                                        <div className="flex min-w-0 flex-1 justify-between space-x-4">
                                            <div>
                                                <p className="text-sm text-gray-700 dark:text-gray-200">{item.notes}</p>
                                                <p className="font-medium text-gray-900 dark:text-white">{item.action}</p>
                                            </div>
                                            <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                                <time dateTime={item.timestamp}>{new Date(item.timestamp).toLocaleDateString()}</time>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};