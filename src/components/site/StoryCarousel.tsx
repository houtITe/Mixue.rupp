import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type StorySlide = {
  image: string;
  eyebrow: string;
  title: string;
  body: string;
};

export function StoryCarousel({ slides }: { slides: StorySlide[] }) {
  const [i, setI] = useState(0);
  const n = slides.length;

  useEffect(() => {
    if (n <= 1) return;
    const t = setInterval(() => setI((v) => (v + 1) % n), 5500);
    return () => clearInterval(t);
  }, [n]);

  const go = (d: 1 | -1) => setI((v) => (v + d + n) % n);
  const s = slides[i];

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-elegant">
      <div className="grid md:grid-cols-2">
        <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[420px] overflow-hidden bg-muted">
          <AnimatePresence mode="wait">
            <motion.img
              key={s.image}
              src={s.image}
              alt={s.title}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:bg-none" />
        </div>
        <div className="relative p-8 sm:p-10 lg:p-14 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {s.eyebrow}
              </span>
              <h3 className="mt-3 font-[Fraunces,serif] text-3xl sm:text-4xl font-black leading-tight">
                {s.title}
              </h3>
              <p className="mt-4 text-muted-foreground">{s.body}</p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between">
            <div className="flex gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setI(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === i ? "w-8 bg-primary" : "w-3 bg-border"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => go(-1)}
                aria-label="Previous"
                className="grid h-10 w-10 place-items-center rounded-full border border-border hover:bg-accent transition"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => go(1)}
                aria-label="Next"
                className="grid h-10 w-10 place-items-center rounded-full border border-border hover:bg-accent transition"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
