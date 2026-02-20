import { formatNumber, formatCurrency } from "@/lib/data";
import type { Campaign } from "@/lib/types";

interface CampaignCardProps {
  campaign: Campaign;
  accentColor: string;
}

const healthColors = {
  good: "bg-health-good",
  warning: "bg-health-warning",
  bad: "bg-health-bad",
};

const statusBadge = {
  active: "bg-health-good/20 text-health-good",
  ended: "bg-muted/20 text-muted",
};

export function CampaignCard({ campaign, accentColor }: CampaignCardProps) {
  return (
    <div className="rounded-2xl bg-card border border-card-border p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-2.5 h-2.5 rounded-full ${healthColors[campaign.health]}`}
          />
          <h3 className="font-semibold text-sm">{campaign.name}</h3>
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[campaign.status]}`}
        >
          {campaign.status === "active" ? "Live" : "Ended"}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-muted mb-0.5">Spend</p>
          <p className="font-semibold" style={{ color: accentColor }}>
            {formatCurrency(campaign.metrics.spend)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted mb-0.5">Reach</p>
          <p className="font-semibold">
            {formatNumber(campaign.metrics.reach)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted mb-0.5">Clicks</p>
          <p className="font-semibold">
            {formatNumber(campaign.metrics.clicks)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted mb-0.5">CTR</p>
          <p className="font-semibold">{campaign.metrics.ctr}%</p>
        </div>
      </div>
    </div>
  );
}
