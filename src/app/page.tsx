export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-2xl text-center">
        {/* Spark branding */}
        <div className="mb-10">
          <p className="text-sm font-medium uppercase tracking-widest text-muted mb-3">
            More leads. Less stress.
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="gradient-text">Spark</span> Campaign Reporting
          </h1>
          <p className="text-muted text-base max-w-md mx-auto">
            Real-time growth metrics for our partners
          </p>
        </div>

        {/* Dashboard preview card */}
        <div className="rounded-2xl border border-card-border p-1 mb-10 shadow-xl bg-accent-tint/30">
          <div className="rounded-xl bg-white border border-card-border p-8">
            <p className="text-muted text-xs uppercase tracking-widest mb-2">
              People introduced to your business
            </p>
            <p className="text-5xl md:text-6xl font-bold gradient-text mb-1">
              14,832
            </p>
            <p className="text-muted text-xs mb-8">in the last 30 days</p>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-muted mb-1">Weeks Partnered</p>
                <p className="text-2xl font-bold text-foreground">12</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Active Campaigns</p>
                <p className="text-2xl font-bold text-foreground">4</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Total Clicks</p>
                <p className="text-2xl font-bold text-foreground">1,893</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted mt-3 mb-1 italic">
            Sample client dashboard
          </p>
        </div>

        {/* CTA */}
        <a
          href="https://sparkmysite.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
        >
          Visit sparkmysite.com
        </a>

        <p className="text-xs text-muted mt-10">
          Spark — Educate, Empower, Encourage
        </p>
      </div>
    </main>
  );
}
