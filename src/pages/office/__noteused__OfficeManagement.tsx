import React, { useState, type FormEvent } from 'react';
import { type Office } from './OfficeService';
import { useOffices } from './useOffices';
// Import icons for a polished UI
import { Pencil, Trash2, PlusCircle, Building } from 'lucide-react';

export const OfficeManagement: React.FC = () => {
    // --- HOOKS ---
    // Custom hook handles all data fetching and state management logic
    const { offices, isLoading, addOffice, updateOffice, deleteOffice } = useOffices();

    // Local UI state for the form
    const [officeName, setOfficeName] = useState('');
    const [address, setAddress] = useState('');
    const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);

    // --- HANDLERS ---
    // Pre-fills the form for editing an existing office
    const handleEditClick = (office: Office) => {
        setSelectedOffice(office);
        setOfficeName(office.officeName);
        setAddress(office.address || '');
    };

    // Resets the form to its "add new" state
    const clearForm = () => {
        setSelectedOffice(null);
        setOfficeName('');
        setAddress('');
    };

    // Handles form submission for both creating and updating
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!officeName) return;

        if (selectedOffice?.officeID) {
            await updateOffice({ ...selectedOffice, officeName, address });
        } else {
            await addOffice({ officeName, address });
        }
        clearForm();
    };

    // Handles the deletion of an office
    const handleDelete = async (officeID: number) => {
        if (window.confirm('Are you sure you want to delete this office?')) {
            await deleteOffice(officeID);
            // If the deleted office was being edited, clear the form
            if (selectedOffice?.officeID === officeID) {
                clearForm();
            }
        }
    }

    // --- RENDER ---
    return (
        <div className="p-4 md:p-6 space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-gray-800">Office Management</h1>
                <p className="mt-1 text-md text-gray-500">Add, edit, and manage all company office locations.</p>
            </header>

            {/* Main content area with a responsive two-column layout */}
            <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0">

                {/* --- LEFT COLUMN: Form for Adding/Editing --- */}
                <div className="lg:w-1/3 w-full">
                    <div className="bg-white p-6 rounded-lg shadow-lg h-full">
                        <div className="flex items-center mb-4">
                            <Building className="h-6 w-6 mr-3 text-blue-600" />
                            <h2 className="text-xl font-semibold text-gray-700">
                                {selectedOffice ? 'Edit Office' : 'Add New Office'}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="officeName" className="block text-sm font-medium text-gray-700">Office Name *</label>
                                <input
                                    id="officeName"
                                    type="text"
                                    value={officeName}
                                    onChange={(e) => setOfficeName(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                                <input
                                    id="address"
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
                                />
                            </div>
                            <div className="flex items-center space-x-3 pt-2">
                                <button type="submit" className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                                    {selectedOffice ? 'Save Changes' : 'Add Office'}
                                </button>
                                {selectedOffice && (
                                    <button type="button" onClick={clearForm} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors">
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: Table of Existing Offices --- */}
                <div className="lg:w-2/3 w-full">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-700">Existing Offices</h2>
                            <button onClick={clearForm} className="inline-flex items-center px-3 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-700 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                                <PlusCircle className="h-5 w-5 mr-2 text-gray-500" />
                                Add New
                            </button>
                        </div>
                        {isLoading ? (
                            <p className="p-6 text-center text-gray-500">Loading offices...</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {offices.length > 0 ? offices.map((office) => (
                                            <tr key={office.officeID} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{office.officeName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{office.address || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                    <button onClick={() => handleEditClick(office)} className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded-full transition-colors">
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(office.officeID!)} className="p-2 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-full transition-colors">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={3} className="p-6 text-center text-gray-500">No offices found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};