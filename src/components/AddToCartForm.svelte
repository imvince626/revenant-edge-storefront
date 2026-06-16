<script lang="ts">
  import { preventDefault } from 'svelte/legacy';
  import type { z } from "zod";
  import type { VariantResult, ProductResult } from "../utils/schemas";

  import { addCartItem, isCartUpdating, cart } from "../stores/cart";
  import { trackAddToCart } from "../utils/analytics";

  interface Props {
    variantId: string;
    variantQuantityAvailable: number;
    variantAvailableForSale: boolean;
    variants?: z.infer<typeof VariantResult>[];
    product?: z.infer<typeof ProductResult>;
  }

  let { variantId: initialVariantId, variantQuantityAvailable: initialQty, variantAvailableForSale: initialAvailable, variants = [], product = null }: Props = $props();

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
</script>

<!-- Size / variant selector (only rendered when variants are provided) -->
{#if variants.length > 1}
  <div class="mb-4">
    <div class="mb-3 flex items-center justify-between">
      <div class="flex items-center gap-6">
        <p class="font-sans text-sm font-semibold text-ink">Size</p>
        <a href="/pages/size-guide" class="font-sans text-xs font-semibold text-muted underline underline-offset-4">Size Not In Stock?</a>
      </div>
      <a href="/pages/size-guide" class="font-sans text-xs font-semibold text-muted underline underline-offset-4">Size Chart</a>
    </div>
    <div class="grid grid-cols-5 gap-1">
      {#each variants as v}
        <button
          type="button"
          onclick={() => { selectedVariantId = v.id; }}
          disabled={!v.availableForSale}
          aria-pressed={selectedVariantId === v.id}
          class={[
            "font-sans text-xs font-semibold",
            "flex h-12 min-w-[3rem] items-center justify-center px-3",
            "border transition-colors",
            "disabled:cursor-not-allowed disabled:opacity-35",
            selectedVariantId === v.id
              ? "border-ink bg-ink text-paper"
              : "border-line bg-paper text-ink hover:border-ink",
          ].join(" ")}
        >
          {v.title}
        </button>
      {/each}
    </div>
  </div>
{/if}

<form onsubmit={preventDefault((e) => addToCart(e))}>
  <input type="hidden" name="id" value={activeVariantId} />
  <input type="hidden" name="quantity" value="1" />

  <button
    type="submit"
    class={[
      "font-sans text-sm font-semibold uppercase",
      "flex w-full items-center justify-center gap-3",
      "bg-ink text-paper px-8 py-4",
      "transition-all duration-[280ms]",
      "hover:bg-ember-700",
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
