import React, { useState, useEffect, useCallback } from 'react';
import { Employee, NewEmployee } from '../types';
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from '../services/api';
import Header from '../components/Header';
import EmployeeTable from '../components/EmployeeTable';
import Modal from '../components/Modal';
import EmployeeForm from '../components/EmployeeForm';
import Spinner from '../components/Spinner';
import PlusIcon from '../components/icons/PlusIcon';
import SearchIcon from '../components/icons/SearchIcon';
import { useAuth } from '../hooks/useAuth';


const DashboardPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { token } = useAuth();

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if(token) {
        const data = await getEmployees(token);
        setEmployees(data);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const openAddModal = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const openEditModal = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleFormSubmit = async (employeeData: NewEmployee | Employee) => {
    if (!token) {
      setError("Authentication error. Please log in again.");
      return;
    }

    try {
      if ('id' in employeeData && employeeData.id) {
        await updateEmployee(token, employeeData.id, employeeData);
      } else {
        await addEmployee(token, employeeData as NewEmployee);
      }
      closeModal();
      fetchEmployees(); // Refetch employees to show changes
    } catch (err) {
      setError((err as Error).message);
    }
  };
  
  const handleDelete = async (employeeId: string) => {
    if (!token) {
      setError("Authentication error. Please log in again.");
      return;
    }
    if(window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(token, employeeId);
        fetchEmployees();
      } catch (err) {
        setError((err as Error).message);
      }
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const term = searchTerm.toLowerCase();
    return (
        employee.name.toLowerCase().includes(term) ||
        employee.email.toLowerCase().includes(term) ||
        employee.position.toLowerCase().includes(term) ||
        employee.department.toLowerCase().includes(term)
    );
  });

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      );
    }
    if (error) {
      return <div className="text-center text-red-400 bg-red-900/20 p-4 rounded-lg">{error}</div>;
    }
    if (employees.length === 0) {
      return <p className="text-center text-text-secondary mt-8">No employees found. Add one to get started!</p>;
    }
    if (filteredEmployees.length === 0) {
      return <p className="text-center text-text-secondary mt-8">No employees found matching "{searchTerm}".</p>;
    }
    return <EmployeeTable employees={filteredEmployees} onEdit={openEditModal} onDelete={handleDelete} />;
  };


  return (
    <>
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-text-primary">Employee Roster</h1>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 bg-highlight hover:bg-teal-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
            >
              <PlusIcon className="w-5 h-5" />
              Add Employee
            </button>
          </div>

          <div className="mb-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="search"
              placeholder="Search by name, email, position, or department..."
              className="w-full pl-10 pr-4 py-2 text-text-primary bg-accent border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight focus:border-transparent transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search employees"
            />
          </div>
          
          {renderContent()}
        </div>
      </main>
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingEmployee ? 'Edit Employee' : 'Add New Employee'}>
        <EmployeeForm 
          onSubmit={handleFormSubmit}
          initialData={editingEmployee}
          onCancel={closeModal}
        />
      </Modal>
    </>
  );
};

export default DashboardPage;