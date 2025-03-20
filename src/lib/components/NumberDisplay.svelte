<script lang="ts">
  export let currentNumber: number | null;
  export let manualNumber: number | null;
  export let getColumnLetter: (n: number) => string;
  export let onEnter: () => void;
  
  $: displayNumber = manualNumber && manualNumber >= 1 && manualNumber <= 75 
    ? manualNumber 
    : currentNumber;
</script>

<input
  type="number"
  bind:value={manualNumber}
  min="1"
  max="75"
  class="text-[20vh] sm:text-[30vh] lg:text-[40vh] w-full text-center bg-transparent focus:outline-none font-bold"
  placeholder="--"
  on:keydown={(e) => e.key === 'Enter' && onEnter()}
/>

{#if displayNumber}
  <div class="text-4xl sm:text-6xl lg:text-8xl text-center">
    {getColumnLetter(displayNumber)}-{displayNumber}
  </div>
{/if} 