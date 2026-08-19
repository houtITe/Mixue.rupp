import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  GraduationCap,
  Code2,
  Sparkles,
  Send,
  Award,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/site/Reveal";
import Cv from "./../../public/Myself/Chey Menghout.pdf";
import pf from "./../../public/Myself/photo_2026-05-22_13-38-02.jpg";
export const Route = createFileRoute("/developer")({
  head: () => ({
    meta: [
      { title: "Meet the Developer — Chhey Menghout" },
      {
        name: "description",
        content:
          "Chhey Menghout — ITE student at RUPP. Full-stack developer of Mixue of RUPP. Skills, projects, and how to hire.",
      },
      { property: "og:title", content: "Meet the Developer — Chhey Menghout" },
      { property: "og:description", content: "About the developer of Mixue of RUPP." },
      { property: "og:url", content: "/developer" },
    ],
    links: [{ rel: "canonical", href: "/developer" }],
  }),
  component: DeveloperPage,
});

const skillBars = [
  { name: "React & TypeScript", level: 92 },
  { name: "Tailwind CSS / UI Design", level: 95 },
  { name: "Node.js & Firebase", level: 85 },
  { name: "Python & Java", level: 78 },
  { name: "C / C++", level: 70 },
  { name: "Git & DevOps", level: 82 },
];

const technologies = [
  { name: "HTML5", slug: "html5", color: "E34F26" },
  { name: "CSS3", slug: "css", color: "1572B6" },
  { name: "JavaScript", slug: "javascript", color: "F7DF1E" },
  { name: "TypeScript", slug: "typescript", color: "3178C6" },
  { name: "React", slug: "react", color: "61DAFB" },
  { name: "Tailwind CSS", slug: "tailwindcss", color: "06B6D4" },
  { name: "Firebase", slug: "firebase", color: "FFCA28" },
  { name: "Java", slug: "openjdk", color: "437291" },
  { name: "Python", slug: "python", color: "3776AB" },
  { name: "C++", slug: "cplusplus", color: "00599C" },
  { name: "Git", slug: "git", color: "F05032" },
  { name: "GitHub", slug: "github", color: "181717" },
  { name: "VS Code", slug: "visualstudiocode", color: "007ACC" },
  { name: "Figma", slug: "figma", color: "F24E1E" },
  { name: "Node.js", slug: "nodedotjs", color: "5FA04E" },
  { name: "Vite", slug: "vite", color: "646CFF" },
];

const certificates = [
  { title: "Meta Front- End Developer", org: "Coursera · 2025", tag: "In progress" },
  { title: "Responsive Web Design", org: "freeCodeCamp · 2024", tag: "Certified" },
  { title: "JavaScript Algorithms", org: "freeCodeCamp · 2024", tag: "Certified" },
  { title: "Google IT Support", org: "Coursera · 2024", tag: "Certified" },
];

const portfolio = [
  {
    title: "Mixue of RUPP",
    tag: "Full-stack · 2026",
    image:
      "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "Campus Marketplace",
    tag: "Web app · 2025",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "Study Buddy",
    tag: "Mobile · 2025",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80",
  },
];

const timeline = [
  {
    year: "2025",
    title: "Year 1 at RUPP",
    text: "Started ITE (Information Technology Engineering) at Royal University of Phnom Penh. Learning web development, databases, and software engineering fundamentals.",
  },
  {
    year: "2026",
    title: "Mixue of RUPP",
    text: "Designed and built this full-stack brand website end-to-end. First real-world project combining React, Firebase, and modern UI design.",
  },
];

const socials = [
  { slug: "github", label: "GitHub", color: "181717", href: "https://github.com/houtITe" },
  { slug: "facebook", label: "Facebook", color: "1877F2", href: "https://www.facebook.com/share/1DV396ZKVi/"},
  { slug: "tiktok", label: "TikTok", color: "000000", href: "https://www.tiktok.com/@do_not_forget_oneday?_r=1&_t=ZS-98v8SQ601nJ" },
  { slug: "telegram", label: "Telegram", color: "0088cc", href: "https://t.me/MhoutA1" },
];

function DeveloperPage() {
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      (e.target as HTMLFormElement).reset();
      toast.success("Message received!", {
        description: "Menghout will reply within 24 hours.",
      });
    }, 900);
  };

  return (
    <div className="overflow-hidden">
      
      <section className="relative bg-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid gap-12 lg:grid-cols-[1.1fr_1fr] items-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent-foreground">
              <Sparkles className="h-3.5 w-3.5" /> Meet the developer
            </span>
            <h1 className="mt-5 font-[Fraunces,serif] text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight">
              Hi, I'm <span className="text-primary">Chhey Menghout</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl">
              Full-stack developer and ITE student at the Royal University of Phnom Penh.
              I design and build modern, delightful web experiences — like this one.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4" /> ITE · RUPP
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> Phnom Penh, Cambodia
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Code2 className="h-4 w-4" /> Available for freelance
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#contact"
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant hover:brightness-110 transition"
              >
                Hire me
              </a>
              <a
                href="#projects"
                className="rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground hover-lift"
              >
                See my journey
              </a>
            </div>

            <div className="mt-8 flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary transition"
                >
                  <img
                    src={`https://cdn.simpleicons.org/${s.slug}/${s.color}`}
                    alt={s.label}
                    className="h-5 w-5"
                  />
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15} className="relative">
            <div className="pointer-events-none absolute -z-10 -inset-6 rounded-[3rem] bg-hero opacity-25 blur-3xl" />
            <motion.div
              whileHover={{ y: -6 }}
              className="relative rounded-[2rem] overflow-hidden bg-card border border-border shadow-elegant"
            >
              <img
                src={pf}
                alt="Chhey Menghout"
                className="w-1/2 mx-auto aspect-[941/1672] object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/70 to-transparent text-primary-foreground">
                <p className="font-[Fraunces,serif] text-xl font-black">Chhey Menghout</p>
                <p className="text-sm text-primary-foreground/80">Full-Stack Developer · ITE Student</p>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <SectionHeader
          eyebrow="Skills"
          title="What I do best"
          blurb="Years of self-taught practice, sharpened by real client and student projects."
        />
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {skillBars.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.05}>
              <div className="rounded-3xl bg-card border border-border p-6 shadow-card-soft">
                <div className="flex items-baseline justify-between">
                  <p className="font-semibold">{s.name}</p>
                  <span className="text-sm font-bold text-primary">
                    {s.level}%
                  </span>
                </div>
                <div className="mt-3 h-2.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, ease: "easeOut", delay: i * 0.05 }}
                    className="h-full rounded-full bg-hero shadow-elegant"
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      
      <section className="bg-soft py-20 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Tech stack"
            title="Languages & tools I use daily"
            blurb="Official brand logos — the real toolkit behind every project."
          />
          <StaggerGroup className="mt-12 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {technologies.map((t) => (
              <StaggerItem key={t.slug}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.05 }}
                  className="group aspect-square rounded-2xl border border-border bg-card p-4 flex flex-col items-center justify-center gap-2 shadow-card-soft hover:border-primary transition"
                  title={t.name}
                >
                  <img
                    src={`https://cdn.simpleicons.org/${t.slug}/${t.color}`}
                    alt={t.name}
                    loading="lazy"
                    className="h-10 w-10 object-contain"
                  />
                  <span className="text-[11px] font-semibold text-muted-foreground group-hover:text-foreground text-center">
                    {t.name}
                  </span>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      
      <section id="projects" className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <SectionHeader
          eyebrow="Project timeline"
          title="My journey so far"
        />
        <div className="relative mt-14">
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-border sm:-translate-x-1/2" />
          <ul className="space-y-10">
            {timeline.map((t, i) => (
              <Reveal key={t.year} as="li" delay={i * 0.05}>
                <div className={`sm:grid sm:grid-cols-2 sm:gap-10 ${i % 2 ? "sm:[&>*:first-child]:order-2" : ""}`}>
                  <div className={`pl-12 sm:pl-0 relative ${i % 2 ? "sm:text-left" : "sm:text-right"}`}>
                    <span className="absolute left-0 sm:left-auto sm:right-[-1.35rem] top-1 grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-elegant sm:translate-x-1/2 sm:-translate-y-0">
                      {i + 1}
                    </span>
                    <div className="rounded-3xl bg-card border border-border p-6 hover-lift">
                      <span className="text-3xl font-[Fraunces,serif] font-black text-primary">
                        {t.year}
                      </span>
                      <h4 className="mt-2 text-lg font-bold">{t.title}</h4>
                      <p className="mt-2 text-sm text-muted-foreground">{t.text}</p>
                    </div>
                  </div>
                  <div />
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <SectionHeader
          eyebrow="Certificates"
          title="Learning never stops"
          blurb="Online courses and certifications completed alongside my studies."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {certificates.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.05}>
              <div className="h-full rounded-3xl border border-border bg-card p-6 hover-lift">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-accent text-accent-foreground">
                  <Award className="h-5 w-5" />
                </div>
                <h4 className="mt-4 font-semibold text-sm">{c.title}</h4>
                <p className="mt-1 text-xs text-muted-foreground">{c.org}</p>
                <span className="mt-3 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                  {c.tag}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a
            href={Cv}
            download="Chhey_Menghout_CV.png"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold hover-lift"
          >
            <Download className="h-4 w-4" /> Download CV
          </a>
        </div>
      </section>

      
      <section id="contact" className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <SectionHeader
          eyebrow="Get in touch"
          title="Let's build something together"
          blurb="Have a project idea, a job offer, or just want to say hi? Drop a message."
        />
        <Reveal delay={0.05} className="mt-12">
          <form
            onSubmit={onSubmit}
            className="rounded-3xl bg-card border border-border p-6 sm:p-10 shadow-card-soft grid gap-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <DevField name="name" label="Your name" placeholder="Sokha" required />
              <DevField
                name="email"
                label="Email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>
            <DevField name="topic" label="Topic" placeholder="Freelance project, job, chat…" required />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Message
              </label>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Tell me about your idea…"
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
        </Reveal>
      </section>
    </div>
  );
}

function DevField({
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