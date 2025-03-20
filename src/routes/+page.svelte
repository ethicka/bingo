<script lang="ts">
  import { bingoState } from '$lib/stores';
  import BingoHeader from '$lib/components/BingoHeader.svelte';
  import BingoGrid from '$lib/components/BingoGrid.svelte';
  import NumberDisplay from '$lib/components/NumberDisplay.svelte';
  import Controls from '$lib/components/Controls.svelte';
  import ProgressBar from '$lib/components/ProgressBar.svelte';
  import type { BingoColumn } from '$lib/types';

  // Constants for bingo numbers
  const COLUMNS: Record<string, BingoColumn> = {
    B: { start: 1, end: 15 },
    I: { start: 16, end: 30 },
    N: { start: 31, end: 45 },
    G: { start: 46, end: 60 },
    O: { start: 61, end: 75 }
  };

  let calledNumbers: number[] = $bingoState.calledNumbers;
  let currentNumber: number | null = $bingoState.currentNumber;
  let manualNumber: number | null = currentNumber;
  let activePanel = 0; // 0 for grid, 1 for randomizer
  let touchStart = 0;

  // Update store when state changes
  $: {
    bingoState.set({ calledNumbers, currentNumber });
  }

  // Helper Functions
  function getColumnLetter(number: number): string {
    if (number <= 15) return 'B';
    if (number <= 30) return 'I';
    if (number <= 45) return 'N';
    if (number <= 60) return 'G';
    return 'O';
  }

  // Game Actions
  function callRandomNumber() {
    const availableNumbers = Array.from({length: 75}, (_, i) => i + 1)
      .filter(n => !calledNumbers.includes(n));
    
    if (availableNumbers.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      currentNumber = availableNumbers[randomIndex];
      calledNumbers = [...calledNumbers, currentNumber];
      manualNumber = currentNumber;
    }
  }

  function handleManualNumber() {
    if (manualNumber && manualNumber >= 1 && manualNumber <= 75 && !calledNumbers.includes(manualNumber)) {
      currentNumber = manualNumber;
      calledNumbers = [...calledNumbers, manualNumber];
      manualNumber = null;
    }
  }

  function resetGame() {
    if (confirm('Are you sure you want to reset the game?')) {
      calledNumbers = [];
      currentNumber = null;
      manualNumber = null;
    }
  }

  function removeNumber(number: number) {
    if (confirm(`Remove number ${number}?`)) {
      calledNumbers = calledNumbers.filter(n => n !== number);
      if (currentNumber === number) {
        currentNumber = null;
        manualNumber = null;
      }
    }
  }

  // Mobile Touch Handlers
  function handleTouchStart(e: TouchEvent) {
    touchStart = e.touches[0].clientX;
  }

  function handleTouchEnd(e: TouchEvent) {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && activePanel === 0) activePanel = 1;
      else if (diff < 0 && activePanel === 1) activePanel = 0;
    }
  }
</script>

<svelte:head>
  <title>Bingo Caller</title>
  <meta name="description" content="A simple bingo caller for classrooms and PTA events">
</svelte:head>

<!-- Mobile View -->
<div class="lg:hidden h-screen bg-white p-2 overflow-hidden"
     on:touchstart={handleTouchStart}
     on:touchend={handleTouchEnd}>
  <div class="h-full relative">
    <!-- Grid Panel -->
    <div class="absolute inset-0 w-full transition-transform duration-300 ease-in-out"
         style="transform: translateX({activePanel === 0 ? '0' : '-100%'})">
      <div class="h-full flex flex-col">
        <BingoHeader letters={Object.keys(COLUMNS)} />
        <BingoGrid 
          columns={COLUMNS}
          calledNumbers={calledNumbers}
          onNumberClick={removeNumber}
        />
      </div>
    </div>

    <!-- Randomizer Panel -->
    <div class="absolute inset-0 w-full transition-transform duration-300 ease-in-out"
         style="transform: translateX({activePanel === 1 ? '0' : '100%'})">
      <div class="h-full flex flex-col items-center justify-center">
        <NumberDisplay
          {currentNumber}
          {manualNumber}
          {getColumnLetter}
          onEnter={handleManualNumber}
        />

        <Controls
          onRandom={callRandomNumber}
          onCall={handleManualNumber}
          onReset={resetGame}
          isCallDisabled={!manualNumber || manualNumber < 1 || manualNumber > 75 || calledNumbers.includes(manualNumber)}
          isRandomDisabled={calledNumbers.length === 75}
        />

        <ProgressBar
          current={calledNumbers.length}
          total={75}
        />
      </div>
    </div>
  </div>

  <!-- Navigation Dots -->
  <div class="fixed bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
    <button
      class="w-3 h-3 rounded-full transition-colors duration-200 
             {activePanel === 0 ? 'bg-blue-500' : 'bg-gray-300'}"
      on:click={() => activePanel = 0}
      aria-label="Show grid"
    ></button>
    <button
      class="w-3 h-3 rounded-full transition-colors duration-200 
             {activePanel === 1 ? 'bg-blue-500' : 'bg-gray-300'}"
      on:click={() => activePanel = 1}
      aria-label="Show randomizer"
    ></button>
  </div>
</div>

<!-- Desktop View -->
<div class="hidden lg:flex h-screen bg-white p-2">
  <div class="h-full mx-auto flex flex-row w-full">
    <!-- Left side - Grid -->
    <div class="w-1/2 p-2">
      <div class="h-full flex flex-col">
        <BingoHeader letters={Object.keys(COLUMNS)} />
        <BingoGrid 
          columns={COLUMNS}
          calledNumbers={calledNumbers}
          onNumberClick={removeNumber}
        />
      </div>
    </div>

    <!-- Right side - Randomizer -->
    <div class="w-1/2 flex flex-col items-center justify-center p-2">
      <NumberDisplay
        {currentNumber}
        {manualNumber}
        {getColumnLetter}
        onEnter={handleManualNumber}
      />

      <Controls
        onRandom={callRandomNumber}
        onCall={handleManualNumber}
        onReset={resetGame}
        isCallDisabled={!manualNumber || manualNumber < 1 || manualNumber > 75 || calledNumbers.includes(manualNumber)}
        isRandomDisabled={calledNumbers.length === 75}
      />

      <ProgressBar
        current={calledNumbers.length}
        total={75}
      />
    </div>
  </div>
</div>

<style>
  /* Add any additional custom styles here */
</style>
