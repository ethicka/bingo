<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  
  export let isOpen = false;
  let showWalkthrough = false;
  let walkStep = 0;

  const walkSteps = [
    {
      title: "Grid View",
      text: "The left side shows called numbers organized by B-I-N-G-O columns. Click any number to remove it if needed."
    },
    {
      title: "Number Display",
      text: "The large display shows the current number. Type a number directly or use the Random button."
    },
    {
      title: "Controls",
      text: "Use Random for automatic number selection, or type and press Enter. Reset starts a new game."
    },
    {
      title: "Mobile Use",
      text: "On mobile, swipe between the grid and number display. Use the dots at the bottom to navigate."
    }
  ];

  function startWalkthrough() {
    showWalkthrough = true;
    walkStep = 0;
    isOpen = false;
  }

  function nextStep() {
    if (walkStep < walkSteps.length - 1) {
      walkStep++;
    } else {
      showWalkthrough = false;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      if (showWalkthrough) {
        showWalkthrough = false;
      } else if (isOpen) {
        isOpen = false;
      }
    }
  }
</script>

{#if isOpen}
  <div
    class="fixed inset-0 z-50 bg-black/50"
    role="dialog"
    aria-modal="true"
    on:click={() => isOpen = false}
    on:keydown={handleKeydown}
    tabindex="-1"
    transition:fade
  >
    <div
      class="absolute p-4 bg-white shadow-lg bottom-16 left-4 w-80 rounded-xl"
      role="document"
      on:click|stopPropagation
    >
      <h2 class="mb-4 text-2xl font-bold">Help & Information</h2>
      
      <div class="space-y-4">
        <button
          type="button"
          class="w-full px-4 py-2 text-white bg-blue-500 rounded-lg"
          on:click={startWalkthrough}
        >
          Start Walkthrough
        </button>

        <div class="space-y-2">
          <h3 class="font-bold">FAQ</h3>
          <div class="space-y-2 text-sm">
            <p><strong>Q: How do the numbers work?</strong><br>
            This follows the American Bingo numbers: B: 1-15, I: 16-30, N: 31-45, G: 46-60, O: 61-75</p>
            
            <p><strong>Q: Can I undo a called number?</strong><br>
            Yes, click any number in the grid to remove it.</p>
            
            <p><strong>Q: Will I lose my progress if I refresh?</strong><br>
            No, the game state is saved automatically.</p>
          </div>
        </div>

        <div class="space-y-2">
          <h3 class="font-bold">Keyboard Shortcuts</h3>
          <div class="text-sm">
            <p>Space: Random number</p>
            <p>Esc: Close menus</p>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

{#if showWalkthrough}
  <div
    class="fixed inset-0 z-50 bg-black/50"
    role="dialog"
    aria-modal="true"
    on:keydown={handleKeydown}
    tabindex="-1"
    transition:fade
  >
    <div
      class="absolute w-full max-w-md p-6 mx-4 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg top-1/2 left-1/2 rounded-xl"
      role="document"
      on:click|stopPropagation
    >
      <h3 class="mb-2 text-xl font-bold">{walkSteps[walkStep].title}</h3>
      <p class="mb-4">{walkSteps[walkStep].text}</p>
      <button
        type="button"
        class="px-4 py-2 text-white bg-blue-500 rounded-lg"
        on:click={nextStep}
      >
        {walkStep < walkSteps.length - 1 ? 'Next' : 'Finish'}
      </button>
    </div>
  </div>
{/if} 