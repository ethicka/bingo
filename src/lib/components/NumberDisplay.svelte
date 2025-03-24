<script lang="ts">
  export let number: number | null;
  export let getColumnLetter: (n: number) => string;
</script>

<div class="text-center mb-8">
  {#if number}
    <div class="text-[15vh] md:text-[20vh] lg:text-[25vh] font-bold mb-2 leading-none">
      {getColumnLetter(number)}-{number}
    </div>
  {:else}
    <div class="text-[15vh] md:text-[20vh] lg:text-[25vh] font-bold mb-2 text-gray-300 leading-none">
      ?-?
    </div>
  {/if}
</div> 