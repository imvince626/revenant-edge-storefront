<script lang="ts">
  import { fade, scale } from "svelte/transition";
  import { onMount } from "svelte";

  // ── Props ──────────────────────────────────────────────────────────────────
  let { discount = "15%", delayMs = 1600 }: { discount?: string; delayMs?: number } = $props();

  // ── State ──────────────────────────────────────────────────────────────────
  const LS_KEY = "re_newsletter_seen";

  let visible   = $state(false);
  let email     = $state("");
  let error     = $state("");
  let submitted = $state(false); // brief success flash before unmount

  // ── Show-once guard + delayed trigger ─────────────────────────────────────
  $effect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(LS_KEY) === "1") return;

    const timer = setTimeout(() => {
      visible = true;
      // Move focus into the dialog after the transition settles
      setTimeout(() => {
        document.getElementById("nl-email-input")?.focus();
      }, 320);
    }, delayMs);

    return () => clearTimeout(timer);
  });

  // ── Keyboard handler (Escape) ─────────────────────────────────────────────
  $effect(() => {
    if (!visible) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") dismiss();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  // ── Body scroll lock ──────────────────────────────────────────────────────
  $effect(() => {
    if (typeof document === "undefined") return;
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  });

  // ── Helpers ───────────────────────────────────────────────────────────────
  function markSeen() {
    if (typeof window !== "undefined") {
      localStorage.setItem(LS_KEY, "1");
    }
  }

  function dismiss() {
    markSeen();
    visible = false;
  }

  function onBackdropClick(e: MouseEvent) {
    // Only close if the click landed on the backdrop itself, not the card
    if (e.target === e.currentTarget) dismiss();
  }

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    error = "";

    if (!email.trim() || !EMAIL_RE.test(email.trim())) {
      error = "Enter a valid email address.";
      return;
    }

    // TODO: POST email to newsletter endpoint (Klaviyo/Shopify customer) — stub for now
    // Example:
    //   await fetch("/api/newsletter", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ email: email.trim() }),
    //   });
    const capturedEmail = email.trim(); // kept in local scope until endpoint is wired
    void capturedEmail;

    markSeen();
    submitted = true;

    // Show success flash, then unmount
    setTimeout(() => {
      visible = false;
    }, 1200);
  }
</script>

{#if visible}
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <!-- Backdrop -->
  <div
    role="presentation"
    class="fixed inset-0 z-[60] flex items-center justify-center px-4"
    style="background: color-mix(in srgb, var(--color-ink) 70%, transparent);"
    in:fade={{ duration: 280 }}
    out:fade={{ duration: 200 }}
    onclick={onBackdropClick}
    onkeydown={() => {}}
  >
    <!-- Card -->
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="nl-modal-headline"
      class="relative w-full max-w-[28rem] bg-paper border border-line p-8 flex flex-col gap-6 shadow-lg"
      in:scale={{ duration: 280, start: 0.96, opacity: 0 }}
      out:scale={{ duration: 200, start: 0.96, opacity: 0 }}
    >
      <!-- Close (X) button -->
      <button
        type="button"
        aria-label="Close"
        onclick={dismiss}
        class="absolute top-4 right-4 p-1 text-muted hover:text-ink transition-colors"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M3 3L17 17M17 3L3 17"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      </button>

      <!-- Brand eyebrow -->
      <p class="nav-label" style="color: var(--color-ember);">Revenant Edge</p>

      {#if submitted}
        <!-- ── Success state ── -->
        <div class="flex flex-col gap-2 py-4">
          <p
            class="font-display font-bold uppercase text-ink"
            style="font-size: clamp(1.25rem, 3vw, 1.75rem); letter-spacing: -0.03em; line-height: 1.07;"
          >
            You are on the list.
          </p>
          <p class="font-sans text-sm" style="color: var(--color-muted);">
            Watch for the next drop.
          </p>
        </div>
      {:else}
        <!-- ── Capture form ── -->
        <div class="flex flex-col gap-1">
          <h2
            id="nl-modal-headline"
            class="font-display font-bold uppercase text-ink"
            style="font-size: clamp(1.75rem, 4vw, 2.25rem); letter-spacing: -0.03em; line-height: 1.07;"
          >
            Unlock {discount} Off
          </h2>
          <p class="font-sans text-sm" style="color: var(--color-muted);">
            First order. Join the drop list before the next limited run sells out.
          </p>
        </div>

        <form onsubmit={handleSubmit} novalidate class="flex flex-col gap-3">
          <div class="flex flex-col gap-1">
            <label for="nl-email-input" class="sr-only">Email address</label>
            <input
              id="nl-email-input"
              type="email"
              required
              autocomplete="email"
              placeholder="your@email.com"
              bind:value={email}
              class="w-full border border-ink bg-paper font-sans text-sm text-ink px-4 py-3 placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2"
            />
            {#if error}
              <p class="font-sans text-xs" style="color: var(--color-ember);">{error}</p>
            {/if}
          </div>

          <button type="submit" class="button w-full">
            Continue
          </button>
        </form>

        <!-- Dismiss link -->
        <button
          type="button"
          onclick={dismiss}
          class="font-sans text-xs underline underline-offset-4 self-center"
          style="color: var(--color-muted);"
        >
          No Thanks
        </button>
      {/if}
    </div>
  </div>
{/if}
