import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AssetCatalogForm } from './components/AssetCatalogForm';
import { assetCatalogService } from '../../services/assetCatalogService';
import { type AssetCatalogFormData } from './assetCatalogSchema';

export const AssetCatalogCreatePage: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = async (data: AssetCatalogFormData) => {
        await assetCatalogService.addCatalogItem(data);
        navigate('/catalog'); // Navigate back to the list after creation
    };

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
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Add New Catalog Item</h1>
                <p className="mt-1 text-md text-gray-500 dark:text-gray-400">Define a new asset blueprint for tracking.</p>
            </header>
            <AssetCatalogForm onSubmit={handleSubmit} mode="create" />
        </div>
    );
};