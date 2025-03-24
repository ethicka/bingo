<script lang="ts">
  import { bingoState } from '$lib/stores';
  import { onMount, onDestroy } from 'svelte';
  import BingoHeader from '$lib/components/BingoHeader.svelte';
  import BingoGrid from '$lib/components/BingoGrid.svelte';
  import NumberDisplay from '$lib/components/NumberDisplay.svelte';
  import ProgressBar from '$lib/components/ProgressBar.svelte';
  import Settings from '$lib/components/Settings.svelte';
  import type { BingoColumn } from '$lib/types';
  import HelpMenu from '$lib/components/HelpMenu.svelte';
  import TimerIndicator from '$lib/components/TimerIndicator.svelte';
  import BingoPattern from '$lib/components/BingoPattern.svelte';
  import KeyboardShortcuts from '$lib/components/KeyboardShortcuts.svelte';

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
  let showKeyboardShortcuts = false;
  let timerSeconds = 10;
  let autoMode = false;
  let timerInterval: NodeJS.Timeout | null = null;
  let showHelp = false;
  let isGameStarted = false;
  let currentPattern: boolean[][] | null = null;
  let isPaused = false;
  let showBingo = false;
  let showTimer = true;

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
      isGameStarted = true;
    }
  }

  function resetGame() {
    if (confirm('Are you sure you want to reset the game?')) {
      calledNumbers = [];
      currentNumber = null;
      stopAutoMode();
      isGameStarted = false;
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
    if (!isPaused) {
      // Reset the timer component
      const timerEvent = new CustomEvent('timer-reset');
      window.dispatchEvent(timerEvent);
      // Start the interval
      timerInterval = setInterval(() => {
        callRandomNumber();
        // Reset the timer component after each call
        window.dispatchEvent(timerEvent);
      }, timerSeconds * 1000);
    }
  }

  function stopAutoMode() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    autoMode = false;
    isPaused = false;
  }

  function handleTimerChange(seconds: number) {
    timerSeconds = seconds;
    if (autoMode && !isPaused) {
      stopAutoMode();
      startAutoMode();
    }
  }

  function handleAutoModeChange(enabled: boolean) {
    autoMode = enabled;
    if (enabled) {
      if (!isGameStarted) {
        // Call first number immediately when enabling auto mode
        callRandomNumber();
      }
      if (!isPaused) {
        startAutoMode();
      }
    } else {
      stopAutoMode();
    }
  }

  function handlePatternSelect(pattern: boolean[][] | null) {
    currentPattern = pattern;
  }

  function handleBingoChange(enabled: boolean) {
    showBingo = enabled;
  }

  function handlePauseChange(paused: boolean) {
    isPaused = paused;
    if (autoMode) {
      if (paused) {
        if (timerInterval) {
          clearInterval(timerInterval);
          timerInterval = null;
        }
      } else {
        startAutoMode();
      }
    }
  }

  function togglePause() {
    isPaused = !isPaused;
    handlePauseChange(isPaused);
  }

  function handleTimerVisibilityChange(visible: boolean) {
    showTimer = visible;
  }

  // Keyboard handler
  function handleKeydown(event: KeyboardEvent) {
    if (event.code === 'Space' && !autoMode) {
      event.preventDefault();
      callRandomNumber();
    } else if (event.code === 'KeyP') {
      event.preventDefault();
      togglePause();
    } else if (event.code === 'KeyR') {
      event.preventDefault();
      resetGame();
    } else if (event.code === 'KeyA') {
      event.preventDefault();
      handleAutoModeChange(!autoMode);
    } else if (event.code === 'Slash') {
      event.preventDefault();
      showKeyboardShortcuts = true;
    } else if (event.code === 'Escape') {
      if (showSettings) {
        showSettings = false;
      }
      if (showKeyboardShortcuts) {
        showKeyboardShortcuts = false;
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

<TimerIndicator 
  isActive={isGameStarted} 
  {timerSeconds} 
  isAutoMode={autoMode}
  {isPaused}
  onPauseClick={togglePause}
  {showTimer}
/>

<!-- Mobile View -->
<div class="h-screen p-2 overflow-hidden bg-white lg:hidden"
     on:touchstart={handleTouchStart}
     on:touchend={handleTouchEnd}>
  <div class="relative h-full">
    <!-- Grid Panel -->
    <div class="absolute inset-0 w-full transition-transform duration-300 ease-in-out"
         style="transform: translateX({activePanel === 0 ? '0' : '-100%'})">
      <div class="flex flex-col h-full">
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
      <div class="flex flex-col items-center h-full">
        <div class="flex flex-col justify-center flex-1 w-full max-w-xl mx-auto">
          <div class="w-full min-w-[300px] flex justify-center">
            <NumberDisplay
              number={currentNumber}
              {getColumnLetter}
              onNumberClick={callRandomNumber}
              isAutoMode={autoMode}
            />
          </div>

          {#if currentPattern}
            <div class="flex justify-center mt-8">
              <div class="transform scale-125">
                <BingoPattern pattern={currentPattern} size="lg" {showBingo} />
              </div>
            </div>
          {/if}
        </div>


        <div class="w-full mb-12">
          <ProgressBar
            current={calledNumbers.length}
            total={75}
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Navigation Dots -->
  <div class="fixed left-0 right-0 z-10 flex justify-center gap-2 bottom-4">
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
<div class="hidden h-screen p-2 bg-white lg:flex">
  <div class="flex flex-row w-full h-full mx-auto">
    <!-- Left side - Grid -->
    <div class="flex flex-col w-1/2 p-2">
      <div class="sticky z-10 bg-white top-2">
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
    <div class="sticky flex flex-col items-center w-1/2 h-full p-2 top-2">
      <div class="flex flex-col justify-center flex-1 w-full max-w-xl mx-auto">
        <div class="w-full min-w-[300px] flex justify-center">
          <NumberDisplay
            number={currentNumber}
            {getColumnLetter}
            onNumberClick={callRandomNumber}
            isAutoMode={autoMode}
          />
        </div>

        {#if currentPattern}
          <div class="flex justify-center mt-8">
            <div class="transform scale-125">
              <BingoPattern pattern={currentPattern} size="lg" {showBingo} />
            </div>
          </div>
        {/if}
      </div>

      <div class="w-[80%] mb-16">
        <ProgressBar
          current={calledNumbers.length}
          total={75}
        />
      </div>
    </div>
  </div>
</div>

<!-- Settings Button -->
<div class="fixed z-20 bottom-4 right-4">
  <button
    class="p-2 text-white bg-gray-800 rounded-full shadow-lg hover:bg-gray-700"
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

<KeyboardShortcuts
  bind:isOpen={showKeyboardShortcuts}
  onClose={() => showKeyboardShortcuts = false}
/>

<Settings
  bind:isOpen={showSettings}
  bind:timerSeconds
  bind:autoMode
  bind:isPaused
  bind:showBingo
  bind:showTimer
  onClose={() => showSettings = false}
  onTimerChange={handleTimerChange}
  onAutoModeChange={handleAutoModeChange}
  onPatternSelect={handlePatternSelect}
  onPauseChange={handlePauseChange}
  onBingoChange={handleBingoChange}
  onTimerVisibilityChange={handleTimerVisibilityChange}
  onReset={resetGame}
/>

<style>
  /* Add any additional custom styles here */
</style>
