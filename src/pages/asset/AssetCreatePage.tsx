import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AssetForm } from './components/AssetForm';
import { assetService } from './AssetService';
import { type AssetFormData } from './assetSchema';

export const AssetCreatePage: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = async (data: AssetFormData) => {
        // The form returns quantity as a number, but if the type is Equipment, it should be 1.
        const payload = {
            ...data,
            quantity: data.type === 'Equipment' ? 1 : data.quantity,
        };
        await assetService.addAsset(payload);
        navigate('/assets'); // Navigate back to the list after creation
    };

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
            <header>
                <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-4 dark:text-gray-400 dark:hover:text-white">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Assets
                </button>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Add New Asset</h1>
                <p className="mt-1 text-md text-gray-500 dark:text-gray-400">Fill in the details below to register a new asset.</p>
            </header>
            <AssetForm onSubmit={handleSubmit} mode="create" />
        </div>
    );
};