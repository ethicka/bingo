<script lang="ts">
  export let onRandom: () => void;
  export let onReset: () => void;
  export let isRandomDisabled: boolean;
</script>

<div class="flex flex-col gap-4 items-center">
  <button
    on:click={onRandom}
    disabled={isRandomDisabled}
    class="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
  >
    Next Number
  </button>

  <button
    on:click={onReset}
    class="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"
  >
    Reset Game
  </button>
</div>

<div class="mt-4 text-sm text-gray-500 text-center">
  Press spacebar for next number
</div> 