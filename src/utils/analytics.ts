/**
 * analytics.ts — GA4 / Enhanced-Ecommerce dataLayer helpers
 *
 * All helpers are SSR-safe (guard on typeof window !== 'undefined').
 * Only fires when window.dataLayer exists (i.e. GTM container is loaded).
 * No external dependencies.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

interface MoneyV2 {
  amount: string;
  currencyCode?: string;
}

interface VariantLike {
  id: string;
  title?: string;
  price?: MoneyV2 | null;
}

interface ProductLike {
  id: string;
  title: string;
  variants?: {
    nodes?: VariantLike[];
  };
  featuredImage?: { url?: string } | null;
}

interface GA4Item {
  item_id: string;
  item_name: string;
  item_variant?: string;
  price: number;
  quantity: number;
  currency: string;
}

// ─── Core push ────────────────────────────────────────────────────────────────

/**
 * Pushes a payload to window.dataLayer.
 * Always clears ecommerce first to prevent state bleed between events.
 */
export function pushToDataLayer(payload: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const dl = (window as any).dataLayer;
  if (!Array.isArray(dl)) return;

  // Clear previous ecommerce object before every push (GA4 best practice)
  dl.push({ ecommerce: null });
  dl.push(payload);
}

// ─── GMC item_id helper ───────────────────────────────────────────────────────

/**
 * Returns the Google Merchant Center feed id format:
 *   shopify_US_<numericProductId>_<numericVariantId>
 *
 * Strips the GID prefix:
 *   gid://shopify/Product/12345       -> 12345
 *   gid://shopify/ProductVariant/678  -> 678
 */
export function gmcId(productId: string, variantId: string): string {
  const numericProduct = productId.replace(/^gid:\/\/shopify\/Product\//, "");
  const numericVariant = variantId.replace(/^gid:\/\/shopify\/ProductVariant\//, "");
  return `shopify_US_${numericProduct}_${numericVariant}`;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function parsePrice(money: MoneyV2 | null | undefined): number {
  if (!money?.amount) return 0;
  const n = parseFloat(money.amount);
  return isNaN(n) ? 0 : n;
}

function buildItem(
  product: ProductLike,
  variant: VariantLike,
  quantity: number
): GA4Item {
  const price = parsePrice(variant.price);
  return {
    item_id: gmcId(product.id, variant.id),
    item_name: product.title ?? "",
    item_variant: variant.title ?? undefined,
    price,
    quantity,
    currency: "USD",
  };
}

function pickVariant(product: ProductLike, selected?: VariantLike | null): VariantLike | undefined {
  if (selected) return selected;
  return product.variants?.nodes?.[0];
}

// ─── Public event helpers ─────────────────────────────────────────────────────

/**
 * GA4 view_item — fire on PDP load.
 */
export function trackViewItem(
  product: ProductLike,
  selectedVariant?: VariantLike | null
): void {
  const variant = pickVariant(product, selectedVariant);
  if (!variant) return;

  const item = buildItem(product, variant, 1);

  pushToDataLayer({
    event: "view_item",
    ecommerce: {
      currency: "USD",
      value: item.price,
      items: [item],
    },
  });
}

/**
 * GA4 view_item_list — fire on product grid load.
 */
export function trackViewItemList(
  listName: string,
  products: ProductLike[]
): void {
  const items: GA4Item[] = [];

  for (const product of products) {
    const variant = product.variants?.nodes?.[0];
    if (!variant) continue;
    items.push({ ...buildItem(product, variant, 1), index: items.length } as GA4Item & { index: number });
  }

  if (items.length === 0) return;

  pushToDataLayer({
    event: "view_item_list",
    ecommerce: {
      item_list_name: listName,
      items,
    },
  });
}

/**
 * GA4 add_to_cart — fire when user adds a product to cart.
 * Do NOT call this for checkout/purchase events (those fire via Shopify Web Pixels).
 */
export function trackAddToCart(
  product: ProductLike,
  variant: VariantLike,
  quantity: number
): void {
  const item = buildItem(product, variant, quantity);
  const value = item.price * quantity;

  pushToDataLayer({
    event: "add_to_cart",
    ecommerce: {
      currency: "USD",
      value,
      items: [{ ...item, quantity }],
    },
  });
}
