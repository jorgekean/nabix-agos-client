import React from 'react'; // Removed useState
import { useNavigate } from 'react-router-dom';
import { OfficeForm } from './components/OfficeForm';
import { useOffices } from './useOffices';
import { type OfficeFormData } from './officeSchema';
import { ArrowLeft } from 'lucide-react';

export const OfficeCreatePage: React.FC = () => {
    const navigate = useNavigate();
    const { addOffice } = useOffices();
    // No longer need isSaving state

    const handleSubmit = async (data: OfficeFormData) => {
        await addOffice(data);
        navigate('/offices');
    };

    return (
        <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
            <header>
                <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Offices
                </button>
                <h1 className="text-3xl font-bold text-gray-800">Create New Office</h1>
                <p className="mt-1 text-md text-gray-500">Fill in the details below to add a new office location.</p>
            </header>
            {/* The isSaving prop is removed */}
            <OfficeForm onSubmit={handleSubmit} mode="create" />
        </div>
    );
};