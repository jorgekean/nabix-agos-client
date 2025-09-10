import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { OfficeForm } from './components/OfficeForm';
import { useOffices } from './useOffices';
import { officeService, type Office } from './OfficeService';
import { type OfficeFormData } from './officeSchema';

export const OfficeEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { updateOffice } = useOffices();

    // State to hold the initial office data
    const [office, setOffice] = useState<Office | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const officeId = parseInt(id!, 10);
        if (isNaN(officeId)) {
            navigate('/offices'); // Or a 404 page
            return;
        }

        officeService.getOfficeById(officeId).then(data => {
            if (data) {
                setOffice(data);
            } else {
                alert('Office not found');
                navigate('/offices');
            }
            setIsLoading(false);
        });
    }, [id, navigate]);

    // The handleSubmit function now receives validated data from the form.
    const handleSubmit = async (data: OfficeFormData) => {
        // No need to manage isSaving state here; RHF handles it.
        await updateOffice({ officeID: office!.officeID, ...data });
        navigate('/offices');
    };

    if (isLoading) {
        return <div className="p-6">Loading office details...</div>;
    }

    return (
        <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
            <header>
                <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Offices
                </button>
                <h1 className="text-3xl font-bold text-gray-800">Edit Office</h1>
                <p className="mt-1 text-md text-gray-500">Update the details for "{office?.officeName}".</p>
            </header>

            <OfficeForm
                initialData={office!}
                onSubmit={handleSubmit}
                mode="edit"
            />
        </div>
    );
};