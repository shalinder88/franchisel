import type { BrandPageModel } from "@/lib/brand-page-model"

export default function Hero({ hero }: { hero: BrandPageModel["hero"] }) {
  return (
    <section id="hero" className="scroll-mt-24 pt-6 pb-10">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted">
        <span>{hero.category}</span>
        <span className="text-border">·</span>
        <span>FDD {hero.filingYear}</span>
      </div>
      <h1 className="mt-3 text-4xl sm:text-5xl font-semibold text-foreground tracking-tight">
        {hero.brandName}
      </h1>
      <p className="mt-5 max-w-3xl text-lg text-foreground/85 leading-relaxed">{hero.thesis}</p>
      <p className="mt-2 text-xs text-muted">{hero.verificationLabel}</p>

      {/* Metric strip */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-border rounded-lg overflow-hidden border border-border">
        {hero.keyMetrics.map((m) => (
          <div key={m.label} className="bg-surface p-4">
            <div className="text-[11px] uppercase tracking-wide text-muted">{m.label}</div>
            <div className="mt-1 text-lg font-semibold text-foreground tabular-nums">{m.value}</div>
            {m.sublabel ? <div className="mt-0.5 text-[11px] text-muted">{m.sublabel}</div> : null}
          </div>
        ))}
      </div>

      {/* Positives / cautions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-border bg-surface p-5">
          <div className="text-[11px] uppercase tracking-widest text-success">Why operators choose this brand</div>
          <ul className="mt-3 space-y-2 text-sm text-foreground/85">
            {hero.positives.map((p, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden className="mt-1.5 h-1.5 w-1.5 rounded-full bg-success shrink-0" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-border bg-surface p-5">
          <div className="text-[11px] uppercase tracking-widest text-warning">What gives buyers pause</div>
          <ul className="mt-3 space-y-2 text-sm text-foreground/85">
            {hero.cautions.map((p, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden className="mt-1.5 h-1.5 w-1.5 rounded-full bg-warning shrink-0" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
