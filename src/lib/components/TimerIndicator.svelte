<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  
  export let isActive = false;
  export let timerSeconds = 10;
  export let isAutoMode = false;
  export let isPaused = false;
  export let showTimer = true;
  export let onPauseClick: () => void;

  let progress = 0;
  let animationFrame: number;
  let startTime: number;

  function updateProgress() {
    if (!browser || !isActive || isPaused) {
      if (browser) {
        window.cancelAnimationFrame(animationFrame);
      }
      return;
    }

    const now = performance.now();
    const elapsed = (now - startTime) % (timerSeconds * 1000);
    progress = (elapsed / (timerSeconds * 1000)) * 100;

    animationFrame = window.requestAnimationFrame(updateProgress);
  }

  function resetTimer() {
    if (!browser) return;
    
    startTime = performance.now();
    progress = 0;
    if (isActive && !isPaused) {
      animationFrame = window.requestAnimationFrame(updateProgress);
    }
  }

  function handleTimerReset() {
    resetTimer();
  }

  onMount(() => {
    if (!browser) return;

    window.addEventListener('timer-reset', handleTimerReset);
    resetTimer();
  });

  onDestroy(() => {
    if (!browser) return;

    window.removeEventListener('timer-reset', handleTimerReset);
    window.cancelAnimationFrame(animationFrame);
  });

  $: if (isActive && !isPaused && browser) {
    resetTimer();
  }
</script>

{#if showTimer}
  <div class="fixed top-4 right-4 z-20">
    <button
      class="relative w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      on:click={onPauseClick}
      aria-label={isPaused ? "Resume" : "Pause"}
    >
      <svg
        class="absolute inset-0 w-full h-full"
        viewBox="0 0 36 36"
      >
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          stroke="#E5E7EB"
          stroke-width="2"
        />
        {#if isActive}
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="#3B82F6"
            stroke-width="2"
            stroke-dasharray="100"
            stroke-dashoffset={100 - progress}
            transform="rotate(-90 18 18)"
          />
        {/if}
      </svg>
      {#if isPaused}
        <svg class="absolute inset-0 w-full h-full p-3" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      {:else}
        <svg class="absolute inset-0 w-full h-full p-3" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        </svg>
      {/if}
    </button>
  </div>
{/if}

<style>
  circle {
    transition: stroke-dashoffset 0.1s linear;
  }
</style> 