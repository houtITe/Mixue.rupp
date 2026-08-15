import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, IceCream, CupSoda, Leaf } from "lucide-react";
import { useProducts } from "@/context/ProductsContext";
import { useSettings } from "@/context/SettingsContext";
import { ProductCarousel } from "@/components/site/ProductCarousel";
import { VideoBackground } from "@/components/site/VideoBackground";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { products } = useProducts();
  const { settings } = useSettings();
  // Split on the first comma so a custom admin title can still get the
  // two-line, accent-colored treatment the default copy uses.
  const [titleLead, ...titleRestParts] = settings.hero.title.split(",");
  const titleRest = titleRestParts.join(",").trim();
  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative">
        <VideoBackground srcs={["/hero-bg-1.mp4", "/hero-bg-2.mp4"]} />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-5 pb-16 lg:pb-24 grid gap-10 lg:grid-cols-2 items-center">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white ring-1 ring-white/30">
              <Sparkles className="h-3.5 w-3.5" />
              New season · Campus favourites
            </span>

            <h1 className="mt-6 font-[Fraunces,serif] text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.02] tracking-tight text-white">
              {titleLead}
              {titleRest && (
                <>
                  ,
                  <br />
                  <span className="text-primary">{titleRest}</span>
                </>
              )}
            </h1>

            <p className="mt-6 max-w-xl text-lg text-white/80">
              {settings.hero.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant hover:brightness-110 transition"
              >
                Explore the menu
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/30 hover:bg-white/25 transition"
              >
                Our story
              </Link>
            </div>

            <dl className="mt-12 grid grid-cols-3 gap-4 max-w-md">
              {[
                { k: "50+", v: "Signature drinks" },
                { k: "12k+", v: "Happy customers" },
                { k: "4.9★", v: "Average rating" },
              ].map((s) => (
                <div key={s.v}>
                  <dt className="font-[Fraunces,serif] text-3xl font-black text-primary">{s.k}</dt>
                  <dd className="text-xs text-white/70 mt-1">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="hidden lg:block relative">
            <div className="relative aspect-4/5 rounded-[2rem] overflow-hidden shadow-elegant animate-fade-in-up">
              <img
                src="https://website-admin.snowking.cn/profile/upload/2024/03/21/home-one-3_20240321175911A121.png"
                alt="Soft-serve ice cream cone"
                className="h-full w-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-linear-to-t from-primary/30 via-transparent to-transparent" />
            </div>

            {/* floating cards */}
            <div className="hidden sm:flex absolute -left-6 top-10 items-center gap-3 glass rounded-2xl px-4 py-3 shadow-card-soft animate-float">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                <CupSoda className="h-5 w-5" />
              </span>
              <div className="text-sm">
                <p className="font-bold leading-none">Tea</p>
                <p className="text-xs text-muted-foreground">from 4000៛</p>
              </div>
            </div>
            <div
              className="hidden sm:flex absolute -right-4 bottom-16 items-center gap-3 glass rounded-2xl px-4 py-3 shadow-card-soft animate-float"
              style={{ animationDelay: "1.5s" }}
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
                <IceCream className="h-5 w-5" />
              </span>
              <div className="text-sm">
                <p className="font-bold leading-none">Ice Cream</p>
                <p className="text-xs text-muted-foreground">from 2000៛</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CAROUSELS */}
      <ProductCarousel
        eyebrow="Featured"
        title="Featured favourites"
        blurb="Hand-picked drinks and treats loved by our campus community."
        products={products.filter((p) => p.featured)}
      />
      <ProductCarousel
        eyebrow="Best sellers"
        title="Top of the class"
        blurb="The signatures that keep students coming back."
        products={products.filter((p) => p.bestSeller)}
      />

      {/* BEST SELLER BANNER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mx-auto overflow-hidden rounded-3xl shadow-card-soft max-w-3xl">
          <img
            src="https://mixuemenu.us/wp-content/uploads/2026/02/mixue-menu-best-seller-items.png"
            alt="Mixue best sellers"
            loading="lazy"
            className="w-full object-contain bg-white"
          />
        </div>
      </section>
      <ProductCarousel
        eyebrow="New arrivals"
        title="Fresh off the menu"
        blurb="Just launched — try them before everyone else does."
        products={products.filter((p) => p.isNew)}
      />
      <ProductCarousel
        eyebrow="Promotions"
        title="Limited-time promos"
        blurb="Grab them while the sale lasts."
        products={products.filter((p) => p.onSale)}
      />

      {/* WHY US */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl">
          <h2 className="font-[Fraunces,serif] text-4xl font-black tracking-tight">
            Why students love us
          </h2>
          <p className="mt-3 text-muted-foreground">
            Fresh ingredients, friendly prices, and a bright cheerful space right on campus.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Leaf,
              title: "Real fruit, real milk",
              body: "We use whole milk, fresh fruits and premium tea leaves — nothing artificial.",
            },
            {
              icon: IceCream,
              title: "Made to order",
              body: "Every cone and cup is whipped and shaken the moment you order it.",
            },
            {
              icon: CupSoda,
              title: "Student-friendly prices",
              body: "Signature drinks start at just $1 — because sweet joy shouldn't cost much.",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="bg-card p-6 shadow-card-soft border border-border/50 transition-transform duration-300 hover:-translate-y-2 hover:shadow-elegant"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-hero text-primary-foreground shadow-elegant">
                <c.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-bold">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl">
          <h2 className="font-[Fraunces,serif] text-4xl font-black tracking-tight">
            Moments at Mixue
          </h2>
          <p className="mt-3 text-muted-foreground">
            A little taste of what's waiting for you in store.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {["/home-feature-1.png", "/home-feature-2.png", "/home-feature-3.png", "/home-feature-4.png"].map(
            (src, i) => (
              <div
                key={i}
                className="bg-white p-4 shadow-card-soft border border-border/50 transition-transform duration-300 hover:-translate-y-2 hover:shadow-elegant"
              >
                <img
                  src={src}
                  alt="Mixue of RUPP menu highlights"
                  loading="lazy"
                  className="w-full object-contain"
                />
              </div>
            ),
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-hero p-10 sm:p-14 text-primary-foreground shadow-elegant">
          <div className="relative z-10 max-w-2xl">
            <h3 className="font-[Fraunces,serif] text-3xl sm:text-4xl font-black">
              Ready to treat yourself?
            </h3>
            <p className="mt-3 text-primary-foreground/85">
              Visit our RUPP campus store or order for pickup — your next favourite drink is a tap
              away.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-semibold text-primary hover-lift"
              >
                Browse menu <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/40 px-6 py-3 text-sm font-semibold hover:bg-primary-foreground/10 transition"
              >
                Find our store
              </Link>
            </div>
          </div>
          <div className="absolute -right-16 -bottom-16 h-72 w-72 rounded-full bg-primary-foreground/20 blur-3xl" />
        </div>
      </section>
    </div>
  );
}
