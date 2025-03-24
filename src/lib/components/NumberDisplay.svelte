<script lang="ts">
  export let number: number | null;
  export let getColumnLetter: (number: number) => string;
  export let onNumberClick: () => void;
  export let isAutoMode: boolean;

  $: letter = number ? getColumnLetter(number) : '';
  $: displayNumber = number ? `${letter}-${number}` : '';
  $: fontSize = displayNumber.length > 3 ? 'text-[12rem]' : 'text-[14rem]';
</script>

<div class="flex justify-center items-center h-full">
  {#if number}
    <button
      on:click={onNumberClick}
      disabled={isAutoMode}
      class="font-bold text-center whitespace-nowrap {fontSize} leading-none transition-opacity
             hover:opacity-80 focus:outline-none disabled:cursor-default disabled:hover:opacity-100"
    >
      {displayNumber}
    </button>
  {:else}
    <div class="text-4xl text-gray-400">
      Press Space to Start
    </div>
  {/if}
</div>

<style>
  /* Add any custom styles here */
</style> 