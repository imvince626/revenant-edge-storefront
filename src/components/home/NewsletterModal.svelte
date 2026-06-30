<script lang="ts">
  import { fade, scale } from "svelte/transition";

  let { delayMs = 1600 }: { discount?: string; delayMs?: number } = $props();

  const LS_KEY = "re_newsletter_seen";
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let visible = $state(false);
  let email = $state("");
  let phone = $state("");
  let error = $state("");
  let isSubmitting = $state(false);
  let step = $state<"email" | "confirm">("email");

  $effect(() => {
    if (typeof window === "undefined") return;
    const forcePreview = new URLSearchParams(window.location.search).get("preview") === "newsletter";
    if (!forcePreview && localStorage.getItem(LS_KEY) === "1") return;

    const timer = setTimeout(() => {
      visible = true;
      setTimeout(() => {
        document.getElementById("nl-email-input")?.focus();
      }, 320);
    }, delayMs);

    return () => clearTimeout(timer);
  });

  $effect(() => {
    if (!visible) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") dismiss();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  $effect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = visible ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  });

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
    if (e.target === e.currentTarget) dismiss();
  }

  async function handleEmailSubmit(e: SubmitEvent) {
    e.preventDefault();
    error = "";

    if (!email.trim() || !EMAIL_RE.test(email.trim())) {
      error = "Enter a valid email address.";
      return;
    }

    isSubmitting = true;

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), phone: phone.trim() || undefined }),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Signup failed");
      }

      markSeen();
      step = "confirm";
    } catch (_) {
      error = "We could not sign you up. Email hello@revenantedge.com.";
    } finally {
      isSubmitting = false;
    }
  }
</script>

{#if visible}
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div
    role="presentation"
    class="fixed inset-0 z-[60] flex items-center justify-center px-5 py-6 sm:px-6"
    style="background: color-mix(in srgb, var(--color-ink) 72%, transparent);"
    in:fade={{ duration: 240 }}
    out:fade={{ duration: 180 }}
    onclick={onBackdropClick}
    onkeydown={() => {}}
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="nl-modal-headline"
      class="newsletter-modal relative grid w-full max-w-[58rem] overflow-hidden bg-ink text-paper shadow-2xl md:grid-cols-[0.9fr_1fr]"
      in:scale={{ duration: 260, start: 0.97, opacity: 0 }}
      out:scale={{ duration: 180, start: 0.97, opacity: 0 }}
    >
      <div class="relative hidden min-h-[28rem] bg-surface md:block">
        <img
          src="/hero-loop-poster.jpg"
          alt=""
          class="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
      </div>

      <div class="newsletter-panel relative flex min-h-[28rem] flex-col justify-center overflow-y-auto px-6 py-8 sm:px-9 md:py-8 lg:px-10">
        <button
          type="button"
          aria-label="Close"
          onclick={dismiss}
          class="absolute right-4 top-4 grid h-9 w-9 place-items-center text-paper transition-opacity hover:opacity-70 md:right-5 md:top-5"
        >
          <span class="newsletter-close" aria-hidden="true"></span>
        </button>

        <div class="mx-auto flex w-full max-w-[26rem] flex-col items-center text-center">
          <img src="/logo-mark-white.png" alt="Revenant Edge" class="mb-5 h-auto w-[6.6rem]" loading="eager" />

          {#if step === "confirm"}
            <div class="mb-14 grid h-[8.5rem] w-[5rem] place-items-center rounded-[1.1rem] border-[0.35rem] border-paper">
              <span class="block h-5 w-10 rounded-sm border-[0.3rem] border-paper"></span>
            </div>
            <h2
              id="nl-modal-headline"
              class="font-display text-[clamp(2.2rem,4.2vw,3.6rem)] font-black uppercase leading-[0.92] tracking-normal text-paper"
            >
              You're On The List
            </h2>
            <p class="mt-4 font-display text-[clamp(0.95rem,1.25vw,1.15rem)] font-black leading-tight text-paper">
              Watch your inbox for drop alerts and early access.
            </p>
          {:else}
            <h2
              id="nl-modal-headline"
              class="font-display text-[clamp(2.65rem,4.5vw,4rem)] font-black uppercase leading-[0.9] tracking-normal text-paper"
            >
              <span class="block whitespace-nowrap">Get Drop</span>
              <span class="block">Access</span>
            </h2>
            <p class="mt-4 max-w-[22rem] font-display text-[clamp(0.95rem,1.2vw,1.1rem)] font-black leading-tight text-paper">
              Join for release alerts, early access, and restock notes.
            </p>

            {#if step === "email"}
              <form onsubmit={handleEmailSubmit} novalidate class="mt-6 flex w-full flex-col">
                <label for="nl-email-input" class="sr-only">Email address</label>
                <div class="relative">
                  <input
                    id="nl-email-input"
                    type="email"
                    required
                    autocomplete="email"
                    placeholder="Email Address"
                    bind:value={email}
                    class="newsletter-input pr-16"
                  />
                  <span class="newsletter-chat" aria-hidden="true">•••</span>
                </div>
                <label for="nl-phone-input" class="sr-only">Mobile number optional</label>
                <input
                  id="nl-phone-input"
                  type="tel"
                  autocomplete="tel"
                  placeholder="Mobile Number (Optional)"
                  bind:value={phone}
                  class="newsletter-input mt-3"
                />
                {#if error}
                  <p class="mt-3 text-left font-sans text-sm font-semibold text-paper">{error}</p>
                {/if}
                <button type="submit" class="newsletter-submit" disabled={isSubmitting}>
                  {isSubmitting ? "Signing Up" : "Sign Up"}
                </button>
              </form>
            {/if}
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .newsletter-modal {
    max-height: min(80vh, 40rem);
  }

  .newsletter-close,
  .newsletter-close::after {
    display: block;
    height: 0.13rem;
    width: 1.7rem;
    background: var(--color-paper);
    content: "";
  }

  .newsletter-close {
    transform: rotate(45deg);
  }

  .newsletter-close::after {
    transform: rotate(90deg);
  }

  .newsletter-input {
    min-height: 3.55rem;
    width: 100%;
    border: 0.12rem solid var(--color-ember);
    background: var(--color-paper);
    padding: 0 1.25rem;
    color: var(--color-ink);
    font-family: var(--font-display);
    font-size: clamp(0.95rem, 1.35vw, 1.12rem);
    font-weight: 900;
    line-height: 1;
    outline: none;
  }

  .newsletter-input::placeholder {
    color: color-mix(in srgb, var(--color-ink) 55%, var(--color-paper));
    opacity: 1;
  }

  .newsletter-input:focus {
    border-color: var(--color-paper);
  }

  .newsletter-chat {
    position: absolute;
    right: 1rem;
    top: 50%;
    display: grid;
    height: 1.45rem;
    width: 1.45rem;
    place-items: center;
    transform: translateY(-50%);
    border-radius: 0.35rem;
    background: var(--color-ember);
    color: var(--color-paper);
    font-family: var(--font-display);
    font-size: 0.72rem;
    font-weight: 900;
    letter-spacing: 0.08em;
  }

  .newsletter-submit {
    min-height: 3.85rem;
    width: 100%;
    background: var(--color-ember);
    color: var(--color-paper);
    font-family: var(--font-display);
    font-size: clamp(1.45rem, 2vw, 1.9rem);
    font-weight: 900;
    line-height: 0.95;
    text-align: center;
    text-transform: uppercase;
    transition: background 160ms ease;
  }

  .newsletter-submit:hover {
    background: var(--color-ember-700);
  }

  .newsletter-submit:disabled {
    cursor: wait;
    opacity: 0.72;
  }

  @media (max-width: 767px) {
    .newsletter-modal {
      max-height: min(88vh, 34rem);
    }

    .newsletter-panel {
      max-height: min(88vh, 34rem);
      min-height: auto;
    }
  }
</style>
