import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, Clock, Mail, Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useData } from "@/lib/data-context";
import { NAV_LINKS } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { BrandMark } from "./brand";

export function Navbar() {
  const { content } = useData();
  const clinic = content.clinic;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50">
      <div
        className={cn(
          "hidden border-b border-ink-100/70 bg-ink-900 text-[12.5px] text-ink-100/80 transition-all duration-300 lg:block",
          scrolled ? "h-0 overflow-hidden opacity-0" : "h-10 opacity-100",
        )}
      >
        <div className="container flex h-10 items-center justify-between">
          <p className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-brand-300" strokeWidth={1.8} />
            {clinic.emergencyNote}
          </p>
          <div className="flex items-center gap-6">
            <a href={`mailto:${clinic.email}`} className="flex items-center gap-2 transition-colors hover:text-white">
              <Mail className="h-3.5 w-3.5 text-brand-300" strokeWidth={1.8} />
              {clinic.email}
            </a>
            <a href={`tel:${clinic.phone.replace(/[^+\d]/g, "")}`} className="flex items-center gap-2 transition-colors hover:text-white">
              <Phone className="h-3.5 w-3.5 text-brand-300" strokeWidth={1.8} />
              {clinic.phone}
            </a>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "border-b transition-all duration-300",
          scrolled ? "border-ink-100 bg-white/85 shadow-soft backdrop-blur-xl" : "border-transparent bg-white/70 backdrop-blur",
        )}
      >
        <nav className="container flex h-[72px] items-center justify-between gap-6">
          <BrandMark />

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "relative rounded-full px-4 py-2 text-[14.5px] transition-colors",
                      isActive ? "text-brand-700" : "text-ink-600 hover:text-ink-900",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      <span
                        className={cn(
                          "absolute inset-x-4 -bottom-0.5 h-px origin-left bg-brand-500 transition-transform duration-300",
                          isActive ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 lg:flex">
            <ButtonAnchor
              href={`tel:${clinic.phone.replace(/[^+\d]/g, "")}`}
              variant="secondary"
              size="sm"
              className="px-4"
            >
              <Phone className="h-4 w-4" strokeWidth={1.8} />
              {clinic.phone}
            </ButtonAnchor>
            <ButtonLink to="/appointment" variant="brand" size="md">
              <CalendarCheck className="h-4 w-4" strokeWidth={1.8} />
              Book Appointment
            </ButtonLink>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-ink-200 bg-white text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-700 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="border-b border-ink-100 bg-white lg:hidden"
          >
            <div className="container flex flex-col gap-1 py-5">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "rounded-2xl px-4 py-3 text-[15px] transition-colors",
                      isActive ? "bg-brand-50 text-brand-700" : "text-ink-700 hover:bg-mist",
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <div className="mt-3 grid gap-2">
                <ButtonLink to="/appointment" variant="brand" size="lg" className="w-full">
                  <CalendarCheck className="h-4 w-4" strokeWidth={1.8} />
                  Book an Appointment
                </ButtonLink>
                <ButtonAnchor
                  href={`tel:${clinic.phone.replace(/[^+\d]/g, "")}`}
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  <Phone className="h-4 w-4" strokeWidth={1.8} />
                  {clinic.phone}
                </ButtonAnchor>
              </div>

              <div className="mt-4 space-y-1 border-t border-ink-100 pt-4 text-[13px] text-ink-500">
                <p>{clinic.street}</p>
                <p>
                  {clinic.postalCode} {clinic.city}
                </p>
                <p>{clinic.email}</p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
