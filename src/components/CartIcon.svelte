<script lang="ts">
  import { onMount } from "svelte";
  import { initCart, cart, isCartDrawerOpen } from "../stores/cart";

  onMount(() => {
    initCart();
  });

  function openCart() {
    isCartDrawerOpen.set(true);
  }
</script>

<div>
  <button
    class="relative flex h-10 w-10 items-center justify-center text-current transition-opacity hover:opacity-60"
    onclick={() => openCart()}
    aria-label="Open your cart"
  >
    <span class="sr-only">Open your cart</span>
    <!-- Bag icon — inherits currentColor so it adapts to transparent/solid header states -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="h-[22px] w-[22px] pointer-events-none"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
      />
    </svg>
    {#if $cart && $cart.totalQuantity > 0}
      <span
        class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-ember text-[10px] font-semibold text-paper"
        aria-label="{$cart.totalQuantity} items in cart"
      >
        {$cart.totalQuantity}
      </span>
    {/if}
  </button>
</div>
