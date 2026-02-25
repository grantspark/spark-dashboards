"use client";

import { useEffect, useState, useCallback } from "react";
import "./ops.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DailyTask {
  date: string;
  rank: number;
  category: string;
  task: string;
  entity: string;
  estimateMin: number;
  status: "done" | "active" | "pending";
  completedAt: string;
}

interface RevenueRow {
  month: string;
  mrr: number;
  target: number;
  marginPct: number;
  ccDebt: number;
  lastUpdated: string;
}

interface OverdueTask {
  taskId: string;
  taskName: string;
  daysOverdue: number;
  entity: string;
  url: string;
  lastSynced: string;
}

interface ConfigMap {
  [key: string]: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SHEET_ID = "1-GH8qoPhvvw-2HdzdSuPTGdcJoBLs8llNuZ7oWQKWUw";
const REFRESH_INTERVAL = 60_000; // 60 seconds

// Google Visualization API endpoint — works for any sheet shared with "anyone with link"
function sheetUrl(tab: string): string {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(tab)}`;
}

// ---------------------------------------------------------------------------
// Data fetching helpers
// ---------------------------------------------------------------------------

/** Google's gviz endpoint wraps JSON in a callback prefix — strip it. */
function parseGvizJson(raw: string): { cols: { label: string }[]; rows: { c: ({ v: string | number | null } | null)[] }[] } {
  const match = raw.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\);?\s*$/);
  if (!match) throw new Error("Unexpected gviz response format");
  return JSON.parse(match[1]).table;
}

function cellVal(cell: { v: string | number | null } | null): string {
  if (!cell || cell.v === null || cell.v === undefined) return "";
  return String(cell.v);
}

async function fetchTab<T>(tab: string, mapper: (headers: string[], row: (string | number | null)[]) => T): Promise<T[]> {
  const res = await fetch(sheetUrl(tab), { cache: "no-store" });
  const text = await res.text();
  const table = parseGvizJson(text);
  const headers = table.cols.map((c) => c.label);
  return table.rows.map((r) => {
    const values = r.c.map(cellVal);
    return mapper(headers, values);
  });
}

async function fetchDailyPlan(): Promise<DailyTask[]> {
  return fetchTab("DailyPlan", (_h, r) => ({
    date: r[0] as string,
    rank: Number(r[1]),
    category: r[2] as string,
    task: r[3] as string,
    entity: r[4] as string,
    estimateMin: Number(r[5]),
    status: (r[6] as string).toLowerCase() as DailyTask["status"],
    completedAt: r[7] as string,
  }));
}

async function fetchRevenue(): Promise<RevenueRow[]> {
  return fetchTab("Revenue", (_h, r) => ({
    month: r[0] as string,
    mrr: Number(r[1]),
    target: Number(r[2]),
    marginPct: Number(r[3]),
    ccDebt: Number(r[4]),
    lastUpdated: r[5] as string,
  }));
}

async function fetchOverdue(): Promise<OverdueTask[]> {
  return fetchTab("Overdue", (_h, r) => ({
    taskId: r[0] as string,
    taskName: r[1] as string,
    daysOverdue: Number(r[2]),
    entity: r[3] as string,
    url: r[4] as string,
    lastSynced: r[5] as string,
  }));
}

async function fetchConfig(): Promise<ConfigMap> {
  const rows = await fetchTab("Config", (_h, r) => ({ key: r[0] as string, value: r[1] as string }));
  const map: ConfigMap = {};
  for (const row of rows) map[row.key] = row.value;
  return map;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(n: number): string {
  return "$" + n.toLocaleString("en-US");
}

function todayISO(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function yesterdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function formatTime(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

// ---------------------------------------------------------------------------
// Status indicators
// ---------------------------------------------------------------------------

function StatusIcon({ status }: { status: DailyTask["status"] }) {
  if (status === "done") {
    return (
      <span className="ops-status-done" title="Done">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="9" stroke="#22C55E" strokeWidth="2" fill="rgba(34,197,94,0.15)" />
          <path d="M6 10.5l2.5 2.5L14 7.5" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }
  if (status === "active") {
    return (
      <span className="ops-status-active" title="Active">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="ops-spin">
          <circle cx="10" cy="10" r="9" stroke="rgba(255,107,71,0.3)" strokeWidth="2" />
          <path d="M10 1a9 9 0 0 1 9 9" stroke="#FF6B47" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
    );
  }
  return (
    <span className="ops-status-pending" title="Pending">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="9" stroke="#94A3B8" strokeWidth="2" fill="none" />
      </svg>
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const label = category === "$" ? "Revenue" : category === "!" ? "Urgent" : category;
  const bg = category === "$" ? "rgba(34,197,94,0.15)" : "rgba(234,179,8,0.15)";
  const color = category === "$" ? "#22C55E" : "#EAB308";
  return (
    <span
      style={{ background: bg, color, fontSize: "0.65rem", padding: "2px 8px", borderRadius: "9999px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}
    >
      {label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Cards
// ---------------------------------------------------------------------------

function DailyTopFive({ tasks }: { tasks: DailyTask[] }) {
  const today = todayISO();
  const todayTasks = tasks.filter((t) => t.date === today).sort((a, b) => a.rank - b.rank);
  const totalMin = todayTasks.reduce((s, t) => s + t.estimateMin, 0);
  const doneMin = todayTasks.filter((t) => t.status === "done").reduce((s, t) => s + t.estimateMin, 0);
  const doneCount = todayTasks.filter((t) => t.status === "done").length;

  return (
    <div className="ops-card">
      <div className="ops-card-header">
        <h2 className="ops-card-title">Daily Top 5</h2>
        <span className="ops-badge" style={{ background: "rgba(255,107,71,0.15)", color: "#FF6B47" }}>
          {doneCount}/{todayTasks.length} done
        </span>
      </div>
      <div className="ops-task-list">
        {todayTasks.map((t) => (
          <div key={t.rank} className={`ops-task-row ${t.status === "done" ? "ops-task-done" : ""}`}>
            <div className="ops-task-rank">#{t.rank}</div>
            <StatusIcon status={t.status} />
            <div className="ops-task-info">
              <div className="ops-task-name">{t.task}</div>
              <div className="ops-task-meta">
                <CategoryBadge category={t.category} />
                <span className="ops-task-entity">{t.entity}</span>
                <span className="ops-task-est">{t.estimateMin}m</span>
                {t.completedAt && <span className="ops-task-completed">at {formatTime(t.completedAt)}</span>}
              </div>
            </div>
          </div>
        ))}
        {todayTasks.length === 0 && <p className="ops-empty">No tasks for today yet.</p>}
      </div>
      <div className="ops-card-footer">
        <span>Est. total: {totalMin}m</span>
        <span>Completed: {doneMin}m</span>
      </div>
    </div>
  );
}

function RevenueCard({ revenue, config }: { revenue: RevenueRow | null; config: ConfigMap }) {
  if (!revenue) return null;
  const target = Number(config.target_mrr || revenue.target);
  const pct = Math.min(100, Math.round((revenue.mrr / target) * 100));
  const ccStart = Number(config.cc_debt_start || 29000);
  const ccPaidPct = ccStart > 0 ? Math.round(((ccStart - revenue.ccDebt) / ccStart) * 100) : 0;
  const marginColor = revenue.marginPct >= 50 ? "#22C55E" : revenue.marginPct >= 35 ? "#EAB308" : "#EF4444";

  return (
    <div className="ops-card">
      <div className="ops-card-header">
        <h2 className="ops-card-title">Revenue</h2>
        <span className="ops-muted">{revenue.month}</span>
      </div>
      <div className="ops-revenue-hero">
        <div className="ops-mrr">{formatCurrency(revenue.mrr)}</div>
        <div className="ops-mrr-label">Monthly Recurring Revenue</div>
      </div>
      {/* Progress to target */}
      <div className="ops-progress-section">
        <div className="ops-progress-label">
          <span>Progress to {formatCurrency(target)}</span>
          <span className="ops-gradient-text">{pct}%</span>
        </div>
        <div className="ops-progress-track">
          <div className="ops-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
      {/* Stats row */}
      <div className="ops-stats-row">
        <div className="ops-stat">
          <div className="ops-stat-label">Margin</div>
          <div className="ops-stat-value" style={{ color: marginColor }}>{revenue.marginPct}%</div>
        </div>
        <div className="ops-stat">
          <div className="ops-stat-label">CC Debt</div>
          <div className="ops-stat-value" style={{ color: "#EF4444" }}>{formatCurrency(revenue.ccDebt)}</div>
        </div>
        <div className="ops-stat">
          <div className="ops-stat-label">Debt Paid</div>
          <div className="ops-stat-value" style={{ color: "#22C55E" }}>{ccPaidPct}%</div>
        </div>
      </div>
    </div>
  );
}

function OverdueCard({ overdue }: { overdue: OverdueTask[] }) {
  const [expanded, setExpanded] = useState(false);
  const count = overdue.length;
  const badgeColor = count > 0 ? "#EF4444" : "#22C55E";
  const badgeBg = count > 0 ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)";

  return (
    <div className="ops-card">
      <div className="ops-card-header" style={{ cursor: count > 0 ? "pointer" : "default" }} onClick={() => count > 0 && setExpanded(!expanded)}>
        <h2 className="ops-card-title">Overdue</h2>
        <span className="ops-badge" style={{ background: badgeBg, color: badgeColor }}>
          {count}
        </span>
      </div>
      {count === 0 && <p className="ops-empty">All clear. No overdue tasks.</p>}
      {count > 0 && expanded && (
        <div className="ops-task-list">
          {overdue.sort((a, b) => b.daysOverdue - a.daysOverdue).map((t) => (
            <div key={t.taskId} className="ops-task-row">
              <div className="ops-task-info">
                <div className="ops-task-name">
                  {t.url ? (
                    <a href={t.url} target="_blank" rel="noopener noreferrer" className="ops-link">{t.taskName}</a>
                  ) : (
                    t.taskName
                  )}
                </div>
                <div className="ops-task-meta">
                  <span style={{ color: "#EF4444", fontWeight: 600, fontSize: "0.75rem" }}>{t.daysOverdue}d overdue</span>
                  <span className="ops-task-entity">{t.entity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {count > 0 && !expanded && <p className="ops-empty" style={{ cursor: "pointer" }} onClick={() => setExpanded(true)}>Click to expand ({count} tasks)</p>}
    </div>
  );
}

function YesterdayCard({ tasks }: { tasks: DailyTask[] }) {
  const yesterday = yesterdayISO();
  const yTasks = tasks.filter((t) => t.date === yesterday).sort((a, b) => a.rank - b.rank);
  if (yTasks.length === 0) return null;
  const doneCount = yTasks.filter((t) => t.status === "done").length;
  const pct = Math.round((doneCount / yTasks.length) * 100);
  const pctColor = pct >= 80 ? "#22C55E" : pct >= 50 ? "#EAB308" : "#EF4444";

  return (
    <div className="ops-card">
      <div className="ops-card-header">
        <h2 className="ops-card-title">Yesterday</h2>
        <span className="ops-badge" style={{ background: `${pctColor}22`, color: pctColor }}>
          {pct}% complete
        </span>
      </div>
      <div className="ops-task-list">
        {yTasks.map((t) => (
          <div key={t.rank} className={`ops-task-row ops-task-mini ${t.status === "done" ? "ops-task-done" : ""}`}>
            <StatusIcon status={t.status} />
            <span className="ops-task-name">{t.task}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Refresh indicator
// ---------------------------------------------------------------------------

function RefreshIndicator({ lastRefresh, countdown }: { lastRefresh: Date | null; countdown: number }) {
  return (
    <div className="ops-refresh">
      <div className="ops-refresh-dot" />
      <span>
        {lastRefresh ? `Updated ${formatDate(lastRefresh.toISOString())}` : "Loading..."}
        {countdown > 0 && ` \u00b7 next in ${countdown}s`}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function OpsPage() {
  const [dailyPlan, setDailyPlan] = useState<DailyTask[]>([]);
  const [revenue, setRevenue] = useState<RevenueRow | null>(null);
  const [overdue, setOverdue] = useState<OverdueTask[]>([]);
  const [config, setConfig] = useState<ConfigMap>({});
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      const [dp, rev, od, cfg] = await Promise.all([
        fetchDailyPlan(),
        fetchRevenue(),
        fetchOverdue(),
        fetchConfig(),
      ]);
      setDailyPlan(dp);
      setRevenue(rev[0] || null);
      setOverdue(od.filter((t) => t.taskId)); // filter empty rows
      setConfig(cfg);
      setLastRefresh(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch + auto-refresh
  useEffect(() => {
    fetchAll();
    const interval = setInterval(() => {
      fetchAll();
      setCountdown(60);
    }, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchAll]);

  // Countdown timer
  useEffect(() => {
    const tick = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 60));
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="ops-page">
      {/* Header */}
      <header className="ops-header">
        <div>
          <h1 className="ops-title">
            <span className="ops-gradient-text">Mission Control</span>
          </h1>
          <p className="ops-date">{today}</p>
        </div>
        <RefreshIndicator lastRefresh={lastRefresh} countdown={countdown} />
      </header>

      {/* Error state */}
      {error && (
        <div className="ops-error">
          <p>Failed to load data: {error}</p>
          <button onClick={fetchAll} className="ops-retry-btn">Retry</button>
        </div>
      )}

      {/* Loading state */}
      {loading && !error && (
        <div className="ops-loading">
          <div className="ops-spin-large">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="rgba(255,107,71,0.2)" strokeWidth="3" />
              <path d="M20 2a18 18 0 0 1 18 18" stroke="#FF6B47" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <p>Loading ops data...</p>
        </div>
      )}

      {/* Dashboard grid */}
      {!loading && (
        <div className="ops-grid">
          <div className="ops-col-main">
            <DailyTopFive tasks={dailyPlan} />
            <YesterdayCard tasks={dailyPlan} />
          </div>
          <div className="ops-col-side">
            <RevenueCard revenue={revenue} config={config} />
            <OverdueCard overdue={overdue} />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="ops-footer">
        <p>Spark \u2014 Educate, Empower, Encourage</p>
      </footer>
    </div>
  );
}
