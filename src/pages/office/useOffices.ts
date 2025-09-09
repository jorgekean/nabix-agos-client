import { useState, useEffect, useCallback } from 'react';
import { officeService, type Office } from './OfficeService';

export const useOffices = () => {
  // State for the list of offices, loading, and errors
  const [offices, setOffices] = useState<Office[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch data, wrapped in useCallback for stability
  const fetchOffices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await officeService.getOffices();
      setOffices(data);
    } catch (err) {
      setError('Failed to fetch offices.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch when the hook is first used
  useEffect(() => {
    fetchOffices();
  }, [fetchOffices]);

  // Function to add an office
  const addOffice = async (officeData: Omit<Office, 'officeID'>) => {
    try {
      await officeService.addOffice(officeData);
      await fetchOffices(); // Refresh the list after adding
    } catch (err) {
      console.error('Failed to add office:', err);
      // Optionally, set an error state to show in the UI
    }
  };

  // Function to update an office
  const updateOffice = async (officeData: Office) => {
    try {
      await officeService.updateOffice(officeData);
      await fetchOffices(); // Refresh the list after updating
    } catch (err) {
      console.error('Failed to update office:', err);
    }
  };

  // Function to delete an office
  const deleteOffice = async (officeID: number) => {
    try {
      await officeService.deleteOffice(officeID);
      await fetchOffices(); // Refresh the list after deleting
    } catch (err) {
      console.error('Failed to delete office:', err);
    }
  };

  // Return the state and the action functions
  return {
    offices,
    isLoading,
    error,
    addOffice,
    updateOffice,
    deleteOffice,
  };
};