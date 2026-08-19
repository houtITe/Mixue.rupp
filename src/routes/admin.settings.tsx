import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Upload, Save } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSettings, type SiteSettings } from "@/context/SettingsContext";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { settings, loading, updateSettings } = useSettings();
  const [saving, setSaving] = useState(false);
  const [s, setS] = useState<SiteSettings>(settings);
  const [logoUploading, setLogoUploading] = useState(false);
  const [faviconUploading, setFaviconUploading] = useState(false);

  useEffect(() => {
    setS(settings);
  }, [settings]);

  function update<K extends Exclude<keyof SiteSettings, "maintenanceMode">>(
    section: K,
    patch: Partial<SiteSettings[K]>,
  ) {
    setS((prev) => ({ ...prev, [section]: { ...prev[section], ...patch } }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(s);
      toast.success("Settings saved", {
        description: "These changes are live on the website now.",
      });
    } catch (err) {
      console.error("[Settings save failed]", err);
      const message = err instanceof Error ? err.message : String(err);
      toast.error("Could not save settings.", { description: message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Values here power every public page — Navbar, Footer, Hero, Contact and SEO."
      />

      <form onSubmit={save} className="grid gap-6 lg:grid-cols-2">
        <Section title="Website Settings" description="Brand identity used across the site.">
          <div className="grid gap-4">
            <Field label="Website name">
              <Input value={s.website.name} onChange={(e) => update("website", { name: e.target.value })} />
              <p className="mt-1 text-[11px] text-muted-foreground">Shown in the navbar and browser tab title.</p>
            </Field>
            <Field label="Tagline">
              <Input value={s.website.tagline} onChange={(e) => update("website", { tagline: e.target.value })} />
              <p className="mt-1 text-[11px] text-muted-foreground">Short label under the logo in the navbar — keep it brief.</p>
            </Field>
            <Field label="Description">
              <Textarea rows={3} value={s.website.description} onChange={(e) => update("website", { description: e.target.value })} />
            </Field>
            <Field label="Logo">
              <ImageUploadField
                value={s.website.logoUrl}
                onChange={(url) => update("website", { logoUrl: url })}
                folder="settings"
                previewClassName="h-14 w-14 rounded-full object-cover"
                onUploadingChange={setLogoUploading}
              />
            </Field>
            <Field label="Favicon">
              <ImageUploadField
                value={s.website.faviconUrl}
                onChange={(url) => update("website", { faviconUrl: url })}
                folder="settings"
                onUploadingChange={setFaviconUploading}
              />
            </Field>
          </div>
        </Section>

        <Section title="Business Settings" description="Physical location and contact details.">
          <div className="grid gap-4">
            <Field label="Business name">
              <Input value={s.business.name} onChange={(e) => update("business", { name: e.target.value })} />
            </Field>
            <Field label="Address">
              <Input value={s.business.address} onChange={(e) => update("business", { address: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Phone">
                <Input value={s.business.phone} onChange={(e) => update("business", { phone: e.target.value })} />
              </Field>
              <Field label="Email">
                <Input type="email" value={s.business.email} onChange={(e) => update("business", { email: e.target.value })} />
              </Field>
            </div>
            <Label>Business hours</Label>
            <div className="space-y-2">
              {s.business.hours.map((h, i) => (
                <div key={h.day} className="grid grid-cols-[1fr_auto_auto] items-center gap-2">
                  <span className="text-sm">{h.day}</span>
                  <Input className="w-24" value={h.open} onChange={(e) => {
                    const next = [...s.business.hours];
                    next[i] = { ...h, open: e.target.value };
                    update("business", { hours: next });
                  }} />
                  <Input className="w-24" value={h.close} onChange={(e) => {
                    const next = [...s.business.hours];
                    next[i] = { ...h, close: e.target.value };
                    update("business", { hours: next });
                  }} />
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Social Media" description="Public profile links used in Navbar and Footer.">
          <div className="grid gap-3">
            <Field label="Facebook"><Input value={s.social.facebook} onChange={(e) => update("social", { facebook: e.target.value })} /></Field>
            <Field label="Instagram"><Input value={s.social.instagram} onChange={(e) => update("social", { instagram: e.target.value })} /></Field>
            <Field label="Telegram"><Input value={s.social.telegram} onChange={(e) => update("social", { telegram: e.target.value })} /></Field>
            <Field label="TikTok"><Input value={s.social.tiktok} onChange={(e) => update("social", { tiktok: e.target.value })} /></Field>
          </div>
        </Section>

        <Section title="Homepage Hero" description="The big headline visitors see first.">
          <div className="grid gap-3">
            <Field label="Hero title"><Input value={s.hero.title} onChange={(e) => update("hero", { title: e.target.value })} /></Field>
            <Field label="Hero subtitle"><Textarea rows={3} value={s.hero.subtitle} onChange={(e) => update("hero", { subtitle: e.target.value })} /></Field>
            <Field label="Hero image URL">
              <Input value={s.hero.imageUrl} onChange={(e) => update("hero", { imageUrl: e.target.value })} />
              <p className="mt-1 text-[11px] text-muted-foreground">
                Not currently used — the homepage hero uses a background video instead of an image.
              </p>
            </Field>
          </div>
        </Section>

        <Section title="Footer Settings" description="Text shown at the bottom of every page.">
          <div className="grid gap-3">
            <Field label="Description"><Textarea rows={2} value={s.footer.description} onChange={(e) => update("footer", { description: e.target.value })} /></Field>
            <Field label="Contact line"><Input value={s.footer.contact} onChange={(e) => update("footer", { contact: e.target.value })} /></Field>
            <Field label="Copyright"><Input value={s.footer.copyright} onChange={(e) => update("footer", { copyright: e.target.value })} /></Field>
          </div>
        </Section>

        <Section title="Theme Colors" description="Brand palette applied site-wide.">
          <div className="grid grid-cols-3 gap-3">
            {(["primary", "secondary", "accent"] as const).map((k) => (
              <div key={k}>
                <Label className="capitalize">{k}</Label>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="color"
                    value={s.theme[k] || "#000000"}
                    onChange={(e) => update("theme", { [k]: e.target.value } as Partial<SiteSettings["theme"]>)}
                    className="h-10 w-10 rounded-lg border border-border cursor-pointer"
                  />
                  <Input value={s.theme[k]} onChange={(e) => update("theme", { [k]: e.target.value } as Partial<SiteSettings["theme"]>)} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Leave a color blank to keep the theme's default. Saved colors apply site-wide immediately.
          </p>
        </Section>

        <Section title="Maintenance Mode" description="Temporarily show a friendly holding page to visitors.">
          <label className="flex items-center justify-between rounded-xl border border-border p-4">
            <span>
              <span className="block text-sm font-semibold">Enable maintenance mode</span>
              <span className="block text-xs text-muted-foreground">
                Staff and admins can still browse and manage the site normally.
              </span>
            </span>
            <input
              type="checkbox"
              checked={s.maintenanceMode}
              onChange={(e) => setS((prev) => ({ ...prev, maintenanceMode: e.target.checked }))}
              className="h-5 w-5"
            />
          </label>
        </Section>

        <div className="lg:col-span-2 flex justify-end">
          <Button type="submit" disabled={saving || loading || logoUploading || faviconUploading} className="gap-1.5">
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : logoUploading || faviconUploading ? "Uploading image…" : "Save all changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card-soft">
      <p className="font-[Fraunces,serif] text-xl font-black">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}