
import React, { useState, useEffect } from 'react';
import { Employee, NewEmployee } from '../types';

interface EmployeeFormProps {
  onSubmit: (employee: NewEmployee | Employee) => void;
  initialData?: Employee | null;
  onCancel: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState<NewEmployee | Employee>({
    name: '',
    email: '',
    position: '',
    department: '',
    ...(initialData || {})
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ name: '', email: '', position: '', department: '' });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Full Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full bg-accent border border-gray-600 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-highlight focus:border-highlight sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-secondary">Email Address</label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1 block w-full bg-accent border border-gray-600 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-highlight focus:border-highlight sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="position" className="block text-sm font-medium text-text-secondary">Position</label>
        <input
          type="text"
          name="position"
          id="position"
          value={formData.position}
          onChange={handleChange}
          required
          className="mt-1 block w-full bg-accent border border-gray-600 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-highlight focus:border-highlight sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="department" className="block text-sm font-medium text-text-secondary">Department</label>
        <input
          type="text"
          name="department"
          id="department"
          value={formData.department}
          onChange={handleChange}
          required
          className="mt-1 block w-full bg-accent border border-gray-600 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-highlight focus:border-highlight sm:text-sm"
        />
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="py-2 px-4 bg-accent hover:bg-gray-600 text-text-primary font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="py-2 px-4 bg-highlight hover:bg-teal-500 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors"
        >
          {initialData ? 'Save Changes' : 'Add Employee'}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
