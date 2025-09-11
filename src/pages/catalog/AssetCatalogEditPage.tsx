import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AssetCatalogForm } from './components/AssetCatalogForm';
import { assetCatalogService, type CatalogItem } from '../../services/assetCatalogService';
import { type AssetCatalogFormData } from './assetCatalogSchema';

export const AssetCatalogEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [catalogItem, setCatalogItem] = useState<CatalogItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const catalogId = parseInt(id!, 10);
        if (isNaN(catalogId)) {
            navigate('/catalog');
            return;
        }

        assetCatalogService.getCatalogItemById(catalogId).then(data => {
            if (data) {
                setCatalogItem(data);
            } else {
                alert('Catalog item not found');
                navigate('/catalog');
            }
            setIsLoading(false);
        });
    }, [id, navigate]);

    const handleSubmit = async (data: AssetCatalogFormData) => {
        await assetCatalogService.updateCatalogItem({ catalogID: catalogItem!.catalogID, ...data });
        navigate('/catalog');
    };

    if (isLoading) {
        return <div className="p-6 text-gray-700 dark:text-gray-300">Loading catalog item...</div>;
    }

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
            <header>
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-4 dark:text-gray-400 dark:hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Asset Catalog
                </button>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Edit Catalog Item</h1>
                <p className="mt-1 text-md text-gray-500 dark:text-gray-400">Update the details for "{catalogItem?.name}".</p>
            </header>

            <AssetCatalogForm
                initialData={catalogItem!}
                onSubmit={handleSubmit}
                mode="edit"
            />
        </div>
    );
};