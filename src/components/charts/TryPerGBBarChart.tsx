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
import {
  hardwareProfiles,
  usableLLMMemoryGB,
  tryPerGB,
} from "@/data/hardware";
import { formatTRY } from "@/lib/utils";

/**
 * "Büyük model için en uygun fiyat" perspektifinin ana grafiği.
 * Y ekseni: donanım; X ekseni: TL / kullanılabilir GB (düşük = iyi).
 * En az 30GB kullanılabilir belleği olanlar öne çıkarılır.
 */
export function TryPerGBBarChart() {
  const rows = hardwareProfiles
    .map((hw) => {
      const usable = usableLLMMemoryGB(hw);
      const ratio = tryPerGB(hw);
      return {
        id: hw.id,
        name: hw.name,
        usableGB: usable,
        tryPerGB: ratio,
        market: hw.market,
        totalTRY: hw.approxPriceTRY,
      };
    })
    .filter((r) => r.tryPerGB != null && r.usableGB >= 10)
    .sort((a, b) => (a.tryPerGB ?? 0) - (b.tryPerGB ?? 0));

  const colorFor = (usableGB: number, market?: string) => {
    if (usableGB >= 40) return "hsl(var(--chart-3))"; // yeşil: büyük model yetenekli
    if (usableGB >= 20)
      return market === "used" ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))";
    return "hsl(var(--muted-foreground))";
  };

  return (
    <div className="h-[520px] w-full">
      <ResponsiveContainer>
        <BarChart
          data={rows}
          layout="vertical"
          margin={{ top: 10, right: 80, left: 10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            type="number"
            tickFormatter={(v) => `${(v / 1000).toFixed(1)}K`}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            label={{
              value: "TL / kullanılabilir GB (düşük daha iyi)",
              position: "insideBottom",
              offset: -6,
              style: { fill: "hsl(var(--muted-foreground))", fontSize: 12 },
            }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={230}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload as (typeof rows)[number];
              return (
                <div className="rounded-lg border border-border/70 bg-popover/95 px-3 py-2 text-xs shadow-xl backdrop-blur-sm">
                  <div className="mb-1 font-semibold">{d.name}</div>
                  <div className="text-muted-foreground">
                    Kullanılabilir: <span className="font-mono text-foreground">{d.usableGB} GB</span>
                  </div>
                  <div className="text-muted-foreground">
                    TL/GB:{" "}
                    <span className="font-mono text-primary">
                      {d.tryPerGB != null ? d.tryPerGB.toLocaleString("tr-TR") : "—"}
                    </span>
                  </div>
                  <div className="text-muted-foreground">
                    Toplam:{" "}
                    <span className="font-mono text-foreground">
                      {d.totalTRY != null ? formatTRY(d.totalTRY) : "—"}
                    </span>
                  </div>
                  {d.market === "used" && (
                    <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                      İkinci El
                    </div>
                  )}
                </div>
              );
            }}
            cursor={{ fill: "hsl(var(--secondary) / 0.3)" }}
          />
          <Bar dataKey="tryPerGB" radius={[0, 6, 6, 0]}>
            {rows.map((r) => (
              <Cell key={r.id} fill={colorFor(r.usableGB, r.market)} />
            ))}
            <LabelList
              dataKey="usableGB"
              position="right"
              formatter={(v: number) => `${v}GB`}
              style={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-2 text-xs text-muted-foreground">
        Renk: <span className="text-chart-3">yeşil = 70B-yetenekli (≥40GB)</span>{" "}
        · <span className="text-chart-1">mavi = yeni 20-39GB</span>{" "}
        · <span className="text-chart-2">mor = ikinci el 20-39GB</span>. Yanındaki etiket kullanılabilir
        LLM belleği.
      </p>
    </div>
  );
}

/**
 * Kompakt fiyat karşılaştırma tablosu (3 satır: Mac mini vs Mac Studio vs PC eşdeğeri).
 */
export function PriceTierCompact() {
  const tiers = [
    {
      id: "mac-mini-m4-16",
      label: "Mac mini M4 16GB",
      tl: "30.000 TL",
      usable: "~11 GB",
      verdict: "Başlangıç · 7-8B ile sınırlı",
      chat: "25 tok/s",
      coder32: "❌",
      llama70: "❌",
    },
    {
      id: "mac-studio-m4-max-36",
      label: "Mac Studio M4 Max 36GB",
      tl: "120.000 TL (4x)",
      usable: "~25 GB",
      verdict: "32B rahat · 70B Q3 zorla",
      chat: "75 tok/s",
      coder32: "18 tok/s",
      llama70: "⚠️ Q3 ~5",
    },
    {
      id: "pc-dual-3090",
      label: "2x RTX 3090 ikinci el (eş bütçe)",
      tl: "~105.000 TL",
      usable: "~45 GB",
      verdict: "70B Q4 rahat · CUDA + fine-tune",
      chat: "180 tok/s",
      coder32: "50 tok/s",
      llama70: "20 tok/s",
    },
    {
      id: "mac-studio-m2-ultra-64-used",
      label: "Mac Studio M2 Ultra 64GB (ikinci el)",
      tl: "~115.000 TL",
      usable: "~45 GB",
      verdict: "70B Q4 rahat · sessiz · 800GB/s",
      chat: "140 tok/s",
      coder32: "20 tok/s",
      llama70: "13 tok/s",
    },
  ];

  return (
    <div className="overflow-x-auto rounded-xl border border-border/60 bg-card/40">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-border/60 bg-secondary/30 text-xs uppercase tracking-wider text-muted-foreground">
            <th className="px-3 py-2 text-left">Sistem</th>
            <th className="px-3 py-2 text-right">TL</th>
            <th className="px-3 py-2 text-right">Kull. bellek</th>
            <th className="px-3 py-2 text-right">Chat 8B</th>
            <th className="px-3 py-2 text-right">Coder 32B</th>
            <th className="px-3 py-2 text-right">Llama 70B Q4</th>
            <th className="px-3 py-2 text-left">Yorum</th>
          </tr>
        </thead>
        <tbody>
          {tiers.map((t) => (
            <tr key={t.id} className="border-b border-border/40 last:border-0">
              <td className="px-3 py-2 font-medium">{t.label}</td>
              <td className="px-3 py-2 text-right font-mono">{t.tl}</td>
              <td className="px-3 py-2 text-right font-mono">{t.usable}</td>
              <td className="px-3 py-2 text-right font-mono text-primary">{t.chat}</td>
              <td className="px-3 py-2 text-right font-mono text-accent">{t.coder32}</td>
              <td className="px-3 py-2 text-right font-mono text-emerald-400">{t.llama70}</td>
              <td className="px-3 py-2 text-xs text-muted-foreground">{t.verdict}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
