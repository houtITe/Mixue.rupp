import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "sonner";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { SettingsProvider, useSettings } from "@/context/SettingsContext";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { BackToTop } from "@/components/site/BackToTop";

function NotFoundComponent() {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute -z-10 inset-0 bg-soft" />
      <div className="pointer-events-none absolute -z-10 -top-24 -right-24 h-96 w-96 rounded-full bg-hero opacity-25 blur-3xl" />
      <div className="pointer-events-none absolute -z-10 -bottom-24 -left-24 h-96 w-96 rounded-full bg-hero opacity-20 blur-3xl" />
      <div className="max-w-xl text-center animate-fade-in-up">
        <p className="font-[Fraunces,serif] text-[8rem] sm:text-[12rem] font-black leading-none text-primary drop-shadow-sm">
          404
        </p>
        <h1 className="mt-2 font-[Fraunces,serif] text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          This page melted away 🍦
        </h1>
        <p className="mt-3 text-muted-foreground">
          The link you followed may be broken, or the page has been moved. Let's get you back
          something sweet.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant hover:brightness-110 transition"
          >
            Back home
          </Link>
          <Link
            to="/products"
            className="rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground hover-lift"
          >
            Browse menu
          </Link>
        </div>
      </div>
    </section>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Mixue of RUPP — Ice Cream & Tea" },
      {
        name: "description",
        content:
          "Mixue of RUPP — fresh ice cream, bubble tea and fruit refreshers on the Royal University of Phnom Penh campus. A modern student-built brand.",
      },
      { name: "author", content: "Chey Menghout" },
      { property: "og:title", content: "Mixue of RUPP — Ice Cream & Tea" },
      {
        property: "og:description",
        content: "Fresh ice cream, bubble tea and fruit refreshers on the RUPP campus.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,800;9..144,900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function AppShell({ isAdmin, pathname }: { isAdmin: boolean; pathname: string }) {
  const { settings } = useSettings();
  const { isStaff } = useAuth();
  const showMaintenance = settings.maintenanceMode && !isAdmin && !isStaff;
  const hideFooter = pathname === "/wishlist" || pathname === "/cart" || pathname === "/login" || pathname === "/register" || pathname === "/forgot-password" || pathname === "/orders" || pathname === "/profile";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-[Plus_Jakarta_Sans,ui-sans-serif,system-ui]">
      {!isAdmin && <ScrollProgress />}
      {!isAdmin && <Navbar />}
      <main className={isAdmin ? "flex-1" : "flex-1 pt-20"}>
        {showMaintenance ? (
          <section className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
            <h1 className="font-[Fraunces,serif] text-4xl font-black">We'll be right back 🍦</h1>
            <p className="mt-3 text-muted-foreground">
              {settings.website.name} is doing some quick maintenance. Please check back soon.
            </p>
          </section>
        ) : (
          <Outlet />
        )}
      </main>
      {!isAdmin && !hideFooter && <Footer />}
      {!isAdmin && <BackToTop />}
      <Toaster position="top-right" richColors />
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SettingsProvider>
          <ProductsProvider>
            <CartProvider>
              <AppShell isAdmin={isAdmin} pathname={pathname} />
            </CartProvider>
          </ProductsProvider>
        </SettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
