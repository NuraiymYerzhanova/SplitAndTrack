jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

import { useStore } from '../store/useStore';
import { calculateSplit, calculateTotal } from '../utils/math';

describe('Math Utilities', () => {
  // Test 1
  it('calculates total of empty expenses array as 0', () => {
    expect(calculateTotal([])).toBe(0);
  });

  // Test 2
  it('calculates total of multiple expenses correctly', () => {
    const expenses = [
      { id: '1', title: 'Gas', amount: 40, payerId: 'Me', date: '' },
      { id: '2', title: 'Food', amount: 60, payerId: 'Me', date: '' }
    ];
    expect(calculateTotal(expenses)).toBe(100);
  });

  // Test 3
  it('splits cost evenly among members', () => {
    expect(calculateSplit(100, 4)).toBe(25);
  });

  // Test 4
  it('returns 0 for split if members count is 0 (handles edge case)', () => {
    expect(calculateSplit(100, 0)).toBe(0);
  });
});

describe('Zustand Global Store', () => {
  // Reset store before each test to ensure isolation
  beforeEach(() => {
    useStore.setState({
      groups: [{ id: '1', name: 'Weekend Trip', members: ['Alice', 'Bob'], expenses: [] }]
    });
  });

  // Test 5
  it('initializes with default group', () => {
    const state = useStore.getState();
    expect(state.groups.length).toBe(1);
    expect(state.groups[0].name).toBe('Weekend Trip');
  });

  // Test 6
  it('adds a new group successfully', () => {
    const newGroup = { id: '2', name: 'Flatmates', members: ['Me', 'John'], expenses: [] };
    useStore.getState().addGroup(newGroup);
    
    const state = useStore.getState();
    expect(state.groups.length).toBe(2);
    expect(state.groups[1].name).toBe('Flatmates');
  });

  // Test 7
  it('adds an expense to the correct group', () => {
    const expense = { id: '100', title: 'Pizza', amount: 20, payerId: 'Me', date: '2026-05-01' };
    useStore.getState().addExpense('1', expense);
    
    const state = useStore.getState();
    expect(state.groups[0].expenses.length).toBe(1);
    expect(state.groups[0].expenses[0].title).toBe('Pizza');
  });

  // Test 8
  it('does not crash or modify other groups if group ID is not found', () => {
    const expense = { id: '100', title: 'Pizza', amount: 20, payerId: 'Me', date: '2026-05-01' };
    useStore.getState().addExpense('999', expense); // '999' doesn't exist
    
    const state = useStore.getState();
    expect(state.groups[0].expenses.length).toBe(0); // Should remain empty
  });
});