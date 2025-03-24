<script lang="ts">
  export let current: number;
  export let total: number;
</script>

<div class="flex flex-col items-center w-full">
  <div class="flex justify-between w-full mb-2">
    <span class="text-sm font-medium text-gray-600">Called: {current}</span>
    <span class="text-sm font-medium text-gray-600">Total: {total}</span>
  </div>
  <div class="w-full h-4 bg-gray-200 rounded-full">
    <div
      class="h-4 transition-all duration-300 ease-out bg-green-500 rounded-full"
      style="width: {(current / total) * 100}%"
    ></div>
  </div>
</div> 