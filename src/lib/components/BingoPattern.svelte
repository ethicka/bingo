<script lang="ts">
  export let pattern: boolean[][];
  export let size: 'sm' | 'lg' = 'sm';
  export let showBingo = false;

  const sizeClasses = {
    sm: 'w-2 h-2',
    lg: 'w-8 h-8'
  };

  const containerClasses = {
    sm: 'gap-1 p-2',
    lg: 'gap-2 p-3'
  };

  const letterClasses = {
    sm: 'text-xs',
    lg: 'text-sm'
  };
</script>

<div class="flex flex-col items-center mt-8">
  {#if showBingo}
    <div class="flex justify-between w-full px-2 mb-1">
      {#each ['B', 'I', 'N', 'G', 'O'] as letter}
        <span class="{letterClasses[size]} font-medium text-gray-600">{letter}</span>
      {/each}
    </div>
  {/if}
  <div class="bg-white border border-gray-200 rounded-lg shadow-sm">
    <div class="grid grid-cols-5 {containerClasses[size]}">
      {#each pattern as row}
        {#each row as cell}
          <div class="rounded-full {sizeClasses[size]} {cell ? 'bg-green-500' : 'bg-gray-200'}"></div>
        {/each}
      {/each}
    </div>
  </div>
</div>

<style>
  /* Add any custom styles here */
</style> 