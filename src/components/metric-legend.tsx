const definitions = [
  {
    term: "Reach",
    emoji: "\uD83D\uDC65",
    definition:
      "The number of unique people who saw your content. One person seeing your ad three times still counts as one reach.",
  },
  {
    term: "Impressions",
    emoji: "\uD83D\uDC41\uFE0F",
    definition:
      "The total number of times your content was displayed. One person might see it multiple times.",
  },
  {
    term: "Clicks",
    emoji: "\uD83D\uDC46",
    definition:
      "The number of times someone clicked on your ad to visit your website or take an action.",
  },
  {
    term: "CTR (Click-Through Rate)",
    emoji: "\uD83D\uDCCA",
    definition:
      "The percentage of people who clicked after seeing your ad. Higher is better \u2014 it means your ad is compelling.",
  },
  {
    term: "Lifetime Spend",
    emoji: "\uD83D\uDCB0",
    definition:
      "The total amount invested in advertising for this campaign since it started.",
  },
];

export function MetricLegend() {
  return (
    <div className="rounded-2xl border border-card-border p-6 mb-10">
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
