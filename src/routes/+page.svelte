<script lang="ts">
  import { bingoState } from '$lib/stores';
  import BingoHeader from '$lib/components/BingoHeader.svelte';
  import BingoGrid from '$lib/components/BingoGrid.svelte';
  import NumberDisplay from '$lib/components/NumberDisplay.svelte';
  import Controls from '$lib/components/Controls.svelte';
  import ProgressBar from '$lib/components/ProgressBar.svelte';
  import type { BingoColumn } from '$lib/types';
  import HelpMenu from '$lib/components/HelpMenu.svelte';

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
  let showHelp = false;

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

  function openDonate() {
    window.open('https://buymeacoffee.com/ethicka', '_blank');
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

<div class="fixed bottom-4 right-4 flex gap-2 z-20">
  <button
    class="bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700"
    on:click={() => showHelp = true}
    aria-label="Help"
  >
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  </button>

  <button
    class="bg-yellow-600 text-white p-2 rounded-full shadow-lg hover:bg-yellow-500"
    on:click={openDonate}
    aria-label="Buy me a coffee"
  >
    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4v-2z"/>
    </svg>
  </button>
</div>

<HelpMenu bind:isOpen={showHelp} />

<style>
  /* Add any additional custom styles here */
</style>
