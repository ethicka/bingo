<script lang="ts">
  export let onRandom: () => void;
  export let onCall: () => void;
  export let onReset: () => void;
  export let isCallDisabled: boolean;
  export let isRandomDisabled: boolean;
  
  const buttonClass = "px-4 py-2 lg:px-12 lg:py-6 rounded-lg lg:rounded-xl text-lg sm:text-xl lg:text-4xl font-bold text-white disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer";
</script>

<div class="flex gap-2 lg:gap-8 w-full max-w-md lg:max-w-2xl mt-4 lg:mt-8 justify-center">
  <button
    on:click={onRandom}
    disabled={isRandomDisabled}
    class="{buttonClass} bg-blue-500 hover:bg-blue-600"
  >
    Random
  </button>

  <button
    on:click={onCall}
    disabled={isCallDisabled}
    class="{buttonClass} bg-green-500 hover:bg-green-600"
  >
    Call
  </button>

  <button
    on:click={onReset}
    class="{buttonClass} bg-red-500 hover:bg-red-600"
  >
    Reset
  </button>
</div> 