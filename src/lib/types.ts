export interface Client {
  slug: string;
  name: string;
  initials: string;
  accentColor: string;
  adAccountId: string | null;
  pageId: string | null;
  partnerSince: string;
  services: string[];
  active: boolean;
}

export interface CampaignMetrics {
  spend: number;
  reach: number;
  clicks: number;
  ctr: number;
}

export interface Campaign {
  name: string;
  status: "active" | "ended";
  health: "good" | "warning" | "bad";
  metrics: CampaignMetrics;
}

export interface TrendPoint {
  date: string;
  reach: number;
}

export interface MetricsSummary {
  totalReach: number;
  paidReach: number;
  organicReach: number;
  totalSpend: number;
  totalClicks: number;
  avgCtr: number;
}

export interface ClientMetrics {
  lastSync: string;
  summary: MetricsSummary;
  trend: TrendPoint[];
  campaigns: Campaign[];
}
