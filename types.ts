
export interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
}

export type NewEmployee = Omit<Employee, 'id'>;
