import { formatNumber } from "@/lib/data";

interface ReachBreakdownProps {
  paidReach: number;
  organicReach: number;
  totalReach: number;
  accentColor: string;
}

export function ReachBreakdown({
  paidReach,
  organicReach,
  totalReach,
}: ReachBreakdownProps) {
  const paidPct = Math.round((paidReach / totalReach) * 100);
  const organicPct = 100 - paidPct;

  return (
    <div className="rounded-2xl border border-card-border p-6 mb-10">
      <h2 className="text-sm uppercase tracking-widest text-muted mb-4">
        Reach Breakdown
      </h2>
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-[#FF6B47]" />
            <span className="text-sm text-muted">Paid Ads</span>
          </div>
          <p className="text-2xl font-bold">{formatNumber(paidReach)}</p>
          <p className="text-xs text-muted">{paidPct}% of total</p>
        </div>
        {organicReach > 0 && (
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-[#E91E8C]" />
              <span className="text-sm text-muted">Organic</span>
            </div>
            <p className="text-2xl font-bold">{formatNumber(organicReach)}</p>
            <p className="text-xs text-muted">{organicPct}% of total</p>
          </div>
        )}
      </div>
      {/* Gradient bar */}
      <div className="mt-4 h-3 rounded-full bg-[#F2F1EF] overflow-hidden flex">
        <div
          className="h-full rounded-l-full bg-[#FF6B47]"
          style={{ width: `${paidPct}%` }}
        />
        {organicReach > 0 && (
          <div
            className="h-full rounded-r-full bg-[#E91E8C]"
            style={{ width: `${organicPct}%` }}
          />
        )}
      </div>
    </div>
  );
}
