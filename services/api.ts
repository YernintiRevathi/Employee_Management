import { Employee, NewEmployee } from '../types';

// This file mocks a backend API for the Employee Management System.
// It uses localStorage to persist data across browser sessions.

const MOCK_EMPLOYEES_KEY = 'mock_employees';
const SIMULATED_DELAY_MS = 500;

// Default data to populate if localStorage is empty
const initialEmployees: Employee[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice.j@example.com', position: 'Software Engineer', department: 'Technology' },
  { id: '2', name: 'Bob Williams', email: 'bob.w@example.com', position: 'Project Manager', department: 'Management' },
  { id: '3', name: 'Charlie Brown', email: 'charlie.b@example.com', position: 'UX Designer', department: 'Design' },
  { id: '4', name: 'Diana Prince', email: 'diana.p@example.com', position: 'QA Tester', department: 'Technology' },
  { id: '5', name: 'Ethan Hunt', email: 'ethan.h@example.com', position: 'DevOps Specialist', department: 'Operations' },
];

const getStoredEmployees = (): Employee[] => {
  try {
    const stored = localStorage.getItem(MOCK_EMPLOYEES_KEY);
    if (stored) {
      return JSON.parse(stored);
    } else {
      // First time load, initialize with default data
      localStorage.setItem(MOCK_EMPLOYEES_KEY, JSON.stringify(initialEmployees));
      return initialEmployees;
    }
  } catch (error) {
    console.error("Failed to access localStorage:", error);
    return initialEmployees;
  }
};

const setStoredEmployees = (employees: Employee[]) => {
  try {
    localStorage.setItem(MOCK_EMPLOYEES_KEY, JSON.stringify(employees));
  } catch (error) {
    console.error("Failed to access localStorage:", error);
  }
};

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- Mock API Functions ---

/**
 * Simulates user login.
 * @param username - The username.
 * @param password - The password.
 * @returns A promise that resolves with a fake JWT token on success.
 */
export const login = async (username: string, password: string): Promise<{ token: string }> => {
  await simulateDelay(SIMULATED_DELAY_MS);
  if (username === 'admin' && password === 'password') {
    // Simulate a JWT token
    const token = 'fake-jwt-token.' + btoa(JSON.stringify({ user: 'admin', exp: Date.now() + 3600 * 1000 })) + '.signature';
    return Promise.resolve({ token });
  } else {
    return Promise.reject(new Error('Invalid username or password.'));
  }
};

/**
 * Fetches all employees.
 * @param token - The authentication token.
 * @returns A promise that resolves with the list of employees.
 */
export const getEmployees = async (token: string): Promise<Employee[]> => {
  await simulateDelay(SIMULATED_DELAY_MS + 300); // Slower for effect
  if (!token) return Promise.reject(new Error('Authentication required.'));
  return Promise.resolve(getStoredEmployees());
};

/**
 * Adds a new employee.
 * @param token - The authentication token.
 * @param employeeData - The data for the new employee.
 * @returns A promise that resolves with the newly created employee.
 */
export const addEmployee = async (token: string, employeeData: NewEmployee): Promise<Employee> => {
  await simulateDelay(SIMULATED_DELAY_MS);
  if (!token) return Promise.reject(new Error('Authentication required.'));
  
  const employees = getStoredEmployees();
  const newEmployee: Employee = {
    ...employeeData,
    id: String(Date.now() + Math.random()), // Simple unique ID generator
  };
  const updatedEmployees = [...employees, newEmployee];
  setStoredEmployees(updatedEmployees);
  
  return Promise.resolve(newEmployee);
};

/**
 * Updates an existing employee.
 * @param token - The authentication token.
 * @param id - The ID of the employee to update.
 * @param employeeData - The updated employee data.
 * @returns A promise that resolves with the updated employee.
 */
export const updateEmployee = async (token: string, id: string, employeeData: Employee): Promise<Employee> => {
  await simulateDelay(SIMULATED_DELAY_MS);
  if (!token) return Promise.reject(new Error('Authentication required.'));
  
  const employees = getStoredEmployees();
  const employeeIndex = employees.findIndex(emp => emp.id === id);

  if (employeeIndex === -1) {
    return Promise.reject(new Error('Employee not found.'));
  }

  const updatedEmployees = employees.map(emp =>
    emp.id === id ? { ...emp, ...employeeData } : emp
  );

  setStoredEmployees(updatedEmployees);
  
  return Promise.resolve(updatedEmployees[employeeIndex]);
};


/**
 * Deletes an employee.
 * @param token - The authentication token.
 * @param id - The ID of the employee to delete.
 * @returns A promise that resolves when the employee is deleted.
 */
export const deleteEmployee = async (token: string, id: string): Promise<void> => {
  await simulateDelay(SIMULATED_DELAY_MS);
  if (!token) return Promise.reject(new Error('Authentication required.'));

  let employees = getStoredEmployees();
  const updatedEmployees = employees.filter(emp => emp.id !== id);
  
  if (employees.length === updatedEmployees.length) {
    // This case could happen if the ID doesn't exist, but we can fail silently.
  }

  setStoredEmployees(updatedEmployees);
  return Promise.resolve();
};
