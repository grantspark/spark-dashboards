import { notFound } from "next/navigation";
import {
  getClients,
  getClientBySlug,
  getClientMetrics,
  getWeeksPartnered,
  formatSyncDate,
} from "@/lib/data";
import { HeroStats } from "@/components/hero-stats";
import { ReachTrend } from "@/components/reach-trend";
import { ReachBreakdown } from "@/components/reach-breakdown";
import { CampaignCard } from "@/components/campaign-card";
import { MetricLegend } from "@/components/metric-legend";

export function generateStaticParams() {
  const clients = getClients();
  return clients.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // We need to resolve this synchronously for metadata, but Next.js 15+ requires async params
  // Using a wrapper approach
  return params.then(({ slug }) => {
    const client = getClientBySlug(slug);
    return {
      title: client
        ? `${client.name} — Dashboard`
        : "Dashboard — Spark Sites",
    };
  });
}

export default async function ClientDashboard({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = getClientBySlug(slug);
  if (!client) notFound();

  const metrics = getClientMetrics(slug);
  if (!metrics) notFound();

  const weeksPartnered = getWeeksPartnered(client.partnerSince);
  const activeCampaigns = metrics.campaigns.filter(
    (c) => c.status === "active"
  );
  const endedCampaigns = metrics.campaigns.filter(
    (c) => c.status === "ended"
  );

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold shrink-0"
          style={{
            backgroundColor: client.accentColor + "20",
            color: client.accentColor,
          }}
        >
          {client.initials}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{client.name}</h1>
          <p className="text-sm text-muted">Your growth at a glance</p>
        </div>
      </div>

      {/* Hero Stats */}
      <HeroStats
        totalReach={metrics.summary.totalReach}
        weeksPartnered={weeksPartnered}
        activeCampaigns={activeCampaigns.length}
        accentColor={client.accentColor}
      />

      {/* Trend */}
      <ReachTrend data={metrics.trend} accentColor={client.accentColor} />

      {/* Breakdown */}
      <ReachBreakdown
        paidReach={metrics.summary.paidReach}
        organicReach={metrics.summary.organicReach}
        totalReach={metrics.summary.totalReach}
        accentColor={client.accentColor}
      />

      {/* Active Campaigns */}
      {activeCampaigns.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm uppercase tracking-widest text-muted mb-4">
            Live Campaigns
          </h2>
          <div className="space-y-3">
            {activeCampaigns.map((c) => (
              <CampaignCard
                key={c.name}
                campaign={c}
                accentColor={client.accentColor}
              />
            ))}
          </div>
        </section>
      )}

      {/* Ended Campaigns */}
      {endedCampaigns.length > 0 && (
        <section className="mb-10">
          <details>
            <summary className="text-sm uppercase tracking-widest text-muted mb-4 cursor-pointer hover:text-foreground transition-colors">
              Recently Ended Campaigns ({endedCampaigns.length})
            </summary>
            <div className="space-y-3 mt-4">
              {endedCampaigns.map((c) => (
                <CampaignCard
                  key={c.name}
                  campaign={c}
                  accentColor={client.accentColor}
                />
              ))}
            </div>
          </details>
        </section>
      )}

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-10">
        <a
          href="https://startwithspark.com"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-full text-sm font-medium border border-card-border hover:border-accent transition-colors"
          style={{ color: client.accentColor }}
        >
          Book a Call
        </a>
        <a
          href="https://startwithspark.com"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-full text-sm font-medium border border-card-border hover:border-accent transition-colors text-muted hover:text-foreground"
        >
          Request Changes
        </a>
      </div>

      {/* Metric Legend */}
      <MetricLegend />

      {/* Footer */}
      <footer className="text-center py-6 border-t border-card-border">
        <p className="text-xs text-muted mb-1">
          Last sync: {formatSyncDate(metrics.lastSync)}
        </p>
        <p className="text-xs text-muted">
          Powered by{" "}
          <a
            href="https://startwithspark.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-spark-teal hover:underline"
          >
            Spark Sites
          </a>
        </p>
      </footer>
    </main>
  );
}
