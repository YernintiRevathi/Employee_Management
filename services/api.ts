import { Employee, NewEmployee } from '../types';

// This file is now configured to connect to a real backend API.
// The base URL should point to your server. In a real app, this would
// come from an environment variable (e.g., process.env.REACT_APP_API_URL).
const API_BASE_URL = '/api'; // Using a relative URL is common for same-domain APIs or when using a proxy.

/**
 * A helper function to handle the response from the fetch API,
 * parsing JSON and throwing errors for non-ok responses.
 * @param response - The Response object from a fetch call.
 */
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
    throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
  }
  // For 204 No Content responses, return null as there's no body to parse.
  if (response.status === 204) {
    return null;
  }
  return response.json();
};

/**
 * Logs in a user by sending credentials to the backend.
 * @param username - The username.
 * @param password - The password.
 * @returns A promise that resolves with a JWT token object.
 */
export const login = async (username: string, password: string): Promise<{ token: string }> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(response);
};

/**
 * Fetches all employees from the backend.
 * @param token - The authentication token.
 * @returns A promise that resolves with the list of employees.
 */
export const getEmployees = async (token: string): Promise<Employee[]> => {
  const response = await fetch(`${API_BASE_URL}/employees`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return handleResponse(response);
};

/**
 * Adds a new employee by sending data to the backend.
 * @param token - The authentication token.
 * @param employeeData - The data for the new employee.
 * @returns A promise that resolves with the newly created employee.
 */
export const addEmployee = async (token: string, employeeData: NewEmployee): Promise<Employee> => {
  const response = await fetch(`${API_BASE_URL}/employees`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(employeeData),
  });
  return handleResponse(response);
};

/**
 * Updates an existing employee on the backend.
 * @param token - The authentication token.
 * @param id - The ID of the employee to update.
 * @param employeeData - The updated employee data.
 * @returns A promise that resolves with the updated employee.
 */
export const updateEmployee = async (token: string, id: string, employeeData: Employee): Promise<Employee> => {
  const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(employeeData),
  });
  return handleResponse(response);
};

/**
 * Deletes an employee from the backend.
 * @param token - The authentication token.
 * @param id - The ID of the employee to delete.
 * @returns A promise that resolves when the employee is deleted.
 */
export const deleteEmployee = async (token: string, id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  // A successful DELETE often returns a 204 No Content, so we check for ok status
  // without trying to parse a JSON body.
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
    throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
  }
};
