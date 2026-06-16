<script lang="ts">
  const primaryLinks = [
    { label: "About Us", href: "/" },
    { label: "Shop Revenant Edge", href: "/collections/shop-all" },
    { label: "Shop Children of the Sea", href: "/collections/collection-1-children-of-the-sea" },
    { label: "Retail", href: "/collections/tees", badge: "NEW" },
    { label: "Explore", href: "/collections/collection-2-children-of-the-sea-all" },
  ];

  const secondaryLinks = [
    { label: "Revenant App", href: "/" },
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
    class="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-paper text-ink"
    onkeydown={onKeyDown}
  >
    <div class="flex items-center justify-between px-7 py-5">
      <button
        class="inline-flex items-center gap-2 font-sans text-[13px] font-semibold leading-none text-ink"
        aria-label="Close navigation menu"
        onclick={close}
      >
        <span aria-hidden="true">←</span>
        Close
      </button>

      <div class="flex items-center gap-5 text-ink">
        <a href="/collections/shop-all" onclick={close} aria-label="Cart" class="mobile-menu-icon mobile-menu-icon--bag"></a>
      </div>
    </div>

    <div class="px-7">
      <label class="sr-only" for="mobile-menu-search">Search</label>
      <input
        id="mobile-menu-search"
        type="search"
        placeholder="Search for..."
        class="w-full border-0 border-b border-ink bg-paper px-0 py-3 font-sans text-[12px] text-ink placeholder:text-muted focus:outline-none focus:ring-0"
      />
    </div>

    <nav class="flex flex-col gap-1 px-7 py-6" aria-label="Main menu">
      {#each primaryLinks as link}
        <a
          href={link.href}
          onclick={close}
          class="flex items-center justify-between gap-4 py-0.5 font-display text-[1.35rem] font-bold leading-[1.22] text-ink transition-opacity hover:opacity-60"
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

    <nav class="mt-auto flex flex-col px-7 pb-8 pt-20" aria-label="Secondary menu">
      {#each secondaryLinks as link}
        <a
          href={link.href}
          onclick={close}
          class="flex items-center justify-between py-0.5 font-sans text-[13px] font-semibold leading-snug text-ink"
        >
          <span>{link.label}</span>
          {#if link.label === "Client Services"}
            <span aria-hidden="true">›</span>
          {/if}
        </a>
      {/each}

      <p class="mt-10 font-sans text-[12px] text-ink">US / $ / English</p>
    </nav>
  </div>
{/if}

<style>
  .mobile-menu-icon {
    position: relative;
    display: block;
    height: 22px;
    width: 22px;
  }

  .mobile-menu-icon--bookmark::before {
    content: "";
    position: absolute;
    inset: 2px 5px 1px;
    border: 1.5px solid currentColor;
    border-bottom: 0;
  }

  .mobile-menu-icon--bookmark::after {
    content: "";
    position: absolute;
    bottom: 1px;
    left: 5px;
    width: 12px;
    height: 9px;
    border-left: 1.5px solid currentColor;
    border-right: 1.5px solid currentColor;
    clip-path: polygon(0 0, 50% 45%, 100% 0, 100% 100%, 0 100%);
  }

  .mobile-menu-icon--bag::before {
    content: "";
    position: absolute;
    inset: 7px 3px 2px;
    border: 1.5px solid currentColor;
  }

  .mobile-menu-icon--bag::after {
    content: "";
    position: absolute;
    left: 7px;
    top: 2px;
    width: 8px;
    height: 8px;
    border: 1.5px solid currentColor;
    border-bottom: 0;
    border-radius: 8px 8px 0 0;
  }
</style>
