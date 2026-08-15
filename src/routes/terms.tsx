import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Mixue of RUPP" },
      { name: "description", content: "The terms that govern your use of Mixue of RUPP." },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-[Fraunces,serif] text-4xl sm:text-5xl font-black">
        Terms & Conditions
      </h1>
      <p className="mt-3 text-muted-foreground">Last updated: July 2026</p>
      <div className="mt-8 space-y-6 text-foreground/85 leading-relaxed">
        <p>
          By using this website you agree to these terms. Content on the site is for
          general information and may change without notice.
        </p>
        <h2 className="font-[Fraunces,serif] text-2xl font-black">Orders</h2>
        <p>
          All orders are subject to product availability. Prices are shown in USD and
          may change from time to time. We reserve the right to cancel any order.
        </p>
        <h2 className="font-[Fraunces,serif] text-2xl font-black">Intellectual property</h2>
        <p>
          All logos, text, images and design elements are the property of Mixue of
          RUPP unless otherwise credited. Product photos on this demo are sourced
          from royalty-free libraries such as Unsplash.
        </p>
        <h2 className="font-[Fraunces,serif] text-2xl font-black">Contact</h2>
        <p>Questions about these terms? Reach us at hello@mixue-rupp.dev.</p>
      </div>
    </article>
  );
}