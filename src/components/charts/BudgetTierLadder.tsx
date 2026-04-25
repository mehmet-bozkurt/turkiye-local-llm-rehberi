import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatTRY } from "@/lib/utils";

/**
 * 5 bütçe kademesi için kazanan donanım + 70B Q4 pratik hız + ya|anabilirlik sınıfı.
 * Veri dashboard'un data/hardware.ts ve Q8 bulgularından türetildi.
 *
 * Amaç: kullanıcı bir bakıta "benim bütçem hangi kademede, ne kazanıyorum"
 * sorusunun cevabını görür — ayrıntılı tier kartı altta zaten var.
 */
interface TierRow {
  tier: string;
  budget: number;
  winner: string;
  tps70BQ4: number;
  livability: "excellent" | "good" | "ok" | "poor";
  usableGB: number;
}

const ROWS: TierRow[] = [
  {
    tier: "90K",
    budget: 82_000,
    winner: "Mac mini M4 Pro 12/16 24GB",
    tps70BQ4: 0,
    livability: "excellent",
    usableGB: 17,
  },
  {
    tier: "150K",
    budget: 115_000,
    winner: "Mac Studio M2 Ultra 64GB (2. el)",
    tps70BQ4: 13,
    livability: "excellent",
    usableGB: 45,
  },
  {
    tier: "200K",
    budget: 200_000,
    winner: "M2 Ultra 64GB + hibrit bulut fon",
    tps70BQ4: 13,
    livability: "excellent",
    usableGB: 45,
  },
  {
    tier: "350K",
    budget: 320_000,
    winner: "Mac Studio M3 Ultra 192GB",
    tps70BQ4: 18,
    livability: "excellent",
    usableGB: 134,
  },
  {
    tier: "500K",
    budget: 320_000,
    winner: "Mac Studio M3 Ultra 192GB + 180K ₺ hibrit fon",
    tps70BQ4: 18,
    livability: "excellent",
    usableGB: 134,
  },
];

const LIVABILITY_COLOR: Record<TierRow["livability"], string> = {
  excellent: "hsl(142 71% 45%)",
  good: "hsl(160 70% 50%)",
  ok: "hsl(38 92% 55%)",
  poor: "hsl(0 72% 55%)",
};

const LIVABILITY_LABEL: Record<TierRow["livability"], string> = {
  excellent: "Oturma odasında sorunsuz",
  good: "Ofis/sakin oda",
  ok: "Ayrı oda tercih",
  poor: "Ayrı oda + klima zorunlu",
};

export function BudgetTierLadder() {
  return (
    <div>
      <div className="h-[320px] w-full">
        <ResponsiveContainer>
          <BarChart
            data={ROWS}
            layout="vertical"
            margin={{ top: 10, right: 110, left: 10, bottom: 26 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              type="number"
              dataKey="usableGB"
              domain={[0, 180]}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              label={{
                value: "Kullanılabilir LLM belleği (GB)",
                position: "insideBottom",
                offset: -8,
                style: {
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 12,
                },
              }}
            />
            <YAxis
              type="category"
              dataKey="tier"
              width={60}
              tick={{ fontSize: 13, fill: "hsl(var(--foreground))", fontWeight: 600 }}
              label={{
                value: "Bütçe (TL)",
                angle: -90,
                position: "insideLeft",
                offset: 0,
                style: {
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 11,
                },
              }}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--secondary) / 0.3)" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as TierRow;
                return (
                  <div className="rounded-lg border border-border/70 bg-popover/95 px-3 py-2 text-xs shadow-xl backdrop-blur-sm">
                    <div className="mb-1 font-semibold">{d.tier} TL kademesi</div>
                    <div className="text-muted-foreground">
                      Kazanan: <span className="text-foreground">{d.winner}</span>
                    </div>
                    <div className="text-muted-foreground">
                      Kullanılabilir:{" "}
                      <span className="font-mono text-primary">{d.usableGB} GB</span>
                    </div>
                    <div className="text-muted-foreground">
                      70B Q4 pratik:{" "}
                      <span className="font-mono text-foreground">
                        {d.tps70BQ4} tok/s
                      </span>
                    </div>
                    <div className="text-muted-foreground">
                      Gerçek fiyat:{" "}
                      <span className="font-mono text-emerald-400">
                        {formatTRY(d.budget)}
                      </span>
                    </div>
                    <div
                      className="mt-1 text-[10px] font-semibold uppercase tracking-wider"
                      style={{ color: LIVABILITY_COLOR[d.livability] }}
                    >
                      {LIVABILITY_LABEL[d.livability]}
                    </div>
                  </div>
                );
              }}
            />
            <Bar dataKey="usableGB" radius={[0, 6, 6, 0]}>
              {ROWS.map((r) => (
                <Cell key={r.tier} fill={LIVABILITY_COLOR[r.livability]} />
              ))}
              <LabelList
                dataKey="winner"
                position="right"
                style={{
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 11,
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-3 px-2 text-[11px] text-muted-foreground">
        <span>Yaşanabilirlik:</span>
        <LegendDot color={LIVABILITY_COLOR.excellent} label="Mükemmel · oturma odası" />
        <LegendDot color={LIVABILITY_COLOR.good} label="İyi · sakin ofis" />
        <LegendDot color={LIVABILITY_COLOR.ok} label="Uygun · ayrı oda" />
        <LegendDot color={LIVABILITY_COLOR.poor} label="Kötü · klima şart" />
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}
