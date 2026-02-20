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

export function ReachTrend({ data }: ReachTrendProps) {
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <div className="card p-6 mb-10">
      <h2 className="text-sm uppercase tracking-widest text-muted mb-4">
        30-Day Reach Trend
      </h2>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formatted}>
            <defs>
              <linearGradient id="reachGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF6B47" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#E91E8C" stopOpacity={0} />
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
                backgroundColor: "#FFFFFF",
                border: "1px solid #E8E5DF",
                borderRadius: "8px",
                color: "#1C1C1C",
                fontSize: "13px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              labelStyle={{ color: "#6B7280" }}
            />
            <Area
              type="monotone"
              dataKey="reach"
              stroke="#E91E8C"
              strokeWidth={2}
              fill="url(#reachGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
