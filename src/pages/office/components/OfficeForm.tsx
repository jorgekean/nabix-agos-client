import React, { useState, useEffect, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { type Office } from '../OfficeService';

interface OfficeFormProps {
    initialData?: Omit<Office, 'officeID'>;
    onSubmit: (data: Omit<Office, 'officeID'>) => Promise<void>;
    isSaving: boolean;
    mode: 'create' | 'edit';
}

export const OfficeForm: React.FC<OfficeFormProps> = ({ initialData, onSubmit, isSaving, mode }) => {
    const [officeName, setOfficeName] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        if (initialData) {
            setOfficeName(initialData.officeName);
            setAddress(initialData.address || '');
        }
    }, [initialData]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit({ officeName, address });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
            <div>
                <label htmlFor="officeName" className="block text-sm font-medium text-gray-700">Office Name *</label>
                <input
                    id="officeName"
                    type="text"
                    value={officeName}
                    onChange={(e) => setOfficeName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 transition"
                    required
                    disabled={isSaving}
                />
            </div>
            <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 transition"
                    disabled={isSaving}
                />
            </div>
            <div className="flex items-center space-x-4 pt-2 border-t border-gray-200">
                <button type="submit" disabled={isSaving} className="inline-flex items-center justify-center px-4 py-2 bg-orange-600 text-white font-semibold rounded-md shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSaving ? 'Saving...' : (mode === 'create' ? 'Create Office' : 'Save Changes')}
                </button>
                <Link to="/offices" className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors">
                    Cancel
                </Link>
            </div>
        </form>
    );
};