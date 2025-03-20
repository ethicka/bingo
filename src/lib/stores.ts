import { writable } from 'svelte/store';
import type { BingoState } from './types';

// Initialize state from localStorage if available
const savedState = typeof window !== 'undefined' ? localStorage.getItem('bingoState') : null;
const initialState: BingoState = savedState 
  ? JSON.parse(savedState) 
  : { calledNumbers: [], currentNumber: null };

// Create the store
export const bingoState = writable<BingoState>(initialState);

// Save state changes to localStorage
bingoState.subscribe(state => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('bingoState', JSON.stringify(state));
  }
}); 