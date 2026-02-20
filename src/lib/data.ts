import fs from "fs";
import path from "path";
import type { Client, ClientMetrics } from "./types";

const dataDir = path.join(process.cwd(), "data");

export function getClients(): Client[] {
  const raw = fs.readFileSync(path.join(dataDir, "clients.json"), "utf-8");
  return JSON.parse(raw);
}

export function getClientBySlug(slug: string): Client | undefined {
  return getClients().find((c) => c.slug === slug);
}

export function getClientMetrics(slug: string): ClientMetrics | null {
  const filePath = path.join(dataDir, "metrics", `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

export function getWeeksPartnered(partnerSince: string): number {
  const start = new Date(partnerSince);
  const now = new Date();
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
}

export function formatNumber(n: number): string {
  if (n >= 1000) {
    return n.toLocaleString("en-US");
  }
  return n.toString();
}

export function formatCurrency(n: number): string {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function formatSyncDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
