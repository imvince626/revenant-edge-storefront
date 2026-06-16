<script lang="ts">
  const primaryLinks = [
    { label: "The Vault", href: "/collections/cursed-collection" },
    { label: "Shop Revenant Edge", href: "/collections/shop-all" },
    { label: "Shop Children of the Sea", href: "/collections/collection-1-children-of-the-sea" },
    { label: "Retail", href: "/collections/tees", badge: "NEW" },
    { label: "Explore", href: "/collections/collection-2-children-of-the-sea-all" },
  ];

  const secondaryLinks = [
    { label: "Revenant App", href: "/" },
    { label: "Prestige Loyalty", href: "/collections/demon-slayer" },
    { label: "Outfits", href: "/collections/hoodies" },
    { label: "Behind the Brand", href: "/" },
    { label: "Lookbooks", href: "/collections/borderline" },
    { label: "Client Services", href: "/" },
  ];

  let isOpen = $state(false);

  function open() {
    isOpen = true;
    document.body.style.overflow = "hidden";
  }

  function close() {
    isOpen = false;
    document.body.style.overflow = "";
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") close();
  }
</script>

<!-- Hamburger trigger -->
<button
  class="flex h-10 items-center justify-center text-current transition-opacity hover:opacity-60"
  aria-label="Open navigation menu"
  aria-expanded={isOpen}
  onclick={open}
>
  <span class="nav-label">Shop</span>
</button>

{#if isOpen}
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div
    role="dialog"
    aria-modal="true"
    aria-label="Navigation menu"
    tabindex="-1"
    class="fixed inset-0 z-[100] flex flex-col bg-paper text-ink"
    onkeydown={onKeyDown}
  >
    <div class="flex items-center justify-between px-6 py-5">
      <button
        class="nav-label inline-flex items-center gap-2 text-ink"
        aria-label="Close navigation menu"
        onclick={close}
      >
        <span aria-hidden="true">←</span>
        Close
      </button>

      <div class="flex items-center gap-5 text-ink">
        <a href="/collections/cursed-collection" onclick={close} aria-label="The Vault" class="nav-label">Vault</a>
        <a href="/collections/shop-all" onclick={close} aria-label="Cart" class="nav-label">Bag</a>
      </div>
    </div>

    <div class="px-6">
      <label class="sr-only" for="mobile-menu-search">Search</label>
      <input
        id="mobile-menu-search"
        type="search"
        placeholder="Search for..."
        class="w-full border-0 border-b border-ink bg-paper px-0 py-3 font-sans text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-0"
      />
    </div>

    <nav class="flex flex-col gap-1 px-6 py-6" aria-label="Main menu">
      {#each primaryLinks as link}
        <a
          href={link.href}
          onclick={close}
          class="flex items-center justify-between py-1 font-display text-[1.55rem] font-bold leading-tight text-ink transition-opacity hover:opacity-60"
        >
          <span>
            {link.label}
            {#if link.badge}
              <span class="nav-label ml-2 align-super text-[8px] text-ink">{link.badge}</span>
            {/if}
          </span>
          <span class="font-sans text-base" aria-hidden="true">›</span>
        </a>
      {/each}
    </nav>

    <div class="mx-6 mt-2 overflow-hidden bg-ink text-paper">
      <div class="flex min-h-[202px] flex-col justify-end p-5">
        <p class="font-display text-lg font-bold uppercase leading-none">Revenant Prestige</p>
        <p class="mt-3 max-w-[22ch] font-sans text-xs text-paper/70">
          Early access, drop alerts, and member rewards.
        </p>
        <a href="/collections/demon-slayer" onclick={close} class="nav-label mt-5 inline-flex w-fit bg-paper px-4 py-3 text-ink">
          Join now
        </a>
      </div>
    </div>

    <nav class="mt-auto flex flex-col px-6 pb-8" aria-label="Secondary menu">
      {#each secondaryLinks as link}
        <a
          href={link.href}
          onclick={close}
          class="flex items-center justify-between py-1 font-sans text-sm font-semibold text-ink"
        >
          <span>{link.label}</span>
          {#if link.label === "Client Services"}
            <span aria-hidden="true">›</span>
          {/if}
        </a>
      {/each}

      <p class="mt-10 font-sans text-xs text-ink">US / $ / English</p>
    </nav>
  </div>
{/if}
