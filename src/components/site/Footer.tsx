import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Facebook, Instagram, Send, Mail } from "lucide-react";
import { toast } from "sonner";
import { useSettings } from "@/context/SettingsContext";

export function Footer() {
  const [email, setEmail] = useState("");
  const { settings } = useSettings();

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please enter a valid email.");
      return;
    }
    try {
      const existing = JSON.parse(
        window.localStorage.getItem("mixue.newsletter.v1") ?? "[]",
      ) as string[];
      if (!existing.includes(email)) existing.push(email);
      window.localStorage.setItem("mixue.newsletter.v1", JSON.stringify(existing));
    } catch {
    }
    toast.success("You're subscribed! Sweet news is on its way.");
    setEmail("");
  };

  return (
    <footer className="mt-24 border-t border-border bg-soft">
      <div className="mx-auto max-w-7xl px-4 pt-14 pb-10 sm:px-6 lg:px-8 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-hero shadow-elegant overflow-hidden">
              <img src="/logo.jpg" alt="Logo" className="h-full w-full object-cover" />
            </span>
            <span className="text-base font-black">
              {settings.website.name}
            </span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            {settings.footer.description}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-primary">
                About
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-primary">
                Products
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>{settings.business.address}</li>
            <li>{settings.business.email}</li>
            <li>{settings.business.phone}</li>
            <li>
              <Link to="/developer" className="hover:text-primary">
                Developer
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Follow us</h4>
          <div className="mt-4 flex gap-2">
            {[
              { icon: Facebook, label: "Facebook", href: settings.social.facebook },
              { icon: Instagram, label: "Instagram", href: settings.social.instagram },
              { icon: Send, label: "Telegram", href: settings.social.telegram },
              { icon: Mail, label: "Email", href: `mailto:${settings.business.email}` },
            ]
              .filter((s) => s.href)
              .map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-full glass text-foreground/80 hover:text-primary-foreground hover:bg-primary hover:-translate-y-1 hover:shadow-elegant transition-all duration-300"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
          </div>

          <h4 className="mt-8 text-sm font-bold uppercase tracking-widest text-foreground">
            Subscribe to our newsletter
          </h4>
          <p className="mt-2 text-xs text-muted-foreground">
            Stay updated with new drinks, ice cream flavours, promotions and student-only offers.
          </p>
          <form onSubmit={subscribe} className="mt-4 flex flex-col gap-2">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@rupp.edu.kh"
                aria-label="Email address"
                className="w-full rounded-full glass border border-border/60 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant hover:brightness-110 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
            >
              Subscribe <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-muted-foreground">
          <p>{settings.footer.copyright}</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/privacy" className="hover:text-primary">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-primary">
              Terms & Conditions
            </Link>
            <span className="hidden md:inline">Built by Chhey Menghout</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
