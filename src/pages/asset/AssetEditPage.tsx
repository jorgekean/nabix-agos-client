import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { type AssetFormData } from './assetSchema';
import { assetService, type Asset } from './AssetService';
import { AssetForm } from './components/AssetForm';

export const AssetEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [asset, setAsset] = useState<Asset | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const assetId = parseInt(id!, 10);
        if (isNaN(assetId)) {
            navigate('/assets');
            return;
        }
        assetService.getAssetById(assetId).then(data => {
            if (data) {
                setAsset(data);
            } else {
                alert('Asset not found');
                navigate('/assets');
            }
            setIsLoading(false);
        });
    }, [id, navigate]);

    const handleSubmit = async (data: AssetFormData) => {
        const payload = {
            ...data,
            quantity: data.type === 'Equipment' ? 1 : data.quantity,
        };
        await assetService.updateAsset({ assetID: asset!.assetID, ...payload });
        navigate('/assets');
    };

    if (isLoading) {
        return <div className="p-6 text-gray-700 dark:text-gray-300">Loading asset details...</div>;
    }

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
            <header>
                <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-4 dark:text-gray-400 dark:hover:text-white">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Assets
                </button>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Edit Asset</h1>
                <p className="mt-1 text-md text-gray-500 dark:text-gray-400">Update the details for "{asset?.name}".</p>
            </header>
            <AssetForm
                initialData={asset!}
                onSubmit={handleSubmit}
                mode="edit"
            />
        </div>
    );
};