<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  // Constants for bingo numbers
  const COLUMNS = {
    B: { start: 1, end: 15 },
    I: { start: 16, end: 30 },
    N: { start: 31, end: 45 },
    G: { start: 46, end: 60 },
    O: { start: 61, end: 75 }
  };

  // Initialize with stored values if they exist
  const savedState = typeof window !== 'undefined' ? localStorage.getItem('bingoState') : null;
  const initialState = savedState ? JSON.parse(savedState) : { calledNumbers: [], currentNumber: null };

  let calledNumbers: number[] = initialState.calledNumbers;
  let currentNumber: number | null = initialState.currentNumber;
  let manualNumber: number | null = currentNumber;

  let activePanel = 0; // 0 for grid, 1 for randomizer
  let touchStart = 0;

  // Save state whenever calledNumbers changes
  $: {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('bingoState', JSON.stringify({
          calledNumbers,
          currentNumber
        }));
      } catch (error) {
        console.error('Error saving state:', error);
      }
    }
  }

  function callRandomNumber() {
    const availableNumbers = Array.from({length: 75}, (_, i) => i + 1)
      .filter(n => !calledNumbers.includes(n));
    
    if (availableNumbers.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      currentNumber = availableNumbers[randomIndex];
      calledNumbers = [...calledNumbers, currentNumber];
      manualNumber = currentNumber; // Show the random number in input
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
      localStorage.removeItem('bingoState');
    }
  }

  function getColumnLetter(number: number): string {
    if (number <= 15) return 'B';
    if (number <= 30) return 'I';
    if (number <= 45) return 'N';
    if (number <= 60) return 'G';
    return 'O';
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

  function handleTouchStart(e: TouchEvent) {
    touchStart = e.touches[0].clientX;
  }

  function handleTouchEnd(e: TouchEvent) {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) { // minimum swipe distance
      if (diff > 0 && activePanel === 0) {
        activePanel = 1; // swipe left
      } else if (diff < 0 && activePanel === 1) {
        activePanel = 0; // swipe right
      }
    }
  }
</script>

<svelte:head>
  <title>Bingo Caller</title>
  <meta name="description" content="A simple bingo caller for classrooms and PTA events">
</svelte:head>

<div class="h-screen bg-white p-2">
  <!-- Mobile View -->
  <div class="lg:hidden h-full overflow-hidden"
       on:touchstart={handleTouchStart}
       on:touchend={handleTouchEnd}>
    <!-- Panel Container -->
    <div class="h-full relative overflow-hidden">
      <!-- Grid Panel -->
      <div class="absolute inset-0 w-full transition-transform duration-300 ease-in-out"
           style="transform: translateX({activePanel === 0 ? '0' : '-100%'})">
        <div class="h-full flex flex-col">
          <!-- Column Headers -->
          <div class="grid grid-cols-5 gap-2 mb-2">
            {#each Object.keys(COLUMNS) as letter}
              <div class="font-bold text-2xl sm:text-3xl text-center">{letter}</div>
            {/each}
          </div>
          
          <!-- Called Numbers Grid -->
          <div class="flex-1 grid grid-cols-5 gap-2">
            {#each Object.entries(COLUMNS) as [letter, range]}
              <div class="flex flex-col gap-2">
                {#each Array.from({length: range.end - range.start + 1}, (_, i) => range.start + i)
                       .filter(n => calledNumbers.includes(n))
                       .sort((a, b) => calledNumbers.indexOf(b) - calledNumbers.indexOf(a))
                  as number}
                  <button
                    class="aspect-square flex items-center justify-center text-2xl sm:text-4xl 
                           border-4 rounded-lg font-bold w-full
                           {number === calledNumbers[calledNumbers.length - 1] ? 
                             'border-red-500 bg-red-500 text-white' : 
                             'border-blue-500 bg-white text-black'}"
                    on:click={() => removeNumber(number)}
                    aria-label={`Remove number ${number}`}
                  >
                    {number}
                  </button>
                {/each}
              </div>
            {/each}
          </div>
        </div>
      </div>

      <!-- Randomizer Panel -->
      <div class="absolute inset-0 w-full transition-transform duration-300 ease-in-out"
           style="transform: translateX({activePanel === 1 ? '0' : '100%'})">
        <div class="h-full flex flex-col items-center justify-center">
          <input
            type="number"
            bind:value={manualNumber}
            min="1"
            max="75"
            class="text-[20vh] sm:text-[30vh] w-full text-center bg-transparent focus:outline-none font-bold"
            placeholder="--"
            on:keydown={(e) => {
              if (e.key === 'Enter' && manualNumber && manualNumber >= 1 && manualNumber <= 75 && !calledNumbers.includes(manualNumber)) {
                handleManualNumber();
              }
            }}
          />

          <div class="text-4xl sm:text-6xl text-center">
            {#if manualNumber && manualNumber >= 1 && manualNumber <= 75}
              {getColumnLetter(manualNumber)}-{manualNumber}
            {:else if currentNumber}
              {getColumnLetter(currentNumber)}-{currentNumber}
            {/if}
          </div>

          <!-- Controls -->
          <div class="flex gap-2 w-full max-w-md mt-4 justify-center">
            <button
              on:click={callRandomNumber}
              disabled={calledNumbers.length === 75}
              class="bg-blue-500 text-white px-4 py-2 rounded-lg text-lg sm:text-xl font-bold
                     disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Random
            </button>

            <button
              on:click={handleManualNumber}
              disabled={!manualNumber || manualNumber < 1 || manualNumber > 75 || calledNumbers.includes(manualNumber)}
              class="bg-green-500 text-white px-4 py-2 rounded-lg text-lg sm:text-xl font-bold
                     disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Call
            </button>

            <button
              on:click={resetGame}
              class="bg-red-500 text-white px-4 py-2 rounded-lg text-lg sm:text-xl font-bold"
            >
              Reset
            </button>
          </div>

          <!-- Progress Bar -->
          <div class="w-full max-w-2xl mt-8">
            <div class="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
              <div 
                class="bg-green-500 h-full transition-all duration-300 ease-out"
                style="width: {(calledNumbers.length / 75) * 100}%"
              ></div>
            </div>
            <div class="text-center text-lg sm:text-xl mt-2">
              Called: {calledNumbers.length} / 75
            </div>
          </div>
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

  <!-- Desktop View (unchanged) -->
  <div class="hidden lg:flex h-full mx-auto flex-row">
    <!-- Left side - Called numbers grid -->
    <div class="h-full lg:w-1/2 p-2">
      <div class="h-full flex flex-col">
        <!-- Column Headers -->
        <div class="grid grid-cols-5 gap-2 mb-2">
          {#each Object.keys(COLUMNS) as letter}
            <div class="font-bold text-3xl text-center">{letter}</div>
          {/each}
        </div>
        
        <!-- Called Numbers Grid -->
        <div class="flex-1 grid grid-cols-5 gap-2">
          {#each Object.entries(COLUMNS) as [letter, range]}
            <div class="flex flex-col gap-2">
              {#each Array.from({length: range.end - range.start + 1}, (_, i) => range.start + i)
                     .filter(n => calledNumbers.includes(n))
                     .sort((a, b) => calledNumbers.indexOf(b) - calledNumbers.indexOf(a))
                as number}
                <button
                  class="aspect-square flex items-center justify-center text-4xl md:text-5xl 
                         border-4 rounded-lg font-bold w-full
                         {number === calledNumbers[calledNumbers.length - 1] ? 
                           'border-red-500 bg-red-500 text-white' : 
                           'border-blue-500 bg-white text-black'}"
                  on:click={() => removeNumber(number)}
                  aria-label={`Remove number ${number}`}
                >
                  {number}
                </button>
              {/each}
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Right side - Current number display -->
    <div class="h-full lg:w-1/2 flex flex-col items-center justify-center p-2">
      <div class="w-full flex flex-col items-center gap-4">
        <input
          type="number"
          bind:value={manualNumber}
          min="1"
          max="75"
          class="text-[40vh] w-full text-center bg-transparent focus:outline-none font-bold"
          placeholder="--"
          on:keydown={(e) => {
            if (e.key === 'Enter' && manualNumber && manualNumber >= 1 && manualNumber <= 75 && !calledNumbers.includes(manualNumber)) {
              handleManualNumber();
            }
          }}
        />
        
        <div class="text-8xl text-center">
          {#if manualNumber && manualNumber >= 1 && manualNumber <= 75}
            {getColumnLetter(manualNumber)}-{manualNumber}
          {:else if currentNumber}
            {getColumnLetter(currentNumber)}-{currentNumber}
          {/if}
        </div>

        <!-- Controls -->
        <div class="flex gap-8 w-full max-w-2xl mt-8 justify-center">
          <button
            on:click={callRandomNumber}
            disabled={calledNumbers.length === 75}
            class="bg-blue-500 text-white px-12 py-6 rounded-xl text-4xl font-bold
                   disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600"
          >
            Random
          </button>

          <button
            on:click={handleManualNumber}
            disabled={!manualNumber || manualNumber < 1 || manualNumber > 75 || calledNumbers.includes(manualNumber)}
            class="bg-green-500 text-white px-12 py-6 rounded-xl text-4xl font-bold
                   disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-600"
          >
            Call
          </button>

          <button
            on:click={resetGame}
            class="bg-red-500 text-white px-12 py-6 rounded-xl text-4xl font-bold hover:bg-red-600"
          >
            Reset
          </button>
        </div>

        <!-- Progress Bar -->
        <div class="w-full max-w-2xl mt-8">
          <div class="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
            <div 
              class="bg-green-500 h-full transition-all duration-300 ease-out"
              style="width: {(calledNumbers.length / 75) * 100}%"
            ></div>
          </div>
          <div class="text-center text-xl mt-2">
            Called: {calledNumbers.length} / 75
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  /* Add any additional custom styles here */
</style>
