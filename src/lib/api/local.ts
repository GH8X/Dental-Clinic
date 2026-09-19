import { sleep, uid } from "../utils";
import type { DataAdapter, TableName } from "./adapter";
import { seedDatabase } from "./seed";
import type { Appointment, Database } from "./types";

const STORAGE_KEY = "dentacare.clinic.db.v1";

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function isEmpty(value: unknown): boolean {
  return !Array.isArray(value) || value.length === 0;
}

/**
 * Demo storage: keeps the whole clinic dataset in the browser so the site and
 * the admin dashboard are fully interactive without any backend or API keys.
 */
export function createLocalAdapter(): DataAdapter {
  const read = (): Database => {
    if (typeof localStorage === "undefined") return clone(seedDatabase);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return clone(seedDatabase);
      const parsed = JSON.parse(raw) as Partial<Database>;
      if (!parsed || typeof parsed !== "object" || isEmpty(parsed.services) || isEmpty(parsed.doctors)) {
        return clone(seedDatabase);
      }
      return {
        services: parsed.services ?? clone(seedDatabase.services),
        doctors: parsed.doctors ?? clone(seedDatabase.doctors),
        testimonials: parsed.testimonials ?? clone(seedDatabase.testimonials),
        appointments: parsed.appointments ?? clone(seedDatabase.appointments),
        content: parsed.content ?? clone(seedDatabase.content),
      };
    } catch {
      return clone(seedDatabase);
    }
  };

  const write = (db: Database) => {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  };

  const mutate = (recipe: (db: Database) => void): Database => {
    const db = read();
    recipe(db);
    write(db);
    return db;
  };

  return {
    mode: "local",

    async fetchAll() {
      await sleep(160);
      return read();
    },

    async createAppointment(input) {
      const service = read().services.find((item) => item.id === input.serviceId);
      const appointment: Appointment = {
        id: uid("apt"),
        fullName: input.fullName.trim(),
        phone: input.phone.trim(),
        email: input.email.trim(),
        serviceId: input.serviceId,
        serviceName: service?.name ?? "General consultation",
        preferredDate: input.preferredDate,
        preferredTime: input.preferredTime,
        message: input.message?.trim() ?? "",
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      mutate((db) => {
        db.appointments = [appointment, ...db.appointments];
      });
      return appointment;
    },

    async updateAppointment(id, patch) {
      mutate((db) => {
        db.appointments = db.appointments.map((item) => (item.id === id ? { ...item, ...patch } : item));
      });
    },

    async deleteAppointment(id) {
      mutate((db) => {
        db.appointments = db.appointments.filter((item) => item.id !== id);
      });
    },

    async upsertRecord(table: TableName, record: { id: string }) {
      mutate((db) => {
        switch (table) {
          case "services":
            db.services = upsert(db.services, record);
            break;
          case "doctors":
            db.doctors = upsert(db.doctors, record);
            break;
          case "testimonials":
            db.testimonials = upsert(db.testimonials, record);
            break;
        }
      });
    },

    async deleteRecord(table, id) {
      mutate((db) => {
        if (table === "services") db.services = db.services.filter((item) => item.id !== id);
        if (table === "doctors") db.doctors = db.doctors.filter((item) => item.id !== id);
        if (table === "testimonials") db.testimonials = db.testimonials.filter((item) => item.id !== id);
      });
    },

    async saveContent(content) {
      mutate((db) => {
        db.content = content;
      });
    },

    async reset() {
      write(clone(seedDatabase));
    },
  };
}

function upsert<T extends { id: string }>(list: T[], record: { id: string }): T[] {
  const index = list.findIndex((item) => item.id === record.id);
  if (index === -1) return [...list, record as unknown as T];
  const next = list.slice();
  next[index] = record as unknown as T;
  return next;
}
