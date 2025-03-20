<script lang="ts">
  export let current: number;
  export let total: number;
  
  $: percentage = (current / total) * 100;
</script>

<div class="w-full max-w-2xl mt-8">
  <div class="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
    <div 
      class="bg-green-500 h-full transition-all duration-300 ease-out"
      style="width: {percentage}%"
    ></div>
  </div>
  <div class="text-center text-lg sm:text-xl lg:text-3xl mt-2">
    Called: {current} / {total}
  </div>
</div> 