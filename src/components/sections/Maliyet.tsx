import { useMemo, useState } from "react";
import { Section } from "./Section";
import { SectionHeader } from "../SectionHeader";
import { CostTcoChart } from "../charts/CostTcoChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarkdownNote } from "../MarkdownNote";
import { hardwareProfiles } from "@/data/hardware";
import { cloudProviders } from "@/data/cloudPricing";
import { localTcoTRY, breakEvenTokensPerDayTL } from "@/lib/calc";
import { formatTRY } from "@/lib/utils";

export function Maliyet() {
  const [amortMonths, setAmortMonths] = useState(36);
  const [electricityTL, setElectricityTL] = useState(5);
  const [loadHours, setLoadHours] = useState(3);

  const breakEvenData = useMemo(() => {
    return hardwareProfiles.map((hw) => {
      const local = localTcoTRY({
        hardware: hw,
        amortizationMonths: amortMonths,
        hoursPerDayUnderLoad: loadHours,
        tryPerKwh: electricityTL,
      });
      const flagship = cloudProviders
        .flatMap((p) =>
          p.models.map((m) => ({ ...m, provider: p.name }))
        )
        .find((m) => m.name === "GPT-5" && m.provider === "OpenAI");
      const cheap = cloudProviders
        .flatMap((p) =>
          p.models.map((m) => ({ ...m, provider: p.name }))
        )
        .find((m) => m.name === "DeepSeek V3.1" && m.provider === "DeepSeek");

      const flagshipBE = flagship
        ? breakEvenTokensPerDayTL(
            local.totalMonthlyTL,
            flagship.pricePerMillionIn,
            flagship.pricePerMillionOut,
          )
        : null;
      const cheapBE = cheap
        ? breakEvenTokensPerDayTL(
            local.totalMonthlyTL,
            cheap.pricePerMillionIn,
            cheap.pricePerMillionOut,
          )
        : null;
      return {
        hw,
        local,
        flagshipBE,
        cheapBE,
      };
    });
  }, [amortMonths, electricityTL, loadHours]);

  return (
    <Section id="maliyet">
      <SectionHeader
        eyebrow="06 · Maliyet"
        title="Yerel mi? Cloud mu? Para konuşalım"
        description="Donanım amortismanı + elektrik vs cloud API token ücreti. Günlük token kullanımına göre hangi çizgi daha ucuz?"
      />

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Varsayımları ayarla</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Slider
              label="Amortisman süresi"
              value={amortMonths}
              onChange={setAmortMonths}
              min={12}
              max={60}
              step={6}
              unit="ay"
            />
            <Slider
              label="Elektrik birim fiyatı"
              value={electricityTL}
              onChange={setElectricityTL}
              min={2}
              max={8}
              step={0.1}
              unit="TL/kWh"
              format={(v) => v.toFixed(2)}
            />
            <Slider
              label="Günlük yoğun kullanım"
              value={loadHours}
              onChange={setLoadHours}
              min={1}
              max={12}
              step={1}
              unit="saat"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            Aylık maliyet: yerel vs cloud
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CostTcoChart
            amortizationMonths={amortMonths}
            tryPerKwh={electricityTL}
            hoursPerDayUnderLoad={loadHours}
          />
        </CardContent>
      </Card>

      <SectionHeader
        eyebrow="Break-even"
        title="Yerel donanım ne zaman ucuzlar?"
        description="Her donanımın 'daha ucuz' olmaya başladığı günlük token eşiği (flagship ve ucuz cloud model referansıyla):"
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {breakEvenData.map(({ hw, local, flagshipBE, cheapBE }) => (
          <Card key={hw.id} className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{hw.name}</CardTitle>
              <div className="font-mono text-[11px] text-muted-foreground">
                Aylık: {formatTRY(local.totalMonthlyTL)} (HW:{" "}
                {formatTRY(local.hwMonthlyTL)} + Elk:{" "}
                {formatTRY(local.electricityMonthlyTL)})
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <BreakEvenRow
                label="vs GPT-5 (frontier 2026)"
                value={flagshipBE}
                tone="primary"
              />
              <BreakEvenRow
                label="vs DeepSeek V3.1 (~12 ₺/M in)"
                value={cheapBE}
                tone="accent"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <MarkdownNote tone="warning" title="Dikkat: gizli maliyetler">
{`- **Zaman**: Kurulum ve bakım birkaç saat sürer, senin zamanının değeri de bir maliyettir.
- **Fırsat maliyeti**: ~135.000 ₺'yi yerel AI yerine mevduat + pay-as-you-go API'ya ayırsan ne getirirdi?
- **Donanım eskime**: 3 yılda model standartları değişir; donanım değerini korumayabilir.
- **Elektrik**: Dual 4090 + 10 saat/gün → aylık ~1.500-2.300 ₺ elektrik ekstradır (5 ₺/kWh marjinal).`}
      </MarkdownNote>

      <MarkdownNote tone="insight" title="Hibrit strateji">
{`Çoğu durumda **hibrit** en iyi yol:
- **%80 yerel** (günlük chat, özetleme, RAG): gizlilik + ucuz + offline.
- **%20 cloud** (frontier kalite gerektiğinde GPT-4 / Claude Opus): nadir ama kritik işler.

Böylece abonelik ücretinden kurtulup pay-as-you-go API kullanırsın.`}
      </MarkdownNote>
    </Section>
  );
}

function BreakEvenRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | null;
  tone: "primary" | "accent";
}) {
  const toneClass = tone === "primary" ? "text-primary" : "text-accent";
  return (
    <div className="flex items-center justify-between rounded-md border border-border/40 bg-secondary/30 px-3 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`font-mono text-xs font-semibold ${toneClass}`}>
        {value != null ? `${value.toLocaleString("tr-TR")} tok/gün` : "—"}
      </span>
    </div>
  );
}

function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit,
  format,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
  format?: (v: number) => string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="font-mono text-sm text-primary">
          {format ? format(value) : value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </div>
  );
}
