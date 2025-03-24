<script lang="ts">
  import { slide } from 'svelte/transition';
  export let isOpen = false;
  export let onClose: () => void;

  function handleOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.closest('.shortcuts-panel')) return;
    onClose();
  }

  const shortcuts = [
    { key: 'Space', description: 'Call next number (when not in auto mode)' },
    { key: 'A', description: 'Toggle auto mode' },
    { key: 'P', description: 'Pause/Resume' },
    { key: 'R', description: 'Reset game (with confirmation)' },
    { key: '/', description: 'Show keyboard shortcuts' },
    { key: 'Esc', description: 'Close any open modal' }
  ];
</script>

{#if isOpen}
  <div
    class="fixed inset-0 z-50 bg-black/50"
    on:click={handleOutsideClick}
  >
    <div
      class="fixed p-4 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg shortcuts-panel top-1/2 left-1/2 w-96"
      transition:slide={{ duration: 300 }}
    >
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold">Keyboard Shortcuts</h2>
        <button
          on:click={onClose}
          class="text-gray-500 hover:text-gray-700"
          aria-label="Close keyboard shortcuts"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="space-y-4">
        {#each shortcuts as { key, description }}
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">{description}</span>
            <kbd class="px-2 py-1 text-sm font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded shadow-sm">
              {key}
            </kbd>
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if} 