import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { type DetailedStock, type StockTransaction, stockService } from '../../services/stockService';

export const SupplyHistoryPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [stockItem, setStockItem] = useState<DetailedStock | null>(null);
    const [transactions, setTransactions] = useState<StockTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const stockId = parseInt(id!, 10);
        if (isNaN(stockId)) {
            navigate('/supplies');
            return;
        }

        Promise.all([
            stockService.getDetailedStockLevels().then(items => items.find(i => i.stockID === stockId)),
            stockService.getTransactionsForStockItem(stockId)
        ]).then(([stockDetails, transactionLogs]) => {
            if (stockDetails) {
                setStockItem(stockDetails);
                setTransactions(transactionLogs);
            } else {
                alert('Stock item not found');
                navigate('/supplies');
            }
            setIsLoading(false);
        });
    }, [id, navigate]);

    if (isLoading) {
        return <div className="p-6">Loading supply history...</div>;
    }

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
            <header>
                <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-4 dark:text-gray-400 dark:hover:text-white">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Supplies
                </button>
                <h1 className="text-3xl font-bold">Supply History</h1>
                <p className="mt-1 text-md text-gray-500">Transaction log for: {stockItem?.catalogItem.name} at {stockItem?.office.officeName}</p>
            </header>

            {/* Current Stock Details Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Current Stock Level</h2>
                <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-500">Quantity On Hand:</span>
                    <span className="text-2xl font-bold text-primary-600">{stockItem?.quantityOnHand}</span>
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
                                            <p className="font-medium text-gray-900 dark:text-white">{item.action}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                Quantity Change: <span className="font-medium">{item.action.includes('Increase') || item.action.includes('Added') ? `+${item.quantityChange}` : `-${item.quantityChange}`}</span>
                                            </p>
                                            {item.notes && <p className="mt-1 text-sm text-gray-500">Notes: "{item.notes}"</p>}
                                            <div className="mt-2 text-xs text-gray-500">
                                                <time dateTime={item.timestamp}>{new Date(item.timestamp).toLocaleString()}</time>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {transactions.length === 0 && <p className="text-sm text-gray-500">No transaction history found for this item.</p>}
                </div>
            </div>
        </div>
    );
};