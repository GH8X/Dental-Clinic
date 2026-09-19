import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import About from "@/pages/About";
import Appointment from "@/pages/Appointment";
import Contact from "@/pages/Contact";
import Doctors from "@/pages/Doctors";
import Gallery from "@/pages/Gallery";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import ServiceDetail from "@/pages/ServiceDetail";
import Services from "@/pages/Services";

/**
 * The practice dashboard is code-split: marketing visitors never download it,
 * and the clinic team loads it only when they sign in.
 */
const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout").then((module) => ({ default: module.AdminLayout })));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminAppointments = lazy(() => import("@/pages/admin/AdminAppointments"));
const AdminServices = lazy(() => import("@/pages/admin/AdminServices"));
const AdminDoctors = lazy(() => import("@/pages/admin/AdminDoctors"));
const AdminTestimonials = lazy(() => import("@/pages/admin/AdminTestimonials"));
const AdminContent = lazy(() => import("@/pages/admin/AdminContent"));

function AdminFallback() {
  return (
    <div className="grid min-h-screen place-items-center bg-mist">
      <div className="flex items-center gap-3 rounded-3xl border border-ink-100 bg-white px-5 py-4 shadow-soft">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
        <p className="text-[13.5px] text-ink-500">Loading the clinic dashboard…</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route
        path="/admin"
        element={
          <Suspense fallback={<AdminFallback />}>
            <AdminLayout />
          </Suspense>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="appointments" element={<AdminAppointments />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="doctors" element={<AdminDoctors />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="content" element={<AdminContent />} />
      </Route>
    </Routes>
  );
}
