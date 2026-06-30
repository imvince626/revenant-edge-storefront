import type { APIRoute } from "astro";
import { createNewsletterCustomer } from "../../utils/shopify";

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const E164_RE = /^\+[1-9]\d{7,14}$/;

function isExistingCustomerError(error: { code?: string; message: string }) {
  const code = error.code?.toUpperCase() ?? "";
  const message = error.message ?? "";

  return (
    code === "TAKEN" ||
    /already|associated|exists|taken|customer.*account/i.test(message)
  );
}

function randomPassword() {
  return `${crypto.randomUUID()}Aa1!`;
}

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let payload: { email?: string; phone?: string };

  try {
    payload = await request.json();
  } catch (_) {
    return json(400, { ok: false, message: "Invalid request." });
  }

  const email = payload.email?.trim().toLowerCase() ?? "";
  const rawPhone = payload.phone?.trim() ?? "";
  const phone = rawPhone && E164_RE.test(rawPhone) ? rawPhone : undefined;

  if (!EMAIL_RE.test(email)) {
    return json(400, { ok: false, message: "Enter a valid email address." });
  }

  const buyerIP =
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-forwarded-for") ??
    clientAddress ??
    "";

  try {
    const result = await createNewsletterCustomer({
      email,
      phone,
      password: randomPassword(),
      buyerIP,
    });

    const errors = result.customerUserErrors ?? [];
    const duplicate = errors.some(isExistingCustomerError);

    if (result.customer || duplicate) {
      return json(200, { ok: true });
    }

    return json(400, {
      ok: false,
      message: errors[0]?.message ?? "Newsletter signup failed.",
    });
  } catch (error) {
    console.error("Newsletter signup failed", error);
    return json(502, {
      ok: false,
      message: "Newsletter signup is unavailable.",
    });
  }
};
