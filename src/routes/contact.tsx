import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Facebook,
  Instagram,
  MessageCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { createInCollection } from "@/integrations/firebase/collection";
import { useSettings } from "@/context/SettingsContext";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Mixue of RUPP" },
      { name: "description", content: "Visit our RUPP campus store or get in touch." },
      { property: "og:title", content: "Contact — Mixue of RUPP" },
      { property: "og:description", content: "Visit our RUPP campus store or get in touch." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const infoIcons = [MapPin, Phone, Mail, Clock];

function ContactPage() {
  const { settings } = useSettings();
  const [loading, setLoading] = useState(false);

  const infoCards = [
    {
      icon: infoIcons[0],
      title: "Visit us",
      lines: [settings.business.address],
    },
    {
      icon: infoIcons[1],
      title: "Call",
      lines: [settings.business.phone],
    },
    {
      icon: infoIcons[2],
      title: "Email",
      lines: [settings.business.email],
    },
    {
      icon: infoIcons[3],
      title: "Hours",
      lines: settings.business.hours.map((h) => `${h.day} · ${h.open} – ${h.close}`),
    },
  ];

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    setLoading(true);
    try {
      await createInCollection("messages", {
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        subject: String(data.get("subject") ?? ""),
        message: String(data.get("message") ?? ""),
        read: false,
      });
      form.reset();
      toast.success("Message sent!", {
        description: "We'll reply within 24 hours. Thanks for reaching out.",
      });
    } catch {
      toast.error("Could not send your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-24 text-center">
          <SectionHeader
            eyebrow="Contact"
            title="Get in touch"
            blurb="Have questions, orders, catering requests, or feedback? We'd love to hear from you. Reach out anytime."
          />
        </div>
      </section>

      {/* Info cards */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-10 lg:-mt-14 relative z-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {infoCards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06}>
              <div className="h-full rounded-3xl bg-card border border-border p-6 shadow-card-soft hover-lift">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-accent text-accent-foreground">
                  <c.icon className="h-5 w-5" />
                </div>
                <h4 className="mt-4 font-[Fraunces,serif] text-lg font-bold">
                  {c.title}
                </h4>
                {c.lines.map((l) => (
                  <p key={l} className="mt-1 text-sm text-muted-foreground">
                    {l}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Form + Map */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-24 grid gap-10 lg:grid-cols-2">
        <Reveal>
          <div className="rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-card-soft">
            <h3 className="font-[Fraunces,serif] text-2xl sm:text-3xl font-black">
              Send us a message
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              We usually reply within 24 hours.
            </p>
            <form onSubmit={onSubmit} className="mt-6 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field name="name" label="Your name" placeholder="Sokha" required />
                <Field
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="you@rupp.edu.kh"
                  required
                />
              </div>
              <Field name="subject" label="Subject" placeholder="How can we help?" required />
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell us more…"
                  className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition resize-none"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant hover:brightness-110 transition disabled:opacity-60"
              >
                {loading ? "Sending…" : (<>Send message <Send className="h-4 w-4" /></>)}
              </motion.button>
            </form>

            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Follow us
              </p>
              <div className="mt-3 flex gap-2">
                {[
                  { icon: Facebook, label: "Facebook", href: settings.social.facebook },
                  { icon: Instagram, label: "Instagram", href: settings.social.instagram },
                  { icon: MessageCircle, label: "Telegram", href: settings.social.telegram },
                ]
                  .filter((s) => s.href)
                  .map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={s.label}
                      className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary transition"
                    >
                      <s.icon className="h-5 w-5" />
                    </a>
                  ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="h-full rounded-3xl overflow-hidden border border-border shadow-card-soft bg-card">
            <div className="aspect-[4/3] w-full">
              <iframe
                title="Mixue of RUPP map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=104.8905%2C11.5670%2C104.9005%2C11.5720&layer=mapnik&marker=11.5695%2C104.8955"
                loading="lazy"
                className="h-full w-full border-0"
              />
            </div>
            <div className="p-6">
              <a
                href="https://www.openstreetmap.org/directions?from=11.56905%2C104.89119&to=#map=16/11.56966/104.88944"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline underline-offset-2"
              >
                Get Directions
              </a>
              <h4 className="mt-4 font-[Fraunces,serif] text-xl font-bold">Weekly hours</h4>
              <ul className="mt-4 divide-y divide-border">
                {settings.business.hours.map((h) => (
                  <li
                    key={h.day}
                    className="flex items-center justify-between py-2 text-sm"
                  >
                    <span className="font-medium text-foreground">{h.day}</span>
                    <span className="text-muted-foreground">{h.open} – {h.close}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
  required,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition"
      />
    </div>
  );
}