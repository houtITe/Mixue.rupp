import { Star, Quote } from "lucide-react";
import { Reveal } from "./Reveal";

const testimonials = [
  {
    name: "Sokha L.",
    role: "IT Student, RUPP",
    quote:
      "The matcha boba here is my daily study fuel. Creamy, not too sweet, and the pearls are always perfectly chewy.",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=3&w=200&h=200&q=80",
  },
  {
    name: "Dara P.",
    role: "Engineering, Year 3",
    quote:
      "$1 for a vanilla cone that tastes premium? Mixue of RUPP just gets students. My whole team meets here every Friday.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=3&w=200&h=200&q=80",
  },
  {
    name: "Chanthy R.",
    role: "Business, Year 2",
    quote:
      "Love the aesthetic and the staff are so friendly. My favourite is the brown sugar milk tea — tastes like a hug in a cup.",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=facearea&facepad=3&w=200&h=200&q=80",
  },
];

export function Testimonials() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {testimonials.map((t, i) => (
        <Reveal key={t.name} delay={i * 0.08}>
          <article className="h-full rounded-3xl bg-card border border-border/50 p-7 shadow-card-soft hover-lift">
            <Quote className="h-8 w-8 text-primary/70" />
            <p className="mt-4 text-foreground/85 leading-relaxed">"{t.quote}"</p>
            <div className="mt-5 flex items-center gap-3">
              <img
                src={t.avatar}
                alt={t.name}
                loading="lazy"
                className="h-12 w-12 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="font-bold truncate">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
              <div className="ml-auto flex text-primary" aria-label="5 star rating">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="h-4 w-4 fill-current" />
                ))}
              </div>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
