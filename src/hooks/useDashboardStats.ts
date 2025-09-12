import { useState, useEffect } from 'react';
import { equipmentService, type AssetInstanceDetails } from '../services/equipmentService';
import { stockService, type DetailedStock } from '../services/stockService';
import { assetTransactionService, type AssetTransaction } from '../services/assetTransactionService';

// Add a getRecentTransactions function to your assetTransactionService.ts
// export const assetTransactionService = {
//   ...
//   async getRecentTransactions(limit = 5): Promise<AssetTransaction[]> {
//     const all = await this.getTransactionsForInstance(undefined as any); // A bit of a hack for our mock service
//     return all.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, limit);
//   }
// }


export const useDashboardStats = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<any>({}); // Use a more specific type in a real app

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            const [instances, stockLevels, recentActivity] = await Promise.all([
                equipmentService.getDetailedInstances(),
                stockService.getDetailedStockLevels(),
                assetTransactionService.getRecentTransactions(5) // Assuming you add this function
            ]);

            // --- Process Data ---
            // 1. Stat Cards
            const totalEquipment = instances.length;
            const assetsInStorage = instances.filter(i => i.status === 'In Storage' || i.status === 'Ready to Deploy').length;
            const suppliesInStock = [...new Set(stockLevels.map(s => s.catalogID))].length;

            // 2. Low Stock Alerts
            const lowStockAlerts = stockLevels.filter(s => s.quantityOnHand < 10); // Threshold of 10

            // 3. Equipment by Office Chart Data
            const equipmentByOffice = instances.reduce((acc, instance) => {
                const officeName = instance.office.officeName;
                acc[officeName] = (acc[officeName] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            const chartData = Object.entries(equipmentByOffice).map(([name, count]) => ({ name, count }));

            setStats({
                totalEquipment,
                assetsInStorage,
                suppliesInStock,
                lowStockAlerts,
                chartData,
                recentActivity,
            });
            setIsLoading(false);
        };

        fetchStats();
    }, []);

    return { stats, isLoading };
};