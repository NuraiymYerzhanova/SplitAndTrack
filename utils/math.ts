import { Expense, Group } from '../types';

export const calculateTotal = (expenses: Expense[]): number => {
  return expenses.reduce((sum, exp) => sum + exp.amount, 0);
};

// Advanced logic to calculate who owes who
export const calculateBalances = (group: Group) => {
  const total = calculateTotal(group.expenses);
  const splitAmount = total / (group.members.length || 1); // Avoid dividing by 0

  // Track how much each person actually paid
  const paidTotals: Record<string, number> = {};
  group.members.forEach(m => (paidTotals[m] = 0));

  group.expenses.forEach(exp => {
    if (paidTotals[exp.payerId] !== undefined) {
      paidTotals[exp.payerId] += exp.amount;
    }
  });

  // Calculate balance: (What they paid) - (What they should have paid)
  // Positive means they are owed money. Negative means they owe money.
  return group.members.map(member => ({
    member,
    paid: paidTotals[member],
    balance: paidTotals[member] - splitAmount,
  }));
};