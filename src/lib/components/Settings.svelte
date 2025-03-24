<script lang="ts">
  import { slide } from 'svelte/transition';
  
  export let isOpen = false;
  export let timerSeconds = 10;
  export let autoMode = false;
  export let onClose: () => void;
  export let onTimerChange: (seconds: number) => void;
  export let onAutoModeChange: (enabled: boolean) => void;
</script>

{#if isOpen}
  <div
    transition:slide={{ duration: 300 }}
    class="fixed top-0 right-0 z-50 h-full p-4 bg-white shadow-lg w-80"
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

    <div class="space-y-6">
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
    </div>
  </div>
{/if} 