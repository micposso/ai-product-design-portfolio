import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="px-4 pb-6 pt-2 md:px-6 md:pb-8">
      <div className="editorial-sans mx-auto flex w-full max-w-screen-xl flex-col gap-3 rounded-2xl border border-[color:var(--editorial-border)]/35 bg-transparent px-4 py-4 text-[13px] text-[var(--editorial-footer-text)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="editorial-sans text-[13px] text-[var(--editorial-footer-text)]">
          Copyright {year} MichaelPosso.ai. Product engineering, voice
          interfaces, and agentic systems.
        </p>
        <div className="editorial-sans flex flex-wrap items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--editorial-footer-text)]">
          <Link href="/" className="editorial-sans transition hover:opacity-70">
            Home
          </Link>
          <Link href="/insights" className="editorial-sans transition hover:opacity-70">
            Insights
          </Link>
          <Link
            href="/case-study"
            className="editorial-sans transition hover:opacity-70"
          >
            Case Studies
          </Link>
        </div>
      </div>
    </footer>
  );
}
