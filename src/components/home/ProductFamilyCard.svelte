<script lang="ts">
  interface Money {
    amount: string;
    currencyCode: string;
  }

  interface ImageLike {
    url: string;
    width?: number;
    height?: number;
    altText?: string | null;
  }

  interface Colorway {
    id: string;
    title: string;
    handle: string;
    color: string;
    swatch: string;
    image: ImageLike | null;
    hoverImage: ImageLike | null;
    price: Money;
  }

  interface Props {
    title: string;
    colorways: Colorway[];
  }

  let { title, colorways }: Props = $props();
  let selectedIndex = $state(0);

  let selected = $derived(colorways[selectedIndex] ?? colorways[0]);
  let hasHover = $derived(!!selected?.hoverImage);

  function formatPrice(price: Money | undefined) {
    if (!price) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: price.currencyCode,
      currencyDisplay: "narrowSymbol",
    }).format(parseFloat(price.amount));
  }

  function imageUrl(image: ImageLike | null | undefined, width: number) {
    if (!image?.url) return "";
    return `${image.url}&width=${width}`;
  }
</script>

{#if selected}
  <article class="group block">
    <div class="relative aspect-[187/251] overflow-hidden bg-surface transition-all duration-[280ms] group-hover:z-10">
      <a href={`/products/${selected.handle}`} aria-label={`View ${title} in ${selected.color}`} class="block h-full w-full">
        {#if selected.image}
          <img
            src={imageUrl(selected.image, 900)}
            alt={selected.image.altText || selected.title}
            width={selected.image.width}
            height={selected.image.height}
            loading="lazy"
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            class={[
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-[280ms]",
              hasHover ? "group-hover:opacity-0" : "group-hover:scale-[1.02]",
            ].join(" ")}
            style="transition-timing-function: var(--ease-standard);"
          />
        {/if}

        {#if selected.hoverImage}
          <img
            src={imageUrl(selected.hoverImage, 900)}
            alt={selected.hoverImage.altText || `${selected.title} alternate view`}
            width={selected.hoverImage.width}
            height={selected.hoverImage.height}
            loading="lazy"
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            class="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-[280ms] group-hover:opacity-100"
            style="transition-timing-function: var(--ease-standard);"
          />
        {/if}
      </a>

      <div class="absolute bottom-0 left-0 right-0 flex h-12 items-center justify-between border-t border-paper bg-paper px-4">
        <p class="font-sans text-sm font-semibold text-ink">Now Live</p>
        <a href={`/products/${selected.handle}`} aria-label={`Quick view ${selected.title}`} class="flex h-8 w-8 items-center justify-center font-sans text-2xl text-ink">
          +
        </a>
      </div>
    </div>

    <div class="px-0 pt-4">
      <div class="flex items-start justify-between gap-4">
        <h3 class="font-sans text-[13px] font-semibold leading-snug text-ink">{title}</h3>
        <p class="shrink-0 font-sans text-[13px] font-semibold text-ink">{formatPrice(selected.price)}</p>
      </div>

      <p class="mt-1 font-sans text-[13px] font-semibold text-muted">{selected.color}</p>

      {#if colorways.length > 1}
        <div class="mt-4 flex flex-wrap items-center gap-2" aria-label={`${title} colors`}>
          {#each colorways as colorway, index}
            <button
              type="button"
              aria-label={`Select ${colorway.color}`}
              aria-pressed={selectedIndex === index}
              onclick={() => {
                selectedIndex = index;
              }}
              class={[
                "h-[18px] w-[18px] rounded-full border transition-transform",
                selectedIndex === index ? "scale-110 border-ink" : "border-line",
              ].join(" ")}
              style={`background-color: ${colorway.swatch};`}
            ></button>
          {/each}
          <span class="font-sans text-[13px] font-semibold text-muted">
            {colorways.length} Colors
          </span>
        </div>
      {/if}
    </div>
  </article>
{/if}
