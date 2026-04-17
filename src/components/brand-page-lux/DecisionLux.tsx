import type { BrandPageModel } from "@/lib/brand-page-model"
import { SectionLux } from "./primitives"
import { Icon } from "./icons"

export default function DecisionLux({
  hero,
  questions,
}: {
  hero: BrandPageModel["hero"]
  questions: BrandPageModel["franchiseeQuestions"]
}) {
  const topAsks = questions.slice(0, 3)

  return (
    <SectionLux
      id="decision"
      eyebrow="Decision framing"
      headline="Before you sign"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Consider if */}
        <div className="lux-card lux-rail-neutral p-7">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="check" width={16} height={16} className="text-[color:var(--lux-good)]" />
            <div className="lux-eyebrow">Consider this franchise if</div>
          </div>
          <ul className="space-y-4">
            {hero.positives.map((p, i) => (
              <li key={i} className="text-[14px] leading-[1.55] text-[color:var(--lux-ink)] lux-serif">
                &ldquo;{p}&rdquo;
              </li>
            ))}
          </ul>
        </div>

        {/* Reconsider if */}
        <div className="lux-card lux-rail-caution p-7">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="pause" width={15} height={15} className="text-[color:var(--lux-warn)]" />
            <div className="lux-eyebrow">Reconsider if</div>
          </div>
          <ul className="space-y-4">
            {hero.cautions.map((c, i) => (
              <li key={i} className="text-[14px] leading-[1.55] text-[color:var(--lux-ink)] lux-serif">
                &ldquo;{c}&rdquo;
              </li>
            ))}
          </ul>
        </div>

        {/* Verify before commit */}
        <div className="lux-card lux-rail-neutral p-7">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="eye" width={15} height={15} className="text-[color:var(--lux-accent)]" />
            <div className="lux-eyebrow">Verify first</div>
          </div>
          <ol className="space-y-3">
            {topAsks.map((q, i) => (
              <li key={i} className="flex gap-3 text-[13px] leading-[1.5] text-[color:var(--lux-ink-soft)]">
                <span className="lux-serif text-[color:var(--lux-gold)] lux-num shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{q.question}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Closing editorial line */}
      <div className="mt-8 lux-quote max-w-3xl">
        You are buying operational scale on someone else&apos;s real estate. The data is honest, the system is large, and the contract is strict — decide whether that trade is right for you.
      </div>
    </SectionLux>
  )
}
