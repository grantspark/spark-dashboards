export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        {/* Spark branding */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-spark-teal">Spark</span> Client Reporting
          </h1>
          <p className="text-muted text-sm">
            Real-time growth metrics for our partners
          </p>
        </div>

        {/* Screenshot placeholder */}
        <div className="rounded-2xl bg-card border border-card-border p-6 mb-8 shadow-2xl">
          <div className="rounded-xl bg-background border border-card-border p-8">
            {/* Mock dashboard preview */}
            <p className="text-muted text-xs uppercase tracking-widest mb-2">
              People introduced to your business
            </p>
            <p className="text-5xl font-bold text-accent mb-1">14,832</p>
            <p className="text-muted text-xs mb-6">in the last 30 days</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted">Weeks Partnered</p>
                <p className="text-xl font-bold text-accent">12</p>
              </div>
              <div>
                <p className="text-xs text-muted">Active Campaigns</p>
                <p className="text-xl font-bold text-accent">4</p>
              </div>
              <div>
                <p className="text-xs text-muted">Total Clicks</p>
                <p className="text-xl font-bold text-accent">1,893</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted mt-4 italic">
            Sample client dashboard
          </p>
        </div>

        {/* CTA */}
        <a
          href="https://startwithspark.com"
          className="inline-block px-6 py-3 rounded-full bg-spark-teal text-background font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Learn more at startwithspark.com
        </a>

        <p className="text-xs text-muted mt-8">
          Spark Sites — Educate, Empower, Encourage
        </p>
      </div>
    </main>
  );
}
