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
import { useToast } from '../hooks/useToast';
import ConfirmModal from '../components/ConfirmModal';

const DashboardPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  const { token } = useAuth();
  const { showToast } = useToast();

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      if(token) {
        const data = await getEmployees(token);
        setEmployees(data);
      }
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  }, [token, showToast]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const openAddModal = () => {
    setEditingEmployee(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setEditingEmployee(null);
  };
  
  const openDeleteModal = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setEmployeeToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleFormSubmit = async (employeeData: NewEmployee | Employee) => {
    if (!token) {
      showToast("Authentication error. Please log in again.", 'error');
      return;
    }

    try {
      if ('id' in employeeData && employeeData.id) {
        await updateEmployee(token, employeeData.id, employeeData);
        showToast('Employee updated successfully!', 'success');
      } else {
        await addEmployee(token, employeeData as NewEmployee);
        showToast('Employee added successfully!', 'success');
      }
      closeFormModal();
      fetchEmployees();
    } catch (err) {
      showToast((err as Error).message, 'error');
    }
  };
  
  const confirmDelete = async () => {
    if (!token || !employeeToDelete) {
      showToast("An error occurred. Please try again.", 'error');
      return;
    }
    
    try {
      await deleteEmployee(token, employeeToDelete.id);
      showToast('Employee deleted successfully.', 'success');
      fetchEmployees();
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      closeDeleteModal();
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
    if (employees.length === 0) {
      return <p className="text-center text-text-secondary mt-8">No employees found. Add one to get started!</p>;
    }
    if (filteredEmployees.length === 0 && searchTerm) {
      return <p className="text-center text-text-secondary mt-8">No employees found matching "{searchTerm}".</p>;
    }
    return <EmployeeTable employees={filteredEmployees} onEdit={openEditModal} onDelete={openDeleteModal} />;
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
      <Modal isOpen={isFormModalOpen} onClose={closeFormModal} title={editingEmployee ? 'Edit Employee' : 'Add New Employee'}>
        <EmployeeForm 
          onSubmit={handleFormSubmit}
          initialData={editingEmployee}
          onCancel={closeFormModal}
        />
      </Modal>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${employeeToDelete?.name}? This action cannot be undone.`}
      />
    </>
  );
};

export default DashboardPage;