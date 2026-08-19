import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { User, Mail, Phone, MapPin, LogOut, KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import {
  updateUserName,
  updateUserPhone,
  updateUserLocation,
  changePassword,
  getCurrentLocation,
  isValidKhmerPhone,
} from "@/integrations/firebase/profile";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — Mixue of RUPP" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfilePage,
});

const inputCls =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40";
const labelCls = "text-xs font-semibold uppercase tracking-wide text-muted-foreground";
const btnCls =
  "rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant hover:brightness-110 transition disabled:opacity-60";

function ProfilePage() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(profile?.name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [savingInfo, setSavingInfo] = useState(false);
  const [locating, setLocating] = useState(false);
  const [lat, setLat] = useState<number | null>(profile?.location?.lat ?? null);
  const [lng, setLng] = useState<number | null>(profile?.location?.lng ?? null);

  useEffect(() => {
    if (profile) {
      if (profile.name) setName(profile.name);
      if (profile.phone) setPhone(profile.phone);
      if (profile.location) {
        setLat(profile.location.lat);
        setLng(profile.location.lng);
      }
    }
  }, [profile]);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [savingPw, setSavingPw] = useState(false);

  if (!user) {
    return (
      <section className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="text-muted-foreground">Please sign in to view your profile.</p>
      </section>
    );
  }

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone && !isValidKhmerPhone(phone)) {
      toast.error("Phone number should start with 0 and have 9-10 digits.");
      return;
    }
    setSavingInfo(true);
    try {
      if (name.trim() && name !== profile?.name) await updateUserName(user, name.trim());
      if (phone !== (profile?.phone ?? "")) await updateUserPhone(user, phone);
      if (lat !== null && lng !== null && (lat !== profile?.location?.lat || lng !== profile?.location?.lng)) {
        await updateUserLocation(user, lat, lng);
      }
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update profile.");
    } finally {
      setSavingInfo(false);
    }
  };

  const handleUseLocation = async () => {
    setLocating(true);
    try {
      const { lat: newLat, lng: newLng } = await getCurrentLocation();
      setLat(newLat);
      setLng(newLng);
      await updateUserLocation(user, newLat, newLng);
      toast.success("Location saved!");
    } catch {
      toast.error("Could not get your location. Please allow location access.");
    } finally {
      setLocating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw.length < 6) {
      toast.error("New password should be at least 6 characters.");
      return;
    }
    setSavingPw(true);
    try {
      await changePassword(user, currentPw, newPw);
      toast.success("Password changed!");
      setCurrentPw("");
      setNewPw("");
    } catch {
      toast.error("Current password is incorrect.");
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="flex items-center gap-4">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
          {(profile?.name || user.email || "U").slice(0, 2).toUpperCase()}
        </span>
        <div>
          <h1 className="font-[Fraunces,serif] text-2xl font-black">
            {profile?.name || "Mixue Customer"}
          </h1>
          <p className="text-sm text-muted-foreground">{profile?.role || "customer"}</p>
        </div>
      </div>

      <form
        onSubmit={handleSaveInfo}
        className="mt-8 space-y-4 rounded-3xl border border-border bg-background p-6 shadow-card-soft sm:p-8"
      >
        <h2 className="font-semibold">Account details</h2>

        <div>
          <label className={labelCls}>
            <User className="mr-1 inline h-3.5 w-3.5" /> Name
          </label>
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div>
          <label className={labelCls}>
            <Mail className="mr-1 inline h-3.5 w-3.5" /> Email
          </label>
          <input className={inputCls + " opacity-60"} value={user.email ?? ""} disabled />
        </div>

        <div>
          <label className={labelCls}>
            <Phone className="mr-1 inline h-3.5 w-3.5" /> Phone number
          </label>
          <input
            className={inputCls}
            placeholder="0XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <label className={labelCls}>
            <MapPin className="mr-1 inline h-3.5 w-3.5" /> Delivery location
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleUseLocation}
              disabled={locating}
              className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-accent/60 disabled:opacity-60"
            >
              {locating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="h-4 w-4" />
              )}
              Use my current location
            </button>
            {lat !== null && lng !== null && (
              <a
                href={`https://www.google.com/maps?q=${lat},${lng}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-primary underline underline-offset-2"
              >
                View saved location
              </a>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Latitude</label>
              <input
                type="number"
                step="any"
                className={inputCls + " mt-1"}
                value={lat ?? ""}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setLat(isNaN(val) ? null : val);
                }}
                placeholder="e.g. 11.55"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Longitude</label>
              <input
                type="number"
                step="any"
                className={inputCls + " mt-1"}
                value={lng ?? ""}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setLng(isNaN(val) ? null : val);
                }}
                placeholder="e.g. 104.88"
              />
            </div>
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            You can drop a pin in Google Maps, copy the coordinates, and paste them above for exact delivery mapping.
          </p>
        </div>

        <button type="submit" disabled={savingInfo} className={btnCls}>
          {savingInfo ? "Saving…" : "Save changes"}
        </button>
      </form>

      <form
        onSubmit={handleChangePassword}
        className="mt-6 space-y-4 rounded-3xl border border-border bg-background p-6 shadow-card-soft sm:p-8"
      >
        <h2 className="flex items-center gap-2 font-semibold">
          <KeyRound className="h-4 w-4" /> Change password
        </h2>
        <div>
          <label className={labelCls}>Current password</label>
          <input
            type="password"
            className={inputCls}
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={labelCls}>New password</label>
          <input
            type="password"
            className={inputCls}
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            required
            minLength={6}
          />
        </div>
        <button type="submit" disabled={savingPw} className={btnCls}>
          {savingPw ? "Updating…" : "Update password"}
        </button>
      </form>

      <button
        onClick={async () => {
          await logout();
          navigate({ to: "/" });
        }}
        className="mt-6 flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover-lift"
      >
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    </section>
  );
}
