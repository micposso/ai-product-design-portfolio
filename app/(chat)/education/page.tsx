import { PageTopNav } from "@/components/custom/page-top-nav";
import { SidebarRail } from "@/components/custom/sidebar-rail";

export default function Page() {
  return (
    <div className="px-4 pb-6 md:px-6 md:pb-8">
      <main className="mx-auto flex w-full max-w-screen-xl flex-col p-4 sm:p-6 lg:min-h-[calc(100svh-7rem)] lg:p-8">
        <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
          <SidebarRail />

          <div className="flex min-h-0 flex-col gap-4">
            <PageTopNav active="education" />

            <div className="content-fade-in overflow-hidden rounded-2xl bg-[var(--editorial-shell)] shadow-[0_40px_110px_-52px_rgba(28,23,19,0.5)]">
              <div className="flex flex-col gap-8 p-5 sm:p-6 lg:p-8">
                <section className="max-w-3xl border-l border-[color:var(--editorial-border)] pl-4">
                  <p className="editorial-sans editorial-subtle text-xs font-semibold uppercase tracking-[0.18em]">
                    Education
                  </p>
                  <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--editorial-text)] md:text-6xl">
                    Learning materials and teaching content.
                  </h1>
                  <p className="editorial-muted mt-4 max-w-2xl text-base leading-8 md:text-lg">
                    TBD. This section will house educational content, walkthroughs,
                    and resources.
                  </p>
                </section>

                <section className="editorial-card rounded-xl border p-6 sm:p-8">
                  <p className="editorial-sans text-xs font-semibold uppercase tracking-[0.18em] text-[var(--editorial-text)]">
                    Coming soon
                  </p>
                  <div className="education-copy mt-4 space-y-4 text-[var(--editorial-text)]">
                    <p className="text-base leading-8">
                      TBD
                    </p>
                    <p className="editorial-muted text-base leading-8">
                      Placeholder page for courses, guides, workshops, and
                      other educational material.
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
