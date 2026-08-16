import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Sparkles, Heart, Leaf, Users, Trophy, Target } from "lucide-react";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/site/Reveal";
import { StoryCarousel } from "@/components/site/StoryCarousel";
import { motion, useReducedMotion } from "framer-motion";
const storySlides = [
  {
    image:
      "https://website-admin.snowking.cn/profile/upload/2024/03/21/home-one-3_20240321175911A121.png",
    eyebrow: "Brand story",
    title: "A student dream, one scoop at a time",
    body: "Mixue of RUPP started as a late-night idea between friends — a place where campus life could pause for something sweet.",
  },
  {
    image:
      "https://website-admin.snowking.cn/profile/upload/2024/03/21/home-one-3_20240321175911A121.png",
    eyebrow: "Milestone",
    title: "12,000 cups served and counting",
    body: "From a single blender to a full menu, our little corner of RUPP has become part of thousands of study breaks.",
  },
  {
    image:
      "https://website-admin.snowking.cn/profile/upload/2024/03/21/home-one-3_20240321175911A121.png",
    eyebrow: "Our team",
    title: "Made by student baristas",
    body: "Every drink is crafted by our small, passionate team of ITE and business students juggling classes and cream.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1541696490-8744a5dc0228?auto=format&fit=crop&w=1200&q=80",
    eyebrow: "Customer moments",
    title: "Sweet memories on campus",
    body: "Birthdays, thesis defenses, first dates — we've been lucky to be part of the little moments that matter.",
  },
];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Mixue of RUPP" },
      { name: "description", content: "The story, mission and team behind Mixue of RUPP." },
      { property: "og:title", content: "About — Mixue of RUPP" },
      { property: "og:description", content: "The story, mission and team behind Mixue of RUPP." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const values = [
  {
    icon: Heart,
    title: "Made with love",
    text: "Every scoop, every shake, every cup is hand-crafted with genuine care for our campus community.",
  },
  {
    icon: Leaf,
    title: "Fresh & local",
    text: "We source Cambodian fruit, dairy and coffee whenever possible — supporting local farmers.",
  },
  {
    icon: Users,
    title: "Student-first",
    text: "Built by students, for students. Affordable pricing, cozy vibe, and a place to study or hang out.",
  },
  {
    icon: Trophy,
    title: "Premium quality",
    text: "No compromises on ingredients. Real matcha, real fruit, real chocolate — always.",
  },
];

const timeline = [
  {
    year: "2023",
    title: "The idea",
    text: "Sparked during a late-night study session at RUPP — a dream to bring premium ice cream and tea to campus.",
  },
  {
    year: "2024",
    title: "First scoop",
    text: "Soft-launched with three flavors and a single blender. Sold out in three hours.",
  },
  {
    year: "2025",
    title: "Growing family",
    text: "Expanded to 20+ drinks, hired 6 student baristas and became a campus staple.",
  },
  {
    year: "2026",
    title: "Digital era",
    text: "Launched this website with online menu, order-ahead and a growing loyalty program.",
  },
];

const heroMarqueeImages = [
  "https://mymixues.oss-ap-southeast-1.aliyuncs.com/uploads/images/202509/7868742bb8b87b732b4328dc9a72bb8c.png",
  "https://s3.amazonaws.com/cloud-pos-storage-prod/006482/main/2026-05-07/1778130667987pmgtsr674j9.jpeg",
  "https://tb-static.uber.com/prod/image-proc/processed_images/8513e50fc9d90ef98ba6352b95276f40/d03e52b3c8af19d8fa8222e23efd9cfa.jpeg",
  "https://tb-static.uber.com/prod/image-proc/processed_images/13276634c5ef0cdf48e52251d4de472a/d03e52b3c8af19d8fa8222e23efd9cfa.jpeg",
];

function AboutPage() {
  return (
    <div className="overflow-hidden">
      <section className="relative bg-neutral-900 overflow-hidden min-h-[560px] sm:min-h-[640px] flex items-center">
        <div aria-hidden className="absolute inset-0 flex h-full">
          <div className="flex h-full w-max animate-marquee">
            {[
              "https://www.thetakeout.com/img/gallery/the-worlds-biggest-fast-food-chain-arrived-to-the-us-heres-what-we-tried-on-the-menu/methodology-1769615449.jpg",
              "https://imgs.search.brave.com/ZL3p34vSI9Cr2nJWgSaVB18SPLdSiMQW_rf0sDEVHzQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9mb3J0/dW5lLmNvbS9pbWct/YXNzZXRzL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDI1LzA2L0dl/dHR5SW1hZ2VzLTIy/MDI1ODA5MzYtZTE3/NDg4ODI2MzAzODEu/anBnP2Zvcm1hdD13/ZWJwJnc9MTQ0MCZx/PTEwMA",
              "https://imgs.search.brave.com/w8_uB4l_AaQYq4DG-BepMzWv5hMLAsoiA-02E5HCAr0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9taXh1/bWVudXMub3JnL3dw/LWNvbnRlbnQvdXBs/b2Fkcy9taXh1ZS1z/aW5nYXBvcmUtbWVu/dS13aXRoLXByaWNl/cy11cGRhdGVkLTc2/OHg0MDMud2VicA",
              "https://www.thetakeout.com/img/gallery/the-worlds-biggest-fast-food-chain-arrived-to-the-us-heres-what-we-tried-on-the-menu/final-thoughts-1769616267.jpg",
              "https://www.foodandwine.com/thmb/mTh2YTGPwk-9v-4XZSac3pG_wAM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/World-Largest-Fast-Food-Chain-Is-Finally-in-the-US-FT-DGTL0326-Group-8d1a25fec39f404d8a65ebc4b60e5f5e.jpg",
              "https://imagedelivery.net/WLUarKbmUXuuhDC7PG5_Qw/radii.co/2026/01/radii-chinese-milk-tea-chain-mixue-comes-to-nyc-00.png/w=2090,h=1390",
              "https://www.thetakeout.com/img/gallery/the-worlds-biggest-fast-food-chain-arrived-to-the-us-heres-what-we-tried-on-the-menu/methodology-1769615449.jpg",
              "https://www.foodandwine.com/thmb/mTh2YTGPwk-9v-4XZSac3pG_wAM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/World-Largest-Fast-Food-Chain-Is-Finally-in-the-US-FT-DGTL0326-Group-8d1a25fec39f404d8a65ebc4b60e5f5e.jpg",
              "https://imagedelivery.net/WLUarKbmUXuuhDC7PG5_Qw/radii.co/2026/01/radii-chinese-milk-tea-chain-mixue-comes-to-nyc-00.png/w=2090,h=1390",
            ].map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                onError={(e) => {
                  // Hide any image that fails to load (e.g. hotlink-blocked)
                  // instead of showing a broken-image icon.
                  (e.target as HTMLImageElement).style.display = "none";
                }}
                className="h-full w-[300px] sm:w-[420px] shrink-0 object-cover bg-neutral-800"
              />
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32 text-center">
          <Reveal className="mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white ring-1 ring-white/30">
              <Sparkles className="h-3.5 w-3.5" /> Our story
            </span>
            <h1 className="mt-5 font-[Fraunces,serif] text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight text-white">
              A sweet little brand, <span className="text-primary">born on campus.</span>
            </h1>
            <p className="mt-5 text-lg text-white/80">
              Mixue of RUPP is a student-led ice cream and tea brand crafting joyful, affordable
              moments between classes at the Royal University of Phnom Penh.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/products"
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant hover:brightness-110 transition"
              >
                Try the menu
              </Link>
              <Link
                to="/contact"
                className="rounded-full bg-white/15 backdrop-blur px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/30 hover:bg-white/25 transition"
              >
                Visit us
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Bringing Snow King into Every Home */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          <Reveal>
            <div className="mt-6 rounded-[2rem] overflow-hidden shadow-elegant bg-white p-3">
              <img
                src="/about-bringing-snow-king.png"
                alt="Bringing Snow King into every home"
                className="w-full rounded-2xl object-contain"
                loading="lazy"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-foreground">
              Our promise
            </span>
            <h2 className="mt-4 font-[Fraunces,serif] text-3xl sm:text-4xl font-black tracking-tight">
              Bringing Snow King into Every Home
            </h2>
            <p className="mt-4 text-muted-foreground">
              From a single campus corner to a name students trust, our goal has always been the
              same — bring a little joy, a little sweetness, and a lot of warmth into everyday
              life at RUPP and beyond.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Our Culture: Mission / Vision / Values */}
      <section className="bg-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <SectionHeader eyebrow="Our Culture" title="What we stand for" />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <Reveal>
              <div className="h-full rounded-3xl bg-primary text-primary-foreground p-8 shadow-elegant">
                <Target className="h-8 w-8" />
                <h3 className="mt-4 font-[Fraunces,serif] text-2xl font-black">Our Mission</h3>
                <p className="mt-3 text-primary-foreground/90">
                  Strengthen our brand. Empower our partners.
                </p>
                <p className="mt-2 text-primary-foreground/90">
                  Great taste, fair price, for everyone.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="h-full rounded-3xl bg-card border border-border p-8 hover-lift">
                <Sparkles className="h-8 w-8 text-primary" />
                <h3 className="mt-4 font-[Fraunces,serif] text-2xl font-black">Our Vision</h3>
                <p className="mt-3 text-muted-foreground">Stay simple, stay focused.</p>
                <p className="mt-2 text-muted-foreground">
                  Build a respected brand that lasts for centuries.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="h-full rounded-3xl bg-card border border-border p-8 hover-lift">
                <Heart className="h-8 w-8 text-primary" />
                <h3 className="mt-4 font-[Fraunces,serif] text-2xl font-black">Our Values</h3>
                <p className="mt-3 text-muted-foreground">
                  Honest people, genuine intentions, real ingredients.
                </p>
                <p className="mt-2 text-muted-foreground">
                  No false promises, no cutting corners.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.05}>
                <div className="h-full rounded-3xl bg-card border border-border p-6 hover-lift">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-accent text-accent-foreground">
                    <v.icon className="h-5 w-5" />
                  </div>
                  <h4 className="mt-4 font-[Fraunces,serif] text-xl font-bold">{v.title}</h4>
                  <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <SectionHeader
            eyebrow="Our journey"
            title="From dorm-room idea to campus favorite"
            blurb="A short timeline of the moments that shaped Mixue of RUPP."
          />
          <StaggerGroup className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {timeline.map((t) => (
              <StaggerItem key={t.year}>
                <div className="h-full rounded-3xl bg-card border border-border p-6 hover-lift">
                  <span className="text-4xl font-[Fraunces,serif] font-black text-primary">
                    {t.year}
                  </span>
                  <h4 className="mt-3 text-lg font-bold">{t.title}</h4>
                  <p className="mt-2 text-sm text-muted-foreground">{t.text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="rounded-[2.5rem] bg-hero p-10 sm:p-14 text-primary-foreground shadow-elegant grid gap-8 md:grid-cols-4 text-center">
          {[
            ["12K+", "Cups served"],
            ["25+", "Menu items"],
            ["4.9★", "Student rating"],
            ["6", "Team members"],
          ].map(([n, l]) => (
            <Reveal key={l}>
              <div className="font-[Fraunces,serif] text-4xl sm:text-5xl font-black">{n}</div>
              <div className="mt-1 text-sm uppercase tracking-widest text-primary-foreground/80">
                {l}
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
function HeroMarquee() {
  const shouldReduceMotion = useReducedMotion();
  const track = [...heroMarqueeImages, ...heroMarqueeImages];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="flex h-full items-center gap-6 will-change-transform"
        style={{ width: "max-content" }}
        animate={shouldReduceMotion ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
      >
        {track.map((src, i) => (
          <div
            key={i}
            className="aspect-video w-[320px] shrink-0 overflow-hidden rounded-3xl sm:w-105"
          >
            <img src={src} alt="" className="h-full w-full object-cover" />
          </div>
        ))}
      </motion.div>
      <div className="absolute inset-0 bg-soft/85" />
    </div>
  );
}
