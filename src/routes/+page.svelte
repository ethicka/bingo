<script lang="ts">
  import { bingoState } from '$lib/stores';
  import { onMount, onDestroy } from 'svelte';
  import BingoHeader from '$lib/components/BingoHeader.svelte';
  import BingoGrid from '$lib/components/BingoGrid.svelte';
  import NumberDisplay from '$lib/components/NumberDisplay.svelte';
  import Controls from '$lib/components/Controls.svelte';
  import ProgressBar from '$lib/components/ProgressBar.svelte';
  import Settings from '$lib/components/Settings.svelte';
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
  let activePanel = 0; // 0 for grid, 1 for randomizer
  let touchStart = 0;
  let showSettings = false;
  let timerSeconds = 10;
  let autoMode = false;
  let timerInterval: NodeJS.Timeout | null = null;
  let showHelp = false;

  // Game control functions
  const onRandom = () => callRandomNumber();
  const onReset = () => resetGame();
  const isRandomDisabled = calledNumbers.length === 75;

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
    }
  }

  function resetGame() {
    if (confirm('Are you sure you want to reset the game?')) {
      calledNumbers = [];
      currentNumber = null;
      stopAutoMode();
    }
  }

  function removeNumber(number: number) {
    if (confirm(`Remove number ${number}?`)) {
      calledNumbers = calledNumbers.filter(n => n !== number);
      if (currentNumber === number) {
        currentNumber = null;
      }
    }
  }

  // Auto mode functions
  function startAutoMode() {
    if (timerInterval) return;
    timerInterval = setInterval(callRandomNumber, timerSeconds * 1000);
  }

  function stopAutoMode() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    autoMode = false;
  }

  function handleTimerChange(seconds: number) {
    timerSeconds = seconds;
    if (autoMode) {
      stopAutoMode();
      startAutoMode();
    }
  }

  function handleAutoModeChange(enabled: boolean) {
    autoMode = enabled;
    if (enabled) {
      startAutoMode();
    } else {
      stopAutoMode();
    }
  }

  // Keyboard handler
  function handleKeydown(event: KeyboardEvent) {
    if (event.code === 'Space' && !autoMode) {
      event.preventDefault();
      callRandomNumber();
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
    if (typeof window !== 'undefined') {
      window.open('https://buymeacoffee.com/ethicka', '_blank');
    }
  }

  // Lifecycle
  onMount(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeydown);
    }
  });

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', handleKeydown);
      stopAutoMode();
    }
  });
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
          number={currentNumber}
          {getColumnLetter}
        />

        <Controls
          {onRandom}
          {onReset}
          {isRandomDisabled}
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
    <div class="w-1/2 p-2 flex flex-col">
      <div class="sticky top-2 bg-white z-10">
        <BingoHeader letters={Object.keys(COLUMNS)} />
      </div>
      <div class="flex-1 overflow-y-auto">
        <BingoGrid 
          columns={COLUMNS}
          calledNumbers={calledNumbers}
          onNumberClick={removeNumber}
        />
      </div>
    </div>

    <!-- Right side - Randomizer -->
    <div class="w-1/2 flex flex-col items-center justify-center p-2 sticky top-2">
      <NumberDisplay
        number={currentNumber}
        {getColumnLetter}
      />

      <Controls
        {onRandom}
        {onReset}
        {isRandomDisabled}
      />

      <ProgressBar
        current={calledNumbers.length}
        total={75}
      />
    </div>
  </div>
</div>

<!-- Settings Button -->
<div class="fixed bottom-4 right-4 z-20">
  <button
    class="bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700"
    on:click={() => showSettings = true}
    aria-label="Settings"
  >
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  </button>
</div>

<HelpMenu bind:isOpen={showHelp} />

<Settings
  bind:isOpen={showSettings}
  bind:timerSeconds
  bind:autoMode
  onClose={() => showSettings = false}
  onTimerChange={handleTimerChange}
  onAutoModeChange={handleAutoModeChange}
/>

<style>
  /* Add any additional custom styles here */
</style>
