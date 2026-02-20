"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TrendPoint } from "@/lib/types";

interface ReachTrendProps {
  data: TrendPoint[];
  accentColor: string;
}

export function ReachTrend({ data, accentColor }: ReachTrendProps) {
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <div className="rounded-2xl bg-card border border-card-border p-6 mb-10">
      <h2 className="text-sm uppercase tracking-widest text-muted mb-4">
        30-Day Reach Trend
      </h2>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formatted}>
            <defs>
              <linearGradient id="reachGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accentColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              tick={{ fill: "#6B7280", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval={6}
            />
            <YAxis
              tick={{ fill: "#6B7280", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #1E293B",
                borderRadius: "8px",
                color: "#E8ECF1",
                fontSize: "13px",
              }}
              labelStyle={{ color: "#6B7280" }}
            />
            <Area
              type="monotone"
              dataKey="reach"
              stroke={accentColor}
              strokeWidth={2}
              fill="url(#reachGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
