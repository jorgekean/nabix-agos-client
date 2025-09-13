import { useState, useEffect } from 'react';
import { stockService, type DetailedStock } from '../services/stockService';

export const useStockLevels = () => {
    const [stockLevels, setStockLevels] = useState<DetailedStock[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        stockService.getDetailedStockLevels()
            .then(setStockLevels)
            .catch(() => setError("Failed to fetch stock levels."))
            .finally(() => setIsLoading(false));
    }, []);

    return { stockLevels, isLoading, error };
};