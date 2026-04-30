export interface Expense {
  id: string;
  title: string;
  amount: number;
  payerId: string;
  date: string;
  location?: { latitude: number; longitude: number };
  receiptUri?: string; 
}

export interface Group {
  id: string;
  name: string;
  members: string[]; 
  expenses: Expense[];
}