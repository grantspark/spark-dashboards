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
  active: "bg-green-50 text-health-good border border-green-200",
  ended: "bg-gray-50 text-muted border border-card-border",
};

export function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <div className="card p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-2.5 h-2.5 rounded-full ${healthColors[campaign.health]}`}
          />
          <h3 className="font-semibold text-sm">{campaign.name}</h3>
        </div>
        <span
          className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusBadge[campaign.status]}`}
        >
          {campaign.status === "active" ? "Live" : "Ended"}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-muted mb-0.5">Lifetime Spend</p>
          <p className="font-semibold gradient-text">
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
