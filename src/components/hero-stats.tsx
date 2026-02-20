import { formatNumber } from "@/lib/data";

interface HeroStatsProps {
  totalReach: number;
  weeksPartnered: number;
  activeCampaigns: number;
  totalClicks: number;
  accentColor: string;
}

export function HeroStats({
  totalReach,
  weeksPartnered,
  activeCampaigns,
  totalClicks,
}: HeroStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {/* Main hero stat */}
      <div className="md:col-span-3 card p-8 text-center">
        <p className="text-muted text-sm uppercase tracking-widest mb-2">
          People introduced to your business
        </p>
        <p className="text-6xl md:text-7xl font-bold tracking-tight gradient-text">
          {formatNumber(totalReach)}
        </p>
        <p className="text-muted text-sm mt-2">in the last 30 days</p>
      </div>

      {/* Secondary stats */}
      <div className="card p-6 text-center">
        <p className="text-muted text-xs uppercase tracking-widest mb-1">
          Weeks Partnered
        </p>
        <p className="text-3xl font-bold text-foreground">
          {weeksPartnered}
        </p>
      </div>

      <div className="card p-6 text-center">
        <p className="text-muted text-xs uppercase tracking-widest mb-1">
          Active Campaigns
        </p>
        <p className="text-3xl font-bold text-foreground">
          {activeCampaigns}
        </p>
      </div>

      <div className="card p-6 text-center">
        <p className="text-muted text-xs uppercase tracking-widest mb-1">
          Total Clicks
        </p>
        <p className="text-3xl font-bold text-foreground">
          {formatNumber(totalClicks)}
        </p>
      </div>
    </div>
  );
}
