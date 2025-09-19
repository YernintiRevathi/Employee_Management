import { v4 as uuidv4 } from 'uuid';
import { Employee, NewEmployee } from '../types';

// --- MOCK DATABASE ---
// This mock implementation uses localStorage to simulate a persistent database.
// In a real application, this entire file would be replaced with actual API calls to a backend server.

const FAKE_LATENCY = 500; // 500ms delay to simulate network

let employees: Employee[] = [];

// Function to load employees from localStorage
const loadEmployeesFromStorage = () => {
  try {
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
      employees = JSON.parse(storedEmployees);
    } else {
      // Initialize with default data if nothing is in storage
      employees = [
        { id: '1', name: 'Alice Johnson', email: 'alice.j@example.com', position: 'Software Engineer', department: 'Technology' },
        { id: '2', name: 'Bob Williams', email: 'bob.w@example.com', position: 'Project Manager', department: 'Management' },
        { id: '3', name: 'Charlie Brown', email: 'charlie.b@example.com', position: 'UI/UX Designer', department: 'Design' },
        { id: '4', name: 'Diana Prince', email: 'diana.p@example.com', position: 'HR Specialist', department: 'Human Resources' },
      ];
      saveEmployeesToStorage();
    }
  } catch (error) {
    console.error("Failed to access or parse localStorage:", error);
  }
};

// Function to save employees to localStorage
const saveEmployeesToStorage = () => {
  try {
    localStorage.setItem('employees', JSON.stringify(employees));
  } catch (error) {
    console.error("Failed to access localStorage:", error);
  }
};

// Initial load
loadEmployeesFromStorage();


// --- MOCK API FUNCTIONS ---

export const login = (username: string, password: string): Promise<{ token: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a real authentication check
      if (username === 'admin' && password === 'password') {
        // In a real app, the server would return a JWT. Here we simulate one.
        const fakeToken = 'fake-jwt-token.' + btoa(JSON.stringify({ user: 'admin', exp: Date.now() + 3600000 }));
        resolve({ token: fakeToken });
      } else {
        reject(new Error('Invalid username or password'));
      }
    }, FAKE_LATENCY);
  });
};

export const getEmployees = (token: string): Promise<Employee[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!token) return reject(new Error('Authentication required.'));
      // In a real app, the token would be validated on the server.
      resolve([...employees]); // Return a copy
    }, FAKE_LATENCY);
  });
};

export const addEmployee = (token: string, employeeData: NewEmployee): Promise<Employee> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!token) return reject(new Error('Authentication required.'));
      const newEmployee: Employee = {
        id: uuidv4(),
        ...employeeData,
      };
      employees.push(newEmployee);
      saveEmployeesToStorage();
      resolve(newEmployee);
    }, FAKE_LATENCY);
  });
};

export const updateEmployee = (token: string, id: string, employeeData: Employee): Promise<Employee> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!token) return reject(new Error('Authentication required.'));
      const index = employees.findIndex(e => e.id === id);
      if (index !== -1) {
        employees[index] = { ...employees[index], ...employeeData };
        saveEmployeesToStorage();
        resolve(employees[index]);
      } else {
        reject(new Error('Employee not found'));
      }
    }, FAKE_LATENCY);
  });
};

export const deleteEmployee = (token: string, id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!token) return reject(new Error('Authentication required.'));
      const initialLength = employees.length;
      employees = employees.filter(e => e.id !== id);
      if (employees.length < initialLength) {
        saveEmployeesToStorage();
        resolve();
      } else {
        reject(new Error('Employee not found'));
      }
    }, FAKE_LATENCY);
  });
};