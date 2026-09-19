import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  resolveAdapter,
  type Appointment,
  type AppointmentInput,
  type DataAdapter,
  type Database,
  type Doctor,
  type Service,
  type SiteContent,
  type TableName,
  type Testimonial,
} from "./api";
import { seedDatabase } from "./api/seed";

interface DataContextValue {
  status: "loading" | "ready" | "error";
  mode: "local" | "supabase";
  error: string | null;
  content: SiteContent;
  appointments: Appointment[];
  services: Service[];
  publishedServices: Service[];
  featuredServices: Service[];
  doctors: Doctor[];
  publishedDoctors: Doctor[];
  testimonials: Testimonial[];
  approvedTestimonials: Testimonial[];
  serviceBySlug(slug: string): Service | undefined;
  serviceById(id: string): Service | undefined;
  createAppointment(input: AppointmentInput): Promise<Appointment>;
  updateAppointment(id: string, patch: Partial<Appointment>): Promise<void>;
  deleteAppointment(id: string): Promise<void>;
  saveService(service: Service): Promise<void>;
  saveDoctor(doctor: Doctor): Promise<void>;
  saveTestimonial(testimonial: Testimonial): Promise<void>;
  removeRecord(table: TableName, id: string): Promise<void>;
  saveContent(content: SiteContent): Promise<void>;
  resetDemoData(): Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

const byOrder = <T extends { order: number }>(items: T[]) => [...items].sort((a, b) => a.order - b.order);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Database>(seedDatabase);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [mode, setMode] = useState<"local" | "supabase">("local");
  const [error, setError] = useState<string | null>(null);
  const adapterRef = useRef<DataAdapter | null>(null);

  const load = useCallback(async () => {
    const adapter = adapterRef.current ?? (await resolveAdapter());
    adapterRef.current = adapter;
    const next = await adapter.fetchAll();
    setData(next);
    return adapter;
  }, []);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const adapter = await load();
        if (!active) return;
        setMode(adapter.mode);
        setStatus("ready");
      } catch (cause) {
        if (!active) return;
        setError(cause instanceof Error ? cause.message : "Unknown error while loading clinic data.");
        setStatus("error");
      }
    })();

    return () => {
      active = false;
    };
  }, [load]);

  const withAdapter = useCallback(
    async <T,>(action: (adapter: DataAdapter) => Promise<T>): Promise<T> => {
      const adapter = adapterRef.current ?? (await resolveAdapter());
      adapterRef.current = adapter;
      const result = await action(adapter);
      const next = await adapter.fetchAll();
      setData(next);
      setMode(adapter.mode);
      setStatus("ready");
      return result;
    },
    [],
  );

  const value = useMemo<DataContextValue>(() => {
    const services = byOrder(data.services);
    const doctors = byOrder(data.doctors);
    const testimonials = [...data.testimonials].sort((a, b) => b.date.localeCompare(a.date));
    const appointments = [...data.appointments].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return {
      status,
      mode,
      error,
      content: data.content,
      appointments,
      services,
      publishedServices: services.filter((item) => item.published),
      featuredServices: services.filter((item) => item.published && item.featured),
      doctors,
      publishedDoctors: doctors.filter((item) => item.published),
      testimonials,
      approvedTestimonials: testimonials.filter((item) => item.approved),
      serviceBySlug: (slug) => services.find((item) => item.slug === slug),
      serviceById: (id) => services.find((item) => item.id === id),
      createAppointment: (input) => withAdapter((adapter) => adapter.createAppointment(input)),
      updateAppointment: (id, patch) => withAdapter((adapter) => adapter.updateAppointment(id, patch)),
      deleteAppointment: (id) => withAdapter((adapter) => adapter.deleteAppointment(id)),
      saveService: (service) => withAdapter((adapter) => adapter.upsertRecord("services", service)),
      saveDoctor: (doctor) => withAdapter((adapter) => adapter.upsertRecord("doctors", doctor)),
      saveTestimonial: (testimonial) => withAdapter((adapter) => adapter.upsertRecord("testimonials", testimonial)),
      removeRecord: (table, id) => withAdapter((adapter) => adapter.deleteRecord(table, id)),
      saveContent: (content) => withAdapter((adapter) => adapter.saveContent(content)),
      resetDemoData: async () => {
        try {
          await withAdapter((adapter) => adapter.reset());
        } catch (cause) {
          console.warn("[DentaCare] Resetting demo content is only available in demo mode.", cause);
        }
      },
    };
  }, [data, error, mode, status, withAdapter]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used inside a <DataProvider>.");
  }
  return context;
}

/** Convenience hook for the editable contact details used across the site. */
export function useClinic() {
  return useData().content.clinic;
}
