import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, IceCream, Search, ShoppingBag, Heart, User, LogOut, LayoutDashboard, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { shortDisplayName } from "@/lib/display-name";
import { useSettings } from "@/context/SettingsContext";
import { SearchModal } from "./SearchModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const links: { to: string; label: string }[] = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { cartCount, wishlist } = useCart();
  const { user, profile, isStaff, logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate({ to: "/" });
  };

  const initials = (profile?.name || user?.email || "U")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "glass shadow-card-soft" : "bg-transparent",
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-hero shadow-elegant overflow-hidden">
              <img src={settings.website.logoUrl} alt="Logo" className="h-full w-full object-cover" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-base font-black tracking-tight text-foreground">
                {settings.website.name}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {settings.website.tagline}
              </span>
            </span>
          </Link>

          <ul className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  activeOptions={{ exact: l.to === "/" }}
                  className="relative rounded-full px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                  activeProps={{ className: "text-primary bg-accent/60" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-accent/60 text-foreground/80"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-accent/60 text-foreground/80"
            >
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              aria-label="Cart"
              className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-accent/60 text-foreground/80"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    aria-label="Account"
                    className="hidden md:flex items-center gap-2 rounded-full bg-primary pl-1 pr-3 py-1 text-primary-foreground shadow-elegant"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-foreground/20 text-xs font-bold">
                      {initials}
                    </span>
                    <span className="text-sm font-semibold max-w-[8rem] truncate">
                      {shortDisplayName(profile?.name, user.email ?? "Account")}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="truncate">
                    {profile?.name || user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isStaff ? (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center gap-2">
                        <LayoutDashboard className="h-4 w-4" /> Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="flex items-center gap-2">
                          <User className="h-4 w-4" /> Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/orders" className="flex items-center gap-2">
                          <ClipboardList className="h-4 w-4" /> Orders
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-destructive">
                    <LogOut className="h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/login"
                aria-label="Sign in"
                className="hidden md:inline-flex items-center rounded-full border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground hover-lift"
              >
                Sign in
              </Link>
            )}
            <Link
              to="/products"
              className="hidden lg:inline-flex rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-elegant hover:brightness-110 transition"
            >
              Order Now
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="lg:hidden grid h-10 w-10 place-items-center rounded-full glass"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="lg:hidden bg-background border-t border-border shadow-card-soft animate-fade-in-up">
            <ul className="flex flex-col p-4 gap-1">
              {links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent/60"
                    activeProps={{ className: "text-primary bg-accent/60" }}
                    activeOptions={{ exact: l.to === "/" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2 mt-2 border-t border-border flex flex-col gap-2">
                {user ? (
                  <>
                    <p className="px-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground truncate">
                      {shortDisplayName(profile?.name, user.email ?? "Account")}
                    </p>
                    {isStaff ? (
                      <Link
                        to="/admin"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent/60"
                      >
                        <LayoutDashboard className="h-4 w-4" /> Admin Dashboard
                      </Link>
                    ) : (
                      <>
                        <Link
                          to="/profile"
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent/60"
                        >
                          <User className="h-4 w-4" /> Profile
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent/60"
                        >
                          <ClipboardList className="h-4 w-4" /> Orders
                        </Link>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm font-medium text-destructive hover:bg-accent/60"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="flex-1 text-center rounded-lg border border-border px-4 py-2 text-sm font-semibold"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setOpen(false)}
                      className="flex-1 text-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </li>
            </ul>
          </div>
        )}
      </header>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
