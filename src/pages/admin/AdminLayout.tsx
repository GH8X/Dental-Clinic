import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  CalendarDays,
  Database,
  ExternalLink,
  FileText,
  LayoutDashboard,
  Loader2,
  Lock,
  LogOut,
  Menu,
  MessageSquareQuote,
  RotateCcw,
  ShieldCheck,
  Stethoscope,
  Users,
  X,
} from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useData } from "@/lib/data-context";
import { DEMO_ADMIN_CREDENTIALS, ADMIN_NAV } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { BrandMark } from "@/components/layout/brand";

const AUTH_KEY = "dentacare.admin.session";

const NAV_ICONS: Record<string, ReactNode> = {
  dashboard: <LayoutDashboard className="h-4 w-4" strokeWidth={1.8} />,
  calendar: <CalendarDays className="h-4 w-4" strokeWidth={1.8} />,
  services: <Stethoscope className="h-4 w-4" strokeWidth={1.8} />,
  doctors: <Users className="h-4 w-4" strokeWidth={1.8} />,
  quotes: <MessageSquareQuote className="h-4 w-4" strokeWidth={1.8} />,
  content: <FileText className="h-4 w-4" strokeWidth={1.8} />,
};

const TITLES: Record<string, { title: string; description: string }> = {
  "/admin": { title: "Practice overview", description: "Today at a glance across appointments, team and content." },
  "/admin/appointments": { title: "Appointments", description: "Confirm, reschedule and archive patient requests." },
  "/admin/services": { title: "Services", description: "Manage treatments, pricing and what appears on the website." },
  "/admin/doctors": { title: "Doctors", description: "Team profiles, specialities and languages." },
  "/admin/testimonials": { title: "Testimonials", description: "Approve patient reviews before they appear publicly." },
  "/admin/content": { title: "Website content", description: "Edit the copy and contact details shown on the public site." },
};

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState(DEMO_ADMIN_CREDENTIALS.email);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setChecking(true);
    setError(null);
    await new Promise((resolve) => setTimeout(resolve, 450));

    if (email.trim().toLowerCase() === DEMO_ADMIN_CREDENTIALS.email && password === DEMO_ADMIN_CREDENTIALS.password) {
      sessionStorage.setItem(AUTH_KEY, "1");
      setChecking(false);
      onSuccess();
      return;
    }

    setChecking(false);
    setError("That email and password combination does not match. Use the demo credentials shown below.");
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink-900 p-12 lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-brand-500/25 blur-3xl" />
          <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-accent-500/20 blur-3xl" />
          <div className="absolute inset-0 bg-grid-soft opacity-[0.07]" style={{ backgroundSize: "58px 58px" }} />
        </div>

        <div className="relative">
          <BrandMark variant="light" />
        </div>

        <div className="relative max-w-md">
          <h1 className="font-display text-4xl leading-tight text-white">
            The front desk, without the paperwork.
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-ink-100/70">
            This dashboard is where the practice team confirms appointment requests, publishes treatment prices, keeps
            doctor profiles current and approves patient reviews.
          </p>
          <ul className="mt-9 space-y-3 text-[14px] text-ink-100/75">
            {[
              "Appointment requests land here the moment they are submitted",
              "Edits appear on the public website immediately",
              "Reviews stay hidden until a human approves them",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" strokeWidth={1.8} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-[12.5px] text-ink-100/45">
          Demo environment · All patients, reviews and clinicians are fictional.
        </p>
      </div>

      <div className="flex items-center justify-center bg-mist px-6 py-16">
        <div className="w-full max-w-md">
          <div className="lg:hidden">
            <BrandMark />
          </div>

          <span className="mt-8 grid h-12 w-12 place-items-center rounded-3xl bg-white text-brand-600 shadow-soft lg:mt-0">
            <Lock className="h-5 w-5" strokeWidth={1.7} />
          </span>
          <h2 className="mt-6 font-display text-3xl text-ink-900">Team sign in</h2>
          <p className="mt-2 text-[14.5px] text-ink-500">
            Sign in to manage the clinic website and appointment requests.
          </p>

          <form className="mt-8 space-y-5 rounded-4xl border border-ink-100 bg-white p-7 shadow-soft" onSubmit={handleSubmit}>
            <Field label="Work email" htmlFor="admin-email" required>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
              />
            </Field>

            <Field label="Password" htmlFor="admin-password" required>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </Field>

            {error ? (
              <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-[13px] text-red-600">{error}</p>
            ) : null}

            <Button type="submit" variant="brand" size="lg" className="w-full" disabled={checking}>
              {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {checking ? "Signing in…" : "Sign in to dashboard"}
            </Button>
          </form>

          <div className="mt-5 rounded-3xl border border-brand-100 bg-brand-50/70 p-5 text-[13px] leading-relaxed text-brand-800">
            <p className="font-medium">Demo credentials</p>
            <p className="mt-1 text-brand-700/80">
              Email: {DEMO_ADMIN_CREDENTIALS.email}
              <br />
              Password: {DEMO_ADMIN_CREDENTIALS.password}
            </p>
            <button
              type="button"
              onClick={() => {
                setEmail(DEMO_ADMIN_CREDENTIALS.email);
                setPassword(DEMO_ADMIN_CREDENTIALS.password);
                setError(null);
              }}
              className="mt-3 font-medium text-brand-700 underline underline-offset-2"
            >
              Fill demo credentials
            </button>
          </div>

          <ButtonLink to="/" variant="ghost" size="sm" className="mt-6 px-0">
            ← Back to the website
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

function Shell({ onSignOut }: { onSignOut: () => void }) {
  const { mode, resetDemoData } = useData();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const meta = TITLES[location.pathname] ?? { title: "Dashboard", description: "" };

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="px-5 py-6">
        <BrandMark />
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {ADMIN_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/admin"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-[14px] transition-colors",
                isActive ? "bg-brand-50 font-medium text-brand-700" : "text-ink-600 hover:bg-mist hover:text-ink-900",
              )
            }
          >
            {NAV_ICONS[item.icon]}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-3 border-t border-ink-100 px-5 py-5">
        <div className="flex items-center gap-2 text-[12px] text-ink-400">
          <Database className="h-3.5 w-3.5" strokeWidth={1.8} />
          {mode === "supabase" ? "Connected to Supabase" : "Demo storage (browser)"}
        </div>
        <ButtonLink to="/" variant="secondary" size="sm" className="w-full">
          <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.9} />
          View website
        </ButtonLink>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => {
            if (window.confirm("Restore the original demo content? Your edits will be lost.")) {
              void resetDemoData();
            }
          }}
        >
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.9} />
          Reset demo data
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={onSignOut}>
          <LogOut className="h-3.5 w-3.5" strokeWidth={1.9} />
          Sign out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-mist">
      <div className="mx-auto flex max-w-[1600px]">
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-ink-100 bg-white lg:block">
          {sidebar}
        </aside>

        {menuOpen ? (
          <div className="fixed inset-0 z-[70] lg:hidden">
            <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
            <aside className="absolute left-0 top-0 h-full w-72 bg-white shadow-lift">
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="absolute right-3 top-4 grid h-9 w-9 place-items-center rounded-2xl border border-ink-200 text-ink-500"
              >
                <X className="h-4 w-4" />
              </button>
              {sidebar}
            </aside>
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-ink-100 bg-white/85 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMenuOpen(true)}
                  aria-label="Open menu"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-ink-200 text-ink-600 lg:hidden"
                >
                  <Menu className="h-4 w-4" />
                </button>
                <div className="min-w-0">
                  <h1 className="truncate font-display text-xl text-ink-900">{meta.title}</h1>
                  <p className="hidden truncate text-[13px] text-ink-400 sm:block">{meta.description}</p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span className="hidden items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 text-[12px] font-medium text-brand-700 sm:inline-flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                  {mode === "supabase" ? "Supabase" : "Demo mode"}
                </span>
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-600 font-display text-[13px] text-white">
                  AV
                </span>
              </div>
            </div>
          </header>

          <main className="px-5 py-6 sm:px-8 sm:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export function AdminLayout() {
  const [authed, setAuthed] = useState(() => {
    if (typeof sessionStorage === "undefined") return false;
    return sessionStorage.getItem(AUTH_KEY) === "1";
  });

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />;
  }

  return (
    <Shell
      onSignOut={() => {
        sessionStorage.removeItem(AUTH_KEY);
        setAuthed(false);
      }}
    />
  );
}
