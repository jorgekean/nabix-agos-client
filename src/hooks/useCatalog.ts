import { useState, useEffect } from 'react';
import { assetCatalogService, type CatalogItem } from '../services/assetCatalogService';

export const useCatalog = () => {
    const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        assetCatalogService.getCatalogItems()
            .then(setCatalogItems)
            .catch(() => setError("Failed to fetch asset catalog."))
            .finally(() => setIsLoading(false));
    }, []);

    return { catalogItems, isLoading, error };
};