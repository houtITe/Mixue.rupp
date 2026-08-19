import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/data/products";
import { ProductCard } from "./ProductCard";

export function ProductCarousel({
  eyebrow,
  title,
  blurb,
  products,
}: {
  eyebrow?: string;
  title: string;
  blurb?: string;
  products: Product[];
}) {
  const scroller = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.9, 720) * dir;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl">
          {eyebrow && (
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {eyebrow}
            </span>
          )}
          <h2 className="mt-2 font-[Fraunces,serif] text-3xl sm:text-4xl font-black tracking-tight">
            {title}
          </h2>
          {blurb && (
            <p className="mt-2 text-sm text-muted-foreground">{blurb}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card shadow-card-soft hover:bg-accent transition"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card shadow-card-soft hover:bg-accent transition"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        className="mt-8 -mx-4 px-4 flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        {products.map((p) => (
          <div key={p.id} className="snap-start shrink-0 w-65 sm:w-75 lg:w-[320px]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
