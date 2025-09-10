import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { type EmployeeFormData } from './employeeSchema';
import { employeeService, type Employee } from './EmployeeService';
import { EmployeeForm } from './components/EmployeeForm';

export const EmployeeEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // State to hold the initial employee data
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch the specific employee's data when the component loads
    useEffect(() => {
        const employeeId = parseInt(id!, 10);
        if (isNaN(employeeId)) {
            navigate('/employees'); // Or a 404 page
            return;
        }

        employeeService.getEmployeeById(employeeId).then(data => {
            if (data) {
                setEmployee(data);
            } else {
                alert('Employee not found');
                navigate('/employees');
            }
            setIsLoading(false);
        });
    }, [id, navigate]);

    // Handle the form submission for updating the employee
    const handleSubmit = async (data: EmployeeFormData) => {
        await employeeService.updateEmployee({ employeeID: employee!.employeeID, ...data });
        navigate('/employees');
    };

    if (isLoading) {
        return <div className="p-6 text-gray-700 dark:text-gray-300">Loading employee details...</div>;
    }

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
            <header>
                <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-4 dark:text-gray-400 dark:hover:text-white">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Employees
                </button>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Edit Employee</h1>
                <p className="mt-1 text-md text-gray-500 dark:text-gray-400">Update the details for {employee?.firstName} {employee?.lastName}.</p>
            </header>

            <EmployeeForm
                initialData={employee!}
                onSubmit={handleSubmit}
                mode="edit"
            />
        </div>
    );
};