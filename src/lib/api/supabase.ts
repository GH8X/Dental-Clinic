import { createClient } from "@supabase/supabase-js";
import type { DataAdapter, TableName } from "./adapter";
import { APPOINTMENT_STATUSES, type Appointment, type Database, type SiteContent } from "./types";

/**
 * Thin Supabase adapter.
 *
 * Columns are snake_case in Postgres and camelCase in the app, so records are
 * mapped generically in both directions. Run `supabase/schema.sql` once in the
 * Supabase SQL editor and set VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY to
 * move the entire website and dashboard onto Supabase.
 */

interface ApiError {
  message: string;
}

interface ApiResult<T = unknown> {
  data: T | null;
  error: ApiError | null;
}

interface QueryBuilder<T = unknown> extends PromiseLike<ApiResult<T>> {
  eq(column: string, value: unknown): QueryBuilder<T>;
  order(column: string, options?: { ascending?: boolean }): QueryBuilder<T>;
}

interface TableClient {
  select<T = Record<string, unknown>>(columns?: string): QueryBuilder<T[]>;
  insert(values: unknown): QueryBuilder;
  upsert(values: unknown, options?: { onConflict?: string }): QueryBuilder;
  update(values: unknown): QueryBuilder;
  delete(): QueryBuilder;
}

interface SupabaseLike {
  from(table: string): TableClient;
}

type Row = Record<string, unknown>;

const CONTENT_ROW_ID = "main";

function toSnakeKey(key: string) {
  return key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
}

function toCamelKey(key: string) {
  return key.replace(/_([a-z])/g, (_match, char: string) => char.toUpperCase());
}

function toRow(record: Record<string, unknown>): Row {
  const row: Row = {};
  for (const [key, value] of Object.entries(record)) {
    if (value === undefined) continue;
    row[toSnakeKey(key)] = value;
  }
  return row;
}

function fromRow<T>(row: Row): T {
  const record: Row = {};
  for (const [key, value] of Object.entries(row)) {
    record[toCamelKey(key)] = value;
  }
  return record as unknown as T;
}

function unwrap<T>(result: ApiResult<T>, context: string): T {
  if (result.error) {
    throw new Error(`${context}: ${result.error.message}`);
  }
  return (result.data ?? null) as T;
}

export function createSupabaseAdapter(url: string, anonKey: string): DataAdapter {
  const supabase = createClient(url, anonKey) as unknown as SupabaseLike;

  async function selectAll<T>(table: string, order?: { column: string; ascending?: boolean }): Promise<T[]> {
    let query = supabase.from(table).select<Row>("*");
    if (order) query = query.order(order.column, { ascending: order.ascending ?? true });
    const rows = unwrap<Row[]>(await query, `Loading ${table}`);
    return (rows ?? []).map((row) => fromRow<T>(row));
  }

  async function upsertRow(table: string, record: Record<string, unknown>) {
    const result = await supabase.from(table).upsert(toRow(record), { onConflict: "id" });
    if (result.error) throw new Error(`Saving ${table}: ${result.error.message}`);
  }

  async function deleteRow(table: string, id: string) {
    const result = await supabase.from(table).delete().eq("id", id);
    if (result.error) throw new Error(`Deleting from ${table}: ${result.error.message}`);
  }

  return {
    mode: "supabase",

    async fetchAll(): Promise<Database> {
      const [services, doctors, testimonials, appointments] = await Promise.all([
        selectAll<Database["services"][number]>("services", { column: "sort_order" }),
        selectAll<Database["doctors"][number]>("doctors", { column: "sort_order" }),
        selectAll<Database["testimonials"][number]>("testimonials", { column: "date", ascending: false }),
        selectAll<Database["appointments"][number]>("appointments", { column: "preferred_date", ascending: false }),
      ]);

      const contentResult = await supabase.from("site_content").select<Row>("*").eq("id", CONTENT_ROW_ID);
      const contentRows = unwrap<Row[]>(contentResult, "Loading site content");
      const content = (contentRows?.[0]?.data as SiteContent | undefined) ?? null;

      if (!content) {
        throw new Error("Loading site content: no row with id 'main' in site_content.");
      }

      return {
        services,
        doctors,
        testimonials,
        appointments: appointments.filter((appointment) =>
          APPOINTMENT_STATUSES.includes(appointment.status),
        ),
        content,
      };
    },

    async createAppointment(input) {
      const service = await supabase
        .from("services")
        .select<Row>("*")
        .eq("id", input.serviceId);
      const rows = unwrap<Row[]>(service, "Loading service");
      const appointment: Appointment = {
        id: `apt_${Date.now().toString(36)}`,
        fullName: input.fullName.trim(),
        phone: input.phone.trim(),
        email: input.email.trim(),
        serviceId: input.serviceId,
        serviceName: (rows?.[0]?.name as string | undefined) ?? "General consultation",
        preferredDate: input.preferredDate,
        preferredTime: input.preferredTime,
        message: input.message?.trim() ?? "",
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      await upsertRow("appointments", appointment as unknown as Record<string, unknown>);
      return appointment;
    },

    async updateAppointment(id, patch) {
      const result = await supabase.from("appointments").update(toRow(patch as Record<string, unknown>)).eq("id", id);
      if (result.error) throw new Error(`Updating appointment: ${result.error.message}`);
    },

    async deleteAppointment(id) {
      await deleteRow("appointments", id);
    },

    async upsertRecord(table: TableName, record) {
      await upsertRow(table, record as unknown as Record<string, unknown>);
    },

    async deleteRecord(table, id) {
      await deleteRow(table, id);
    },

    async saveContent(content) {
      await upsertRow("site_content", { id: CONTENT_ROW_ID, data: content });
    },

    async reset() {
      throw new Error("Reset is only available in the local demo mode.");
    },
  };
}
