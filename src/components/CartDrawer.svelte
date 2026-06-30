<script lang="ts">
  import { run } from 'svelte/legacy';

  import { fade, fly } from "svelte/transition";
  import {
    cart,
    isCartDrawerOpen,
    removeCartItems,
    isCartUpdating,
  } from "../stores/cart";
  import ShopifyImage from "./ShopifyImage.svelte";
  import Money from "./Money.svelte";
  import { clickOutside } from "../utils/click-outside";

  let cartDrawerEl: HTMLDivElement = $state();

  // Add classes to cart line items if cart is updating
  let cartIsUpdatingClass = $derived($isCartUpdating
    ? "opacity-50 pointer-events-none"
    : "");

  // Total item count for bag label
  let itemCount = $derived($cart?.totalQuantity ?? 0);

  // Add focus to cart drawer when it opens
  run(() => {
    if ($isCartDrawerOpen) {
      document.querySelector("body")?.classList.add("overflow-hidden");
      cartDrawerEl?.focus();
    }
  });

  function removeItem(id: string) {
    removeCartItems([id]);
  }

  function closeCartDrawer() {
    document.querySelector("body")?.classList.remove("overflow-hidden");
    isCartDrawerOpen.set(false);
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      closeCartDrawer();
    }
  }
</script>

{#if $isCartDrawerOpen}
  <!-- Dialog wrapper -->
  <div
    class="relative z-[90]"
    aria-labelledby="cart-drawer-title"
    role="dialog"
    aria-modal="true"
  >
    <!-- Backdrop scrim -->
    <div
      in:fade={{ duration: 280 }}
      out:fade={{ duration: 280 }}
      class="fixed inset-0 bg-ink/60"
      aria-hidden="true"
    ></div>

    <div class="fixed inset-0 overflow-hidden">
      <div class="absolute inset-0 overflow-hidden">
        <div
          role="document"
          class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full focus:outline-none"
          tabindex="-1"
          use:clickOutside={() => closeCartDrawer()}
          bind:this={cartDrawerEl}
          onkeydown={onKeyDown}
        >
          <!-- Drawer panel -->
          <div
            in:fly={{ duration: 280, x: 420, opacity: 1, easing: (t) => t }}
            out:fly={{ duration: 280, x: 420, opacity: 1, easing: (t) => t }}
            class="pointer-events-auto w-screen max-w-[420px] flex flex-col max-h-screen bg-paper text-ink"
          >

            <!-- ── Top bar ── -->
            <div class="flex items-center justify-between px-6 py-5 border-b border-line">
              <h2
                id="cart-drawer-title"
                class="nav-label text-ink flex items-center gap-3"
              >
                Your Bag
                {#if itemCount > 0}
                  <span class="nav-label text-muted">({itemCount})</span>
                {/if}
                {#if $isCartUpdating}
                  <svg
                    class="animate-spin h-3.5 w-3.5 text-muted"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                {/if}
              </h2>

              <button
                onclick={() => closeCartDrawer()}
                type="button"
                aria-label="Close cart"
                class="p-1 text-muted hover:text-ink transition-colors"
              >
                <svg
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- ── Line items (scrollable) ── -->
            <div class="flex-1 overflow-y-auto px-6">
              {#if $cart && $cart.lines?.nodes.length > 0}
                <ul class="divide-y divide-line {cartIsUpdatingClass}">
                  {#each $cart.lines?.nodes as item}
                    <li class="flex gap-4 py-6">
                      <!-- Thumbnail -->
                      <div class="w-20 h-20 shrink-0 bg-surface overflow-hidden">
                        <ShopifyImage
                          image={item.merchandise.image}
                          classList="object-contain w-full h-full"
                          sizes="(min-width: 80px) 80px"
                          loading="lazy"
                        />
                      </div>

                      <!-- Info + controls -->
                      <div class="flex flex-1 flex-col gap-1 min-w-0">
                        <div class="flex justify-between gap-2">
                          <a
                            href={`/products/${item.merchandise.product.handle}`}
                            class="font-sans text-sm font-medium text-ink hover:text-ember transition-colors leading-snug truncate"
                          >
                            {item.merchandise.product.title}
                          </a>
                          <!-- Line total -->
                          <span class="font-sans text-sm font-medium text-ink shrink-0">
                            <Money price={item.cost.totalAmount} showCurrency={false} />
                          </span>
                        </div>

                        <!-- Variant / size -->
                        {#if item.merchandise.title && item.merchandise.title !== "Default Title"}
                          <p class="nav-label text-muted text-[10px]">{item.merchandise.title}</p>
                        {/if}

                        <!-- Unit price -->
                        <p class="font-sans text-xs text-muted">
                          <Money price={item.cost.amountPerQuantity} showCurrency={false} /> each
                        </p>

                        <!-- Qty + Remove row -->
                        <div class="mt-auto flex items-center justify-between pt-2">
                          <span class="nav-label text-muted text-[10px]">Qty {item.quantity}</span>
                          <button
                            onclick={() => removeItem(item.id)}
                            type="button"
                            disabled={$isCartUpdating}
                            aria-label="Remove {item.merchandise.product.title} from cart"
                            class="nav-label text-[10px] text-muted hover:text-ember transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  {/each}
                </ul>
              {:else}
                <!-- Empty state -->
                <div class="flex flex-col items-center justify-center h-full py-24 gap-6 text-center">
                  <p class="nav-label text-muted">Your bag is empty</p>
                  <button
                    type="button"
                    onclick={() => closeCartDrawer()}
                    class="nav-label text-xs text-ink underline underline-offset-4 hover:text-ember transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              {/if}
            </div>

            <!-- ── Drawer footer (only when cart has items) ── -->
            {#if $cart && $cart.lines?.nodes.length > 0}
              <div class="px-6 py-6 border-t border-line space-y-4">
                <!-- Subtotal row -->
                <div class="flex items-center justify-between">
                  <span class="nav-label text-ink">Subtotal</span>
                  <span class="font-sans text-sm font-semibold text-ink">
                    <Money price={$cart.cost.subtotalAmount} showCurrency={true} />
                  </span>
                </div>

                <!-- Shipping note -->
                <p class="font-sans text-xs text-muted">
                  Shipping &amp; taxes calculated at checkout.
                </p>

                <!-- Checkout CTA -->
                <a
                  href={$cart.checkoutUrl}
                  class="button w-full"
                  aria-label="Proceed to checkout"
                >
                  Checkout
                </a>
              </div>
            {/if}

          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
