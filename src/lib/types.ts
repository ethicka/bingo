export interface BingoColumn {
  start: number;
  end: number;
}

export interface BingoState {
  calledNumbers: number[];
  currentNumber: number | null;
} 