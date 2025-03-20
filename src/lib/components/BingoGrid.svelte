<script lang="ts">
  import type { BingoColumn } from '$lib/types';
  
  export let columns: Record<string, BingoColumn>;
  export let calledNumbers: number[];
  export let onNumberClick: (number: number) => void;
</script>

<div class="flex-1 grid grid-cols-5 gap-2">
  {#each Object.entries(columns) as [letter, range]}
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
          on:click={() => onNumberClick(number)}
          aria-label={`Remove number ${number}`}
        >
          {number}
        </button>
      {/each}
    </div>
  {/each}
</div> 