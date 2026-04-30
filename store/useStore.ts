import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Expense, Group } from '../types';

interface AppState {
  groups: Group[];
  addGroup: (group: Group) => void;
  addExpense: (groupId: string, expense: Expense) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Our initial state
      groups: [
        { id: '1', name: 'Weekend Trip', members: ['Alice', 'Bob'], expenses: [] }
      ],
      
      addGroup: (group) => 
        set((state) => ({ groups: [...state.groups, group] })),
        
      addExpense: (groupId, expense) => 
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === groupId ? { ...g, expenses: [...g.expenses, expense] } : g
          )
        })),
    }),
    {
      name: 'split-and-track-storage', // The key used in AsyncStorage
      storage: createJSONStorage(() => AsyncStorage), 
    }
  )
);