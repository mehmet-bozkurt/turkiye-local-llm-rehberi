import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { hardwareProfiles } from "@/data/hardware";
import { cloudProviders } from "@/data/cloudPricing";
import { localTcoTRY, cloudTcoTRY } from "@/lib/calc";
import { ChartTooltip } from "./ChartTooltip";
import { formatTRY } from "@/lib/utils";

const DAILY_TOKEN_POINTS = [
  10_000, 25_000, 50_000, 100_000, 250_000, 500_000, 1_000_000, 2_500_000,
];

interface Props {
  amortizationMonths?: number;
  /** Marjinal elektrik fiyatı (TL/kWh). Türkiye konut yüksek kademesi ≈ 5-6 TL. */
  tryPerKwh?: number;
  hoursPerDayUnderLoad?: number;
}

/**
 * Günlük token tüketimine göre aylık maliyet karşılaştırması (yerel amortize vs cloud),
 * TL bazlı. Cloud USD fiyatları sabit kur (45 TL/USD) ile çevrilir.
 */
export function CostTcoChart({
  amortizationMonths = 36,
  tryPerKwh = 5,
  hoursPerDayUnderLoad = 3,
}: Props) {
  const [selectedHwIds, setSelectedHwIds] = useState<string[]>([
    "m3-max-36",
    "rtx-4070",
    "rtx-4090",
  ]);
  const [selectedCloudIds, setSelectedCloudIds] = useState<string[]>([
    "openai-GPT-5",
    "openai-GPT-5 mini",
    "deepseek-DeepSeek V3.1",
    "google-Gemini 2.5 Flash",
  ]);

  const cloudOptions = cloudProviders.flatMap((p) =>
    p.models.map((m) => ({ id: `${p.id}-${m.name}`, label: `${p.name} · ${m.name}`, ...m }))
  );

  const data = useMemo(() => {
    return DAILY_TOKEN_POINTS.map((tokens) => {
      const row: Record<string, number | string> = {
        tokens,
        tokensLabel: tokens >= 1_000_000 ? `${tokens / 1_000_000}M` : `${tokens / 1000}K`,
      };
      selectedHwIds.forEach((hwId) => {
        const hw = hardwareProfiles.find((h) => h.id === hwId);
        if (!hw) return;
        const local = localTcoTRY({
          hardware: hw,
          amortizationMonths,
          hoursPerDayUnderLoad,
          tryPerKwh,
        });
        row[`local:${hw.name}`] = local.totalMonthlyTL;
      });
      selectedCloudIds.forEach((cid) => {
        const opt = cloudOptions.find((c) => c.id === cid);
        if (!opt) return;
        const cloud = cloudTcoTRY({
          tokensPerDay: tokens,
          pricePerMillionIn: opt.pricePerMillionIn,
          pricePerMillionOut: opt.pricePerMillionOut,
        });
        row[`cloud:${opt.label}`] = cloud.monthlyTL;
      });
      return row;
    });
  }, [
    selectedHwIds,
    selectedCloudIds,
    amortizationMonths,
    tryPerKwh,
    hoursPerDayUnderLoad,
    cloudOptions,
  ]);

  const localPalette = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-2))",
    "hsl(160 70% 50%)",
  ];
  const cloudPalette = [
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(340 82% 60%)",
    "hsl(220 70% 60%)",
  ];

  const toggle = (
    arr: string[],
    setter: (v: string[]) => void,
    id: string
  ) => {
    setter(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Yerel donanım
          </div>
          <div className="flex flex-wrap gap-2">
            {hardwareProfiles.map((hw) => {
              const active = selectedHwIds.includes(hw.id);
              return (
                <button
                  key={hw.id}
                  type="button"
                  onClick={() => toggle(selectedHwIds, setSelectedHwIds, hw.id)}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    active
                      ? "border-primary/60 bg-primary/20 text-primary"
                      : "border-border/60 bg-secondary/40 text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {hw.name}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Cloud API
          </div>
          <div className="flex flex-wrap gap-2">
            {cloudOptions.map((opt) => {
              const active = selectedCloudIds.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    toggle(selectedCloudIds, setSelectedCloudIds, opt.id)
                  }
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    active
                      ? "border-accent/60 bg-accent/20 text-accent-foreground"
                      : "border-border/60 bg-secondary/40 text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="h-[440px] w-full">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="tokensLabel"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              label={{
                value: "Günlük token",
                position: "insideBottom",
                offset: -6,
                style: { fill: "hsl(var(--muted-foreground))", fontSize: 12 },
              }}
            />
            <YAxis
              tickFormatter={(v) => formatTRY(v)}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              label={{
                value: "Aylık maliyet (TL)",
                angle: -90,
                position: "insideLeft",
                offset: 15,
                style: { fill: "hsl(var(--muted-foreground))", fontSize: 12 },
              }}
              width={80}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ stroke: "hsl(var(--primary) / 0.4)" }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {selectedHwIds.map((hwId, idx) => {
              const hw = hardwareProfiles.find((h) => h.id === hwId);
              if (!hw) return null;
              return (
                <Line
                  key={hwId}
                  type="monotone"
                  dataKey={`local:${hw.name}`}
                  name={`Yerel: ${hw.name}`}
                  stroke={localPalette[idx % localPalette.length]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              );
            })}
            {selectedCloudIds.map((cid, idx) => {
              const opt = cloudOptions.find((c) => c.id === cid);
              if (!opt) return null;
              return (
                <Line
                  key={cid}
                  type="monotone"
                  dataKey={`cloud:${opt.label}`}
                  name={`Cloud: ${opt.label}`}
                  stroke={cloudPalette[idx % cloudPalette.length]}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3 }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-muted-foreground">
        Varsayımlar: Donanım {amortizationMonths} aya amortize,{" "}
        {hoursPerDayUnderLoad} saat/gün yoğun kullanım, elektrik{" "}
        {tryPerKwh.toFixed(2)} TL/kWh (EPDK yüksek kademe), cloud USD fiyatları
        45 TL/USD ile çevrildi, in/out token oranı 70/30.
      </p>
    </div>
  );
}
