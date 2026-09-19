import type { Appointment, AppointmentInput, Database, Doctor, Service, SiteContent, Testimonial } from "./types";

/** Editable collections that the admin dashboard can write to. */
export interface TableRecordMap {
  services: Service;
  doctors: Doctor;
  testimonials: Testimonial;
}

export type TableName = keyof TableRecordMap;

/**
 * Every screen of the website reads and writes through this interface, which is
 * why swapping the demo storage for Supabase (or anything else) is a one-file
 * change. See `local.ts` and `supabase.ts` for the two implementations.
 */
export interface DataAdapter {
  readonly mode: "local" | "supabase";
  fetchAll(): Promise<Database>;
  createAppointment(input: AppointmentInput): Promise<Appointment>;
  updateAppointment(id: string, patch: Partial<Appointment>): Promise<void>;
  deleteAppointment(id: string): Promise<void>;
  upsertRecord<K extends TableName>(table: K, record: TableRecordMap[K]): Promise<void>;
  deleteRecord(table: TableName, id: string): Promise<void>;
  saveContent(content: SiteContent): Promise<void>;
  /** Restore the original fictional demo content. */
  reset(): Promise<void>;
}
