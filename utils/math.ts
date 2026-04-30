import { Expense } from '../types';

export const calculateTotal = (expenses: Expense[]): number => {
  return expenses.reduce((sum, exp) => sum + exp.amount, 0);
};

export const calculateSplit = (total: number, membersCount: number): number => {
  if (membersCount === 0) return 0;
  return total / membersCount;
};