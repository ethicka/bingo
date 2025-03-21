<script lang="ts">
  export let currentNumber: number | null;
  export let manualNumber: number | null;
  export let getColumnLetter: (n: number) => string;
  export let onEnter: () => void;
  
  $: displayNumber = manualNumber ?? currentNumber;

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      onEnter();
    }
  }
</script>

<input
  type="number"
  bind:value={manualNumber}
  min="1"
  max="75"
  class="text-[20vh] sm:text-[30vh] lg:text-[40vh] w-full text-center bg-transparent focus:outline-none font-bold"
  placeholder="--"
  on:keydown={handleKeydown}
/>

{#if displayNumber}
  <div class="text-4xl sm:text-6xl lg:text-8xl text-center">
    {getColumnLetter(displayNumber)}-{displayNumber}
  </div>
{/if} 