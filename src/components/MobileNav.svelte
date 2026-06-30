<script lang="ts">
  const primaryLinks = [
    { label: "Shop Children of the Sea", href: "/collections/collection-1-children-of-the-sea" },
    { label: "Shop Demon Slayer", href: "/collections/demon-slayer" },
    { label: "Lookbook", href: "/blogs/lookbook" },
    { label: "Behind the Brand", href: "/about" },
  ];

  const secondaryLinks = [
    { label: "Retail", href: "/retail" },
    { label: "Contact", href: "/contact" },
    { label: "Size Guide", href: "/pages/size-guide" },
    { label: "Returns", href: "/pages/returns-exchanges-and-refunds" },
    { label: "Privacy Policy", href: "/privacy-policy" },
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

      <a href="/" onclick={close} class="inline-flex transition-opacity hover:opacity-70" aria-label="Revenant Edge home">
        <img
          src="/logo-mark-ink.png"
          alt="Revenant Edge"
          class="h-auto w-[6.75rem]"
          width="2018"
          height="616"
          loading="eager"
        />
      </a>
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
        </a>
      {/each}

      <p class="mt-10 font-sans text-[12px] text-ink">US / $ / English</p>
    </nav>
  </div>
{/if}

<style>
</style>
