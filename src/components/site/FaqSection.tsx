import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const faqs = [
  {
    q: "Where is Mixue of RUPP located?",
    a: "Our flagship kiosk is on the Royal University of Phnom Penh main campus, near the Faculty of Engineering courtyard. Open every school day from 8am to 8pm.",
  },
  {
    q: "Do you offer delivery?",
    a: "Yes! We deliver across Phnom Penh via our partner riders. Orders over $8 within campus are always free.",
  },
  {
    q: "Can I customize the sugar and ice level?",
    a: "Absolutely. Every drink can be tuned from 0%–100% sugar and light/regular/extra ice — just pick your preference on the product page.",
  },
  {
    q: "Do you have vegan or dairy-free options?",
    a: "We offer oat milk and coconut milk swaps on all tea and coffee drinks at no extra cost.",
  },
  {
    q: "Can I book Mixue for a birthday or campus event?",
    a: "Yes — we do private catering, party stations and gift bundles. Head to the Contact page and drop us a message.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-3xl">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="border-b border-border py-4">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-6 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-[Fraunces,serif] text-lg sm:text-xl font-black">{f.q}</span>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
                {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden text-muted-foreground"
                >
                  <span className="block pt-3">{f.a}</span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
