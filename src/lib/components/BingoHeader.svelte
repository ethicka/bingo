<script lang="ts">
  export let letters: string[];
</script>

<div class="grid grid-cols-5 gap-2 mb-2">
  {#each letters as letter}
    <div class="font-bold text-2xl sm:text-3xl text-center">{letter}</div>
  {/each}
</div> 