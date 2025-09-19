import React from 'react';
import { Employee } from '../types';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-secondary rounded-lg shadow">
      <table className="min-w-full divide-y divide-accent">
        <thead className="bg-accent">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Position
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Department
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-secondary divide-y divide-accent">
          {employees.map((employee) => (
            <tr key={employee.id} className="hover:bg-accent transition-colors duration-200">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-text-primary">{employee.name}</div>
                <div className="text-sm text-text-secondary">{employee.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{employee.position}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{employee.department}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onClick={() => onEdit(employee)} className="text-highlight hover:text-teal-300 mr-4 transition">
                  <EditIcon className="w-5 h-5"/>
                </button>
                <button onClick={() => onDelete(employee.id)} className="text-red-500 hover:text-red-400 transition">
                  <TrashIcon className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;