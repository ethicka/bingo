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
</script>

<div class="h-screen bg-white p-2">
  <div class="h-full mx-auto flex flex-col lg:flex-row">
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
                <div 
                  class="aspect-square flex items-center justify-center text-4xl md:text-5xl 
                         border-4 rounded-lg font-bold cursor-pointer
                         {number === calledNumbers[calledNumbers.length - 1] ? 
                           'border-red-500 bg-red-500 text-white' : 
                           'border-blue-500 bg-white text-black hover:bg-gray-100'}"
                  on:click={() => removeNumber(number)}
                >
                  {number}
                </div>
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
            />
          </div>
          <div class="text-center text-3xl mt-4">
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
