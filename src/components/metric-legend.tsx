const definitions = [
  {
    term: "Reach",
    emoji: "👥",
    definition:
      "The number of unique people who saw your content. One person seeing your ad three times still counts as one reach.",
  },
  {
    term: "Impressions",
    emoji: "👁️",
    definition:
      "The total number of times your content was displayed. One person might see it multiple times.",
  },
  {
    term: "Clicks",
    emoji: "👆",
    definition:
      "The number of times someone clicked on your ad to visit your website or take an action.",
  },
  {
    term: "CTR (Click-Through Rate)",
    emoji: "📊",
    definition:
      "The percentage of people who clicked after seeing your ad. Higher is better — it means your ad is compelling.",
  },
  {
    term: "Spend",
    emoji: "💰",
    definition:
      "The total amount invested in advertising during this period.",
  },
];

export function MetricLegend() {
  return (
    <div className="rounded-2xl bg-card border border-card-border p-6 mb-10">
      <h2 className="text-sm uppercase tracking-widest text-muted mb-4">
        What do these numbers mean?
      </h2>
      <div className="space-y-3">
        {definitions.map((d) => (
          <div key={d.term} className="flex gap-3">
            <span className="text-lg shrink-0">{d.emoji}</span>
            <div>
              <p className="text-sm font-semibold">{d.term}</p>
              <p className="text-xs text-muted leading-relaxed">
                {d.definition}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
