<script lang="ts">
  import { slide } from 'svelte/transition';
  import BingoPattern from './BingoPattern.svelte';
  import patterns from '../patterns.json';
  
  export let isOpen = false;
  export let timerSeconds = 10;
  export let autoMode = false;
  export let isPaused = false;
  export let showBingo = false;
  export let showTimer = true;
  export let onClose: () => void;
  export let onTimerChange: (seconds: number) => void;
  export let onAutoModeChange: (enabled: boolean) => void;
  export let onPatternSelect: (pattern: boolean[][] | null) => void;
  export let onPauseChange: (paused: boolean) => void;
  export let onBingoChange: (enabled: boolean) => void;
  export let onTimerVisibilityChange: (visible: boolean) => void;
  export let onReset: () => void;

  type PatternKey = keyof typeof patterns;
  let selectedPattern: PatternKey | null = null;

  function selectPattern(name: PatternKey | null) {
    selectedPattern = name;
    onPatternSelect(name ? patterns[name].pattern.map(row => row.map(cell => Boolean(cell))) : null);
  }

  function handleOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.closest('.settings-panel')) return;
    onClose();
  }
</script>

{#if isOpen}
  <div
    class="fixed inset-0 z-50 bg-black/50"
    on:click={handleOutsideClick}
  >
    <div
      class="fixed top-0 right-0 h-full p-4 overflow-y-auto bg-white shadow-lg settings-panel w-96"
      transition:slide={{ duration: 300, axis: 'x' }}
    >
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold">Settings</h2>
        <button
          on:click={onClose}
          class="text-gray-500 hover:text-gray-700"
          aria-label="Close settings"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="space-y-8">
        <div>
          <label for="timer-input" class="block mb-2 text-sm font-medium text-gray-700">
            Timer (seconds)
          </label>
          <input
            id="timer-input"
            type="number"
            min="1"
            max="60"
            bind:value={timerSeconds}
            on:change={() => onTimerChange(timerSeconds)}
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="space-y-4">
          <div>
            <label class="flex items-center space-x-3">
              <input
                type="checkbox"
                bind:checked={autoMode}
                on:change={() => onAutoModeChange(autoMode)}
                class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="text-sm font-medium text-gray-700">Auto Mode</span>
            </label>
            <p class="mt-1 text-sm text-gray-500">
              Automatically call numbers based on timer
            </p>
          </div>

          <div>
            <label class="flex items-center space-x-3">
              <input
                type="checkbox"
                bind:checked={showTimer}
                on:change={() => onTimerVisibilityChange(showTimer)}
                class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="text-sm font-medium text-gray-700">Show Timer</span>
            </label>
          </div>

          <div>
            <label class="flex items-center space-x-3">
              <input
                type="checkbox"
                bind:checked={showBingo}
                on:change={() => onBingoChange(showBingo)}
                class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="text-sm font-medium text-gray-700">Show BINGO Letters</span>
            </label>
          </div>

          <div class="pt-4">
            <button
              on:click={onReset}
              class="w-full px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Reset Game
            </button>
          </div>
        </div>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-medium text-gray-900">Bingo Patterns</h3>
            {#if selectedPattern}
              <button
                class="text-sm text-gray-500 hover:text-gray-700"
                on:click={() => selectPattern(null)}
              >
                Clear Pattern
              </button>
            {/if}
          </div>
          <div class="grid grid-cols-1 gap-4">
            {#each Object.entries(patterns) as [key, { name, pattern }]}
              {@const patternKey = key as PatternKey}
              <button
                class="p-3 transition-colors border-2 rounded-lg"
                class:border-blue-500={selectedPattern === patternKey}
                class:border-gray-200={selectedPattern !== patternKey}
                on:click={() => selectPattern(patternKey)}
              >
                <div class="mb-2 text-sm font-medium text-gray-700">
                  {name}
                </div>
                <div class="flex justify-center">
                  <BingoPattern 
                    pattern={pattern.map(row => row.map(cell => Boolean(cell)))}
                    {showBingo}
                  />
                </div>
              </button>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
{/if} 