import { useState, useEffect } from 'react';
import type { EmployeeWithOffice } from '../pages/employee/EmployeeService';
import { employeeService } from '../pages/employee/EmployeeService';

export const useEmployees = () => {
    const [employees, setEmployees] = useState<EmployeeWithOffice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        employeeService.getEmployees()
            .then(setEmployees)
            .catch(() => setError("Failed to fetch employees."))
            .finally(() => setIsLoading(false));
    }, []);

    return { employees, isLoading, error };
};