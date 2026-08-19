import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Mixue of RUPP" },
      { name: "description", content: "How Mixue of RUPP handles your personal data." },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-[Fraunces,serif] text-4xl sm:text-5xl font-black">
        Privacy Policy
      </h1>
      <p className="mt-3 text-muted-foreground">Last updated: July 2026</p>
      <div className="mt-8 space-y-6 text-foreground/85 leading-relaxed">
        <p>
          Mixue of RUPP respects your privacy. This page explains what information we
          collect on this website and how we use it.
        </p>
        <h2 className="font-[Fraunces,serif] text-2xl font-black">What we collect</h2>
        <p>
          When you subscribe to our newsletter or submit a contact form, we collect
          your name and email address so we can reply. When you place an order online,
          we may collect your phone number and delivery address.
        </p>
        <h2 className="font-[Fraunces,serif] text-2xl font-black">How we use data</h2>
        <p>
          Data is used only to serve your orders, respond to enquiries and send you
          promos you have explicitly opted into. We never sell your data.
        </p>
        <h2 className="font-[Fraunces,serif] text-2xl font-black">Your rights</h2>
        <p>
          You may request access, correction or deletion of your personal data at any
          time by emailing hello@mixue-rupp.dev.
        </p>
      </div>
    </article>
  );
}