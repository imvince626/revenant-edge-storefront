<script lang="ts">
  import { preventDefault } from 'svelte/legacy';
  import { onMount } from "svelte";
  import type { z } from "zod";
  import type { VariantResult, ProductResult } from "../utils/schemas";

  import { addCartItem, isCartUpdating, cart, isCartDrawerOpen } from "../stores/cart";
  import { trackAddToCart } from "../utils/analytics";

  interface Props {
    variantId: string;
    variantQuantityAvailable: number;
    variantAvailableForSale: boolean;
    variants?: z.infer<typeof VariantResult>[];
    product?: z.infer<typeof ProductResult>;
  }

  let { variantId: initialVariantId, variantQuantityAvailable: initialQty, variantAvailableForSale: initialAvailable, variants = [], product = null }: Props = $props();
  let formEl: HTMLFormElement;
  let inlineSubmitEl: HTMLButtonElement;
  let stickyVisible = $state(false);
  let showStickyCta = $derived(stickyVisible && !$isCartDrawerOpen);

  function getInitialVariantId() {
    return initialVariantId;
  }

  // Selected variant state starts with the variant passed from the server.
  let selectedVariantId = $state(getInitialVariantId());

  // Derive current variant object from selection
  let selectedVariant = $derived(
    variants.length > 0
      ? variants.find((v) => v.id === selectedVariantId) ?? variants[0]
      : null
  );

  // Use derived variant data when variants are provided, fall back to props
  let activeVariantId = $derived(selectedVariant?.id ?? initialVariantId);
  let activeAvailableForSale = $derived(selectedVariant?.availableForSale ?? initialAvailable);
  let activeQty = $derived(selectedVariant?.quantityAvailable ?? initialQty);

  // Check if the variant is already in the cart and if there are any units left
  let variantInCart = $derived(
    $cart && $cart.lines?.nodes.filter((item) => item.merchandise.id === activeVariantId)[0]
  );
  let noQuantityLeft = $derived(
    variantInCart && activeQty <= variantInCart?.quantity
  );

  function addToCart(e: Event) {
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const { id, quantity } = Object.fromEntries(formData);
    const qty = parseInt(quantity as string);
    const item = {
      id: id as string,
      quantity: qty,
    };

    // Fire add_to_cart analytics alongside (not replacing) the store call.
    // Only when product context is available; never fires checkout/purchase events.
    if (product && selectedVariant) {
      trackAddToCart(product, selectedVariant, qty);
    }

    addCartItem(item);
  }

  function submitFromSticky() {
    if (!formEl) return;
    if (typeof formEl.requestSubmit === "function") {
      formEl.requestSubmit();
      return;
    }
    formEl.dispatchEvent(new SubmitEvent("submit", { cancelable: true, bubbles: true }));
  }

  onMount(() => {
    const media = window.matchMedia("(max-width: 767px)");
    let observer: IntersectionObserver | null = null;

    function updateStickyState() {
      stickyVisible = media.matches;
    }

    function observeInlineButton() {
      observer?.disconnect();
      observer = null;

      if (!inlineSubmitEl) {
        updateStickyState();
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          stickyVisible = media.matches && !entry.isIntersecting;
        },
        { threshold: 0.35 }
      );
      observer.observe(inlineSubmitEl);
    }

    observeInlineButton();
    media.addEventListener("change", observeInlineButton);

    return () => {
      observer?.disconnect();
      media.removeEventListener("change", observeInlineButton);
    };
  });
</script>

<!-- Size / variant selector (only rendered when variants are provided) -->
{#if variants.length > 1}
  <div class="mb-4">
    <div class="mb-5">
      <div class="flex items-center gap-6">
        <p class="font-sans text-sm font-semibold text-ink">Size</p>
      </div>
    </div>
    <div
      class="grid gap-1"
      style={`grid-template-columns: repeat(${variants.length}, minmax(0, 1fr));`}
    >
      {#each variants as v}
        <button
          type="button"
          onclick={() => { selectedVariantId = v.id; }}
          disabled={!v.availableForSale}
          aria-pressed={selectedVariantId === v.id}
          class={[
            "font-sans text-xs font-semibold",
            "relative flex h-10 min-w-0 items-center justify-center px-1",
            "transition-colors",
            "disabled:cursor-not-allowed disabled:text-faint",
            selectedVariantId === v.id
              ? "bg-paper text-ink ring-1 ring-inset ring-ink"
              : "bg-surface text-ink hover:ring-1 hover:ring-inset hover:ring-ink",
            !v.availableForSale ? "after:absolute after:left-0 after:top-0 after:h-px after:w-[145%] after:origin-top-left after:rotate-[155deg] after:bg-line" : "",
          ].join(" ")}
        >
          {v.title}
        </button>
      {/each}
    </div>
  </div>
{/if}

<form bind:this={formEl} onsubmit={preventDefault((e) => addToCart(e))}>
  <input type="hidden" name="id" value={activeVariantId} />
  <input type="hidden" name="quantity" value="1" />

  <button
    bind:this={inlineSubmitEl}
    type="submit"
    class={[
      "font-sans text-sm font-semibold uppercase",
      "flex w-full items-center justify-center gap-3",
      "h-[52px] bg-ink text-paper px-8",
      "transition-[transform,box-shadow] duration-[180ms]",
      "hover:-translate-y-px hover:shadow-[inset_0_0_0_1px_var(--color-ink),0_10px_22px_rgba(10,10,10,0.18)]",
      "active:translate-y-0 active:shadow-none",
      "focus:ring-2 focus:ring-ink focus:ring-offset-2 focus:outline-none",
      "disabled:cursor-not-allowed disabled:opacity-40",
    ].join(" ")}
    disabled={$isCartUpdating || noQuantityLeft || !activeAvailableForSale}
  >
    {#if $isCartUpdating}
      <svg
        class="animate-spin h-4 w-4 text-paper"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    {/if}
    {#if activeAvailableForSale}
      Add to Cart
    {:else}
      Sold out
    {/if}
  </button>

  {#if noQuantityLeft}
    <p class="mt-2 text-center text-xs text-muted">All units left are in your cart</p>
  {/if}
</form>

<div
  class={[
    "fixed inset-x-0 bottom-0 z-[55] md:hidden",
    "transition-transform duration-[220ms]",
    showStickyCta ? "translate-y-0" : "pointer-events-none translate-y-full",
  ].join(" ")}
  aria-hidden={!showStickyCta}
>
  <button
    type="button"
    onclick={submitFromSticky}
    class={[
      "font-sans text-sm font-semibold uppercase",
      "flex h-14 w-full items-center justify-center gap-3",
      "bg-ink px-8 text-paper",
      "transition-[transform,box-shadow] duration-[180ms]",
      "active:translate-y-0 active:shadow-none",
      "disabled:cursor-not-allowed disabled:opacity-40",
    ].join(" ")}
    disabled={$isCartUpdating || noQuantityLeft || !activeAvailableForSale}
    tabindex={showStickyCta ? 0 : -1}
  >
    {#if $isCartUpdating}
      <svg
        class="animate-spin h-4 w-4 text-paper"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    {/if}
    {#if activeAvailableForSale}
      Add to Cart
    {:else}
      Sold out
    {/if}
  </button>
</div>
