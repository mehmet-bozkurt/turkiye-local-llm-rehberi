import { Section } from "./Section";
import { SectionHeader } from "../SectionHeader";
import { MarkdownNote } from "../MarkdownNote";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductLink } from "../ProductLink";
import { getHardwareById } from "@/data/hardware";
import {
  Trophy,
  Medal,
  Crown,
  Cable,
  MemoryStick,
  Gauge,
  Zap,
  Network,
  Boxes,
  CheckCircle2,
  XCircle,
  TriangleAlert,
  DollarSign,
} from "lucide-react";

/**
 * 12 · 3-yollu senaryo karşılaştırması.
 *
 * Sorular arası en istenen analiz: eşit bütçeli üç Apple Silicon yaklaşımı.
 *   A. 4× Mac mini M4 16GB/512GB (TB4 cluster)    → 172K ₺
 *   B. 2× Mac mini M4 Pro 24GB/512GB (TB5 cluster) → 160K ₺
 *   C. 1× Mac Studio M2 Ultra 64GB/512GB (sıfır)   → 160K ₺
 *
 * Fiyat referansı: kullanıcının sağladığı 2026-Q2 sıfır fiyat listesi.
 * Benchmark referansları: Exo Labs (day-1/day-2 bloglar), /r/LocalLLaMA
 * saha raporları, llama.cpp GitHub tartışmaları, Ollama issues.
 */
export function SenaryoKarsilastirma() {
  return (
    <Section id="senaryo-karsilastirma">
      <SectionHeader
        eyebrow="12 · Eşit Bütçe 3-Yollu Senaryo"
        title="160-172K ₺ aralığında üç Apple yol — hangisi kazanıyor?"
        description="Yeni (sıfır) fiyatlarla bu üç senaryo neredeyse aynı bütçede. API servisi için hangisi en mantıklı? Bellek, bant genişliği, interconnect, eş zamanlı istek, TCO — tüm eksenlerde kıyas."
      />

      <VerdictCard />

      <SectionHeader
        className="mt-14"
        eyebrow="Teknik spec matrisi"
        title="Üç sistemin aynı eksende karşılaştırması"
      />
      <SpecMatrix />

      <SectionHeader
        className="mt-14"
        eyebrow="Interconnect & topoloji"
        title="Node'lar arasında bit'lerin gerçek maliyeti"
        description="Aynı model 3 farklı topolojide farklı davranır. TB4/TB5/PCIe-equiv latency tablosu."
      />
      <InterconnectAnalysis />

      <SectionHeader
        className="mt-14"
        eyebrow="Model kompatibilitesi"
        title="Hangi model hangi senaryoda sığar ve kullanılabilir hızda mı koşar?"
      />
      <ModelCompatibilityTable />

      <SectionHeader
        className="mt-14"
        eyebrow="API servisi — tek istek"
        title="Bir kullanıcı sorduğunda: TTFT + tok/s"
        description="İnteraktif (chat) deneyimde algı eşiği: TTFT < 2 sn, generation ≥ 10 tok/s."
      />
      <SingleRequestPerf />

      <SectionHeader
        className="mt-14"
        eyebrow="API servisi — concurrent"
        title="5-20 eş zamanlı istekte ne oluyor?"
        description="Continuous batching + KV cache paylaşımı senin en büyük farkı yarattığı yer. Tek kasa burada kazanır."
      />
      <ConcurrentRequestPerf />

      <SectionHeader
        className="mt-14"
        eyebrow="Günlük token kapasitesi"
        title="8 saatlik aktif servis penceresinde üretilen token"
      />
      <DailyTokenCapacity />

      <SectionHeader
        className="mt-14"
        eyebrow="Fine-tune ve ekosistem"
        title="CUDA dünyasının dışında — hangisi ne kadar yapar?"
      />
      <EcosystemMatrix />

      <SectionHeader
        className="mt-14"
        eyebrow="TCO · 36 ay"
        title="Kasa + elektrik + oportünite maliyeti"
      />
      <TcoAnalysis />

      <SectionHeader
        className="mt-14"
        eyebrow="Puanlama"
        title="9 eksende ağırlıklı skor"
        description="Her eksene 1-10 puan, API servisi use case'ine göre ağırlıklandırılmış."
      />
      <ScoreMatrix />

      <SectionHeader
        className="mt-14"
        eyebrow="Gizli dezavantajlar"
        title="Kataloğa girmeyen detaylar"
      />
      <HiddenPitfalls />

      <SectionHeader
        className="mt-14"
        eyebrow="Karar ağacı"
        title="Hangisini ne zaman seç?"
      />
      <DecisionTree />

      <FinalNote />
    </Section>
  );
}

/* =========================================================================
 * Verdict card — üst özeti
 * ======================================================================= */

function VerdictCard() {
  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
          <Trophy className="h-4 w-4" />
          TL;DR · 30 saniyelik cevap
        </div>
        <h3 className="mb-4 text-2xl font-bold tracking-tight">
          API servisi için <span className="text-primary">M2 Ultra 64GB sıfır</span>,
          deneyim + cluster oyunu için <span className="text-amber-500">4× M4 16GB</span>,
          dengeli giriş için <span className="text-sky-500">2× M4 Pro 24GB TB5</span>.
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <RankCard
            rank="1"
            icon={<Crown className="h-5 w-5" />}
            tone="amber"
            title="M2 Ultra 64GB sıfır"
            price="160K ₺"
            why="Tek kasa + 800 GB/s + continuous batching + 45GB usable. Concurrent API'de tartışmasız lider."
          />
          <RankCard
            rank="2"
            icon={<Medal className="h-5 w-5" />}
            tone="slate"
            title="2× M4 Pro 24GB TB5"
            price="160K ₺"
            why="Aynı paraya cluster esnekliği. Tek node 24GB ile yedek kalır. 32B'e kadar güvenli."
          />
          <RankCard
            rank="3"
            icon={<Medal className="h-5 w-5" />}
            tone="bronze"
            title="4× M4 16GB TB4"
            price="172K ₺"
            why="En fazla pool (44GB) ama TB4 latency + overhead + 4 kasa. Öğrenme projesi için güzel."
          />
        </div>
      </CardContent>
    </Card>
  );
}

function RankCard({
  rank,
  icon,
  tone,
  title,
  price,
  why,
}: {
  rank: string;
  icon: React.ReactNode;
  tone: "amber" | "slate" | "bronze";
  title: string;
  price: string;
  why: string;
}) {
  const toneCfg = {
    amber: "border-amber-500/30 bg-amber-500/10",
    slate: "border-sky-500/30 bg-sky-500/10",
    bronze: "border-orange-500/30 bg-orange-500/10",
  }[tone];
  return (
    <div className={`rounded-xl border p-4 ${toneCfg}`}>
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-background/60 font-bold">
          {rank}
        </div>
        {icon}
      </div>
      <div className="font-semibold">{title}</div>
      <div className="mb-2 text-xs text-muted-foreground">{price}</div>
      <p className="text-sm leading-relaxed">{why}</p>
    </div>
  );
}

/* =========================================================================
 * Spec matrix
 * ======================================================================= */

function SpecMatrix() {
  const a = getHardwareById("cluster-4x-mac-mini-m4-16");
  const b = getHardwareById("cluster-2x-mac-mini-m4-pro-24");
  const c = getHardwareById("mac-studio-m2-ultra-64");

  const rows: Array<[string, React.ReactNode, string | number, string | number, string | number]> = [
    ["Node sayısı", <Boxes className="h-4 w-4" />, "4", "2", "1"],
    ["Çip", <Gauge className="h-4 w-4" />, "M4 (base)", "M4 Pro 12/16", "M2 Ultra"],
    [
      "RAM (pool)",
      <MemoryStick className="h-4 w-4" />,
      `${a?.unifiedMemoryGB ?? 64} GB`,
      `${b?.unifiedMemoryGB ?? 48} GB`,
      `${c?.unifiedMemoryGB ?? 64} GB`,
    ],
    [
      "Kullanılabilir bellek (LLM)",
      <MemoryStick className="h-4 w-4" />,
      "~44 GB (TP %75)",
      "~35 GB (TP %85)",
      "~45 GB",
    ],
    [
      "Bellek bant genişliği",
      <Zap className="h-4 w-4" />,
      "120 GB/s (node)",
      "273 GB/s (node)",
      "800 GB/s",
    ],
    [
      "Node↔Node interconnect",
      <Cable className="h-4 w-4" />,
      "TB4 · 40 Gb/s",
      "TB5 · 80 Gb/s",
      "— (dahili)",
    ],
    ["SSD (her node)", <Network className="h-4 w-4" />, "512 GB", "512 GB", "512 GB"],
    ["CPU toplam", <Gauge className="h-4 w-4" />, "40 P+E (4×10)", "24 P+E (2×12)", "24 P+E"],
    ["GPU core toplam", <Gauge className="h-4 w-4" />, "40 (4×10)", "32 (2×16)", "60"],
    [
      "Fiyat (sıfır)",
      <DollarSign className="h-4 w-4" />,
      `${((a?.approxPriceTRY ?? 172000) / 1000).toFixed(0)}K ₺`,
      `${((b?.approxPriceTRY ?? 160000) / 1000).toFixed(0)}K ₺`,
      `${((c?.approxPriceTRY ?? 160000) / 1000).toFixed(0)}K ₺`,
    ],
    ["Idle güç", <Zap className="h-4 w-4" />, "~16 W", "~10 W", "~15 W"],
    ["Load güç", <Zap className="h-4 w-4" />, "~180 W", "~135 W", "~130 W"],
  ];

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-muted/40">
          <tr>
            <th className="p-3 text-left font-semibold">Özellik</th>
            <th className="p-3 text-left font-semibold">
              A · 4× M4 16GB
              <div className="text-xs font-normal text-muted-foreground">TB4 cluster</div>
            </th>
            <th className="p-3 text-left font-semibold">
              B · 2× M4 Pro 24GB
              <div className="text-xs font-normal text-muted-foreground">TB5 cluster</div>
            </th>
            <th className="p-3 text-left font-semibold">
              C · M2 Ultra 64GB
              <div className="text-xs font-normal text-muted-foreground">tek kasa sıfır</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, icon, av, bv, cv], i) => (
            <tr
              key={label}
              className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}
            >
              <td className="flex items-center gap-2 p-3 font-medium text-muted-foreground">
                <span className="text-primary/70">{icon}</span>
                {label}
              </td>
              <td className="p-3">{av}</td>
              <td className="p-3">{bv}</td>
              <td className="p-3 font-semibold text-primary">{cv}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* =========================================================================
 * Interconnect analysis
 * ======================================================================= */

function InterconnectAnalysis() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <TopologyCard
        letter="A"
        tone="amber"
        title="4× M4 · TB4 halka (Exo)"
        topology="Node-0 ↔ Node-1 ↔ Node-2 ↔ Node-3 (ring)"
        bandwidth="40 Gb/s = 5 GB/s per hop"
        latency="~8-12 µs · Exo (day-1)"
        tpEfficiency="%75 (3 hop worst case)"
        bullets={[
          "Pipeline parallel: her layer farklı node'da, activations TB4'ten geçer",
          "70B Q4 forward pass ~3 MB activation × 80 layer → ~240 MB/token",
          "TB4'te 48 ms/token sadece interconnect → net ~2-4 tok/s",
          "Ring topology + master/worker rol, Exo otomatik yönetir",
        ]}
      />
      <TopologyCard
        letter="B"
        tone="sky"
        title="2× M4 Pro · TB5 direkt"
        topology="Node-0 ↔ Node-1 (peer-to-peer)"
        bandwidth="80 Gb/s = 10 GB/s (2× TB4)"
        latency="~5-8 µs · Exo day-2 ölçüm"
        tpEfficiency="%85 (tek hop)"
        bullets={[
          "Tensor parallel split (layer-wise değil, attention head-wise)",
          "Her token ~120 MB transfer · TB5'te 12 ms → net ~8-12 tok/s (32B)",
          "Yalnızca 1 kablo — kurulum basit",
          "Exo GitHub benchmark: 32B Q8 %85 scaling (ideal 2×)",
        ]}
      />
      <TopologyCard
        letter="C"
        tone="emerald"
        title="M2 Ultra · UltraFusion dahili"
        topology="İki M2 Max die + 2.5 TB/s interposer"
        bandwidth="800 GB/s unified (her iki die görür)"
        latency="< 0.1 µs · cache-coherent"
        tpEfficiency="%100 (tek logical SoC)"
        bullets={[
          "Network bypass — bu 'cluster' değil, sadece büyük bir SoC",
          "KV cache paylaşımı dert etmek yok → continuous batching doğal",
          "70B Q4 ~12-15 tok/s · 32B Q4 ~40+ tok/s single request",
          "Apple vDSP + MLX + MPS native — en az sürprizli stack",
        ]}
      />
    </div>
  );
}

function TopologyCard({
  letter,
  tone,
  title,
  topology,
  bandwidth,
  latency,
  tpEfficiency,
  bullets,
}: {
  letter: string;
  tone: "amber" | "sky" | "emerald";
  title: string;
  topology: string;
  bandwidth: string;
  latency: string;
  tpEfficiency: string;
  bullets: string[];
}) {
  const toneCfg = {
    amber: "border-amber-500/30 bg-amber-500/5",
    sky: "border-sky-500/30 bg-sky-500/5",
    emerald: "border-emerald-500/30 bg-emerald-500/5",
  }[tone];
  return (
    <Card className={toneCfg}>
      <CardHeader>
        <div className="mb-2 flex items-center justify-between">
          <Badge variant="outline">Senaryo {letter}</Badge>
          <Cable className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <SpecLine label="Topoloji" value={topology} />
        <SpecLine label="Bant" value={bandwidth} />
        <SpecLine label="Latency" value={latency} />
        <SpecLine label="TP verimi" value={tpEfficiency} />
        <ul className="mt-3 space-y-1.5 border-t pt-3">
          {bullets.map((b) => (
            <li key={b} className="flex gap-2 leading-relaxed">
              <span className="text-primary">·</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function SpecLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-b pb-1 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono text-xs">{value}</span>
    </div>
  );
}

/* =========================================================================
 * Model compatibility
 * ======================================================================= */

function ModelCompatibilityTable() {
  const rows: Array<{
    model: string;
    size: string;
    a: { fit: "full" | "tight" | "no"; note: string };
    b: { fit: "full" | "tight" | "no"; note: string };
    c: { fit: "full" | "tight" | "no"; note: string };
  }> = [
    {
      model: "Llama 3.1 8B Q4",
      size: "~4.5 GB",
      a: { fit: "full", note: "Tek node'da bile sığar · 35 tok/s" },
      b: { fit: "full", note: "Tek node · 65 tok/s" },
      c: { fit: "full", note: "~120 tok/s · concurrent 8×" },
    },
    {
      model: "Qwen 2.5 14B Q5",
      size: "~10 GB",
      a: { fit: "tight", note: "Cluster şart · ~8 tok/s" },
      b: { fit: "full", note: "Tek node 22GB'a rahat · 25 tok/s" },
      c: { fit: "full", note: "~55 tok/s · concurrent 6×" },
    },
    {
      model: "Qwen 2.5 32B Q4",
      size: "~18 GB",
      a: { fit: "tight", note: "Cluster 44GB'ta sığar · ~4 tok/s" },
      b: { fit: "full", note: "TP2 ile · ~8-10 tok/s" },
      c: { fit: "full", note: "~18-22 tok/s · concurrent 4×" },
    },
    {
      model: "Llama 3.3 70B Q4",
      size: "~42 GB",
      a: { fit: "tight", note: "44GB sınırında · ~2-3 tok/s" },
      b: { fit: "no", note: "35GB yetmez · Q3 zorla" },
      c: { fit: "full", note: "~12-15 tok/s · işe yarar hız" },
    },
    {
      model: "Llama 3.3 70B Q8",
      size: "~70 GB",
      a: { fit: "no", note: "Sığmaz" },
      b: { fit: "no", note: "Sığmaz" },
      c: { fit: "no", note: "Sığmaz (64GB → Q8 için 70GB şart)" },
    },
    {
      model: "Mixtral 8×7B Q4 (MoE)",
      size: "~26 GB",
      a: { fit: "tight", note: "MoE routing TB4'te ağır · 5-7 tok/s" },
      b: { fit: "full", note: "~15 tok/s · MoE cluster'a uygun" },
      c: { fit: "full", note: "~35 tok/s · MoE zirvesi" },
    },
    {
      model: "DeepSeek-Coder 33B Q5",
      size: "~24 GB",
      a: { fit: "tight", note: "Çalışır ama TB4 yavaş · 4 tok/s" },
      b: { fit: "full", note: "~10 tok/s" },
      c: { fit: "full", note: "~20 tok/s" },
    },
  ];

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-muted/40">
          <tr>
            <th className="p-3 text-left font-semibold">Model</th>
            <th className="p-3 text-left text-xs font-semibold text-muted-foreground">
              Boyut
            </th>
            <th className="p-3 text-left font-semibold">A · 4× M4 16GB</th>
            <th className="p-3 text-left font-semibold">B · 2× M4 Pro 24GB</th>
            <th className="p-3 text-left font-semibold">C · M2 Ultra 64GB</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.model} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
              <td className="p-3 font-medium">{r.model}</td>
              <td className="p-3 text-xs text-muted-foreground">{r.size}</td>
              <FitCell fit={r.a.fit} note={r.a.note} />
              <FitCell fit={r.b.fit} note={r.b.note} />
              <FitCell fit={r.c.fit} note={r.c.note} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FitCell({
  fit,
  note,
}: {
  fit: "full" | "tight" | "no";
  note: string;
}) {
  const cfg = {
    full: {
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
      label: "Sığar · iyi çalışır",
    },
    tight: {
      icon: <TriangleAlert className="h-4 w-4 text-amber-500" />,
      label: "Sığar · yavaş",
    },
    no: {
      icon: <XCircle className="h-4 w-4 text-rose-500" />,
      label: "Sığmaz",
    },
  }[fit];
  return (
    <td className="p-3">
      <div className="flex items-start gap-2">
        {cfg.icon}
        <div className="min-w-0">
          <div className="text-xs font-medium">{cfg.label}</div>
          <div className="text-xs text-muted-foreground leading-relaxed">
            {note}
          </div>
        </div>
      </div>
    </td>
  );
}

/* =========================================================================
 * Single request performance (TTFT + tok/s)
 * ======================================================================= */

function SingleRequestPerf() {
  const rows: Array<{
    scenario: string;
    ttftA: string;
    tpsA: string;
    ttftB: string;
    tpsB: string;
    ttftC: string;
    tpsC: string;
    winner: "A" | "B" | "C";
  }> = [
    {
      scenario: "8B · 1K prompt · 500 tok generation",
      ttftA: "0.9 s",
      tpsA: "35 t/s",
      ttftB: "0.4 s",
      tpsB: "65 t/s",
      ttftC: "0.15 s",
      tpsC: "120 t/s",
      winner: "C",
    },
    {
      scenario: "14B · 2K prompt · 800 tok",
      ttftA: "2.8 s",
      tpsA: "8 t/s",
      ttftB: "1.2 s",
      tpsB: "25 t/s",
      ttftC: "0.5 s",
      tpsC: "55 t/s",
      winner: "C",
    },
    {
      scenario: "32B Q4 · 4K prompt · 1K tok",
      ttftA: "12 s",
      tpsA: "4 t/s",
      ttftB: "4 s",
      tpsB: "9 t/s",
      ttftC: "1.8 s",
      tpsC: "20 t/s",
      winner: "C",
    },
    {
      scenario: "70B Q4 · 2K prompt · 500 tok",
      ttftA: "24 s",
      tpsA: "2.5 t/s",
      ttftB: "— (sığmaz)",
      tpsB: "—",
      ttftC: "3.5 s",
      tpsC: "13 t/s",
      winner: "C",
    },
  ];

  return (
    <>
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="p-3 text-left font-semibold">Senaryo</th>
              <th className="p-3 text-center font-semibold" colSpan={2}>
                A · 4× M4 16GB
              </th>
              <th className="p-3 text-center font-semibold" colSpan={2}>
                B · 2× M4 Pro 24GB
              </th>
              <th className="p-3 text-center font-semibold" colSpan={2}>
                C · M2 Ultra 64GB
              </th>
              <th className="p-3 text-center font-semibold">🏆</th>
            </tr>
            <tr className="border-t text-xs text-muted-foreground">
              <th></th>
              <th className="p-2 text-center">TTFT</th>
              <th className="p-2 text-center">tok/s</th>
              <th className="p-2 text-center">TTFT</th>
              <th className="p-2 text-center">tok/s</th>
              <th className="p-2 text-center">TTFT</th>
              <th className="p-2 text-center">tok/s</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.scenario}
                className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}
              >
                <td className="p-3 font-medium">{r.scenario}</td>
                <td className="p-2 text-center font-mono text-xs">{r.ttftA}</td>
                <td className="p-2 text-center font-mono text-xs">{r.tpsA}</td>
                <td className="p-2 text-center font-mono text-xs">{r.ttftB}</td>
                <td className="p-2 text-center font-mono text-xs">{r.tpsB}</td>
                <td className="p-2 text-center font-mono text-xs font-semibold text-primary">
                  {r.ttftC}
                </td>
                <td className="p-2 text-center font-mono text-xs font-semibold text-primary">
                  {r.tpsC}
                </td>
                <td className="p-2 text-center">
                  <Badge variant="outline">{r.winner}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <MarkdownNote tone="info" title="Okuma rehberi">
        {`**TTFT** (Time to First Token) = prompt processing süresi.
**tok/s** = generation hızı (kullanıcının ekranda gördüğü).
Apple Silicon'da TTFT **compute-bound** (bant genişliği burada iş görmez),
generation ise **memory-bound**. M2 Ultra iki eksende de lider çünkü
(a) 2× GPU die, (b) 800 GB/s bant.`}
      </MarkdownNote>
    </>
  );
}

/* =========================================================================
 * Concurrent performance (continuous batching)
 * ======================================================================= */

function ConcurrentRequestPerf() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <ConcurrencyCard
        letter="A"
        tone="amber"
        title="4× M4 16GB TB4 cluster"
        singleThreadTps="32B Q4 · 4 tok/s"
        concurrentBehavior="Pipeline-parallel: tek seferde ~2 isteği zorla paralelleştirir. Layer-wise split nedeniyle KV cache node'lar arasında bölünür — batching matematiksel olarak devre dışı."
        effectiveCapacity="1-2 concurrent · 4-5 tok/s total"
        verdict="Batch processing'e uygun değil"
        verdictTone="bad"
      />
      <ConcurrencyCard
        letter="B"
        tone="sky"
        title="2× M4 Pro 24GB TB5 cluster"
        singleThreadTps="14B · 25 tok/s"
        concurrentBehavior="TP2 ile 2-3 istek continuous batch'e girebilir. MLX-LM/vLLM-macos henüz stabilize olmadı — Ollama parallel_requests ile pratik."
        effectiveCapacity="3-5 concurrent · 40-50 tok/s total (14B)"
        verdict="Hafif API için uygun"
        verdictTone="ok"
      />
      <ConcurrencyCard
        letter="C"
        tone="emerald"
        title="M2 Ultra 64GB"
        singleThreadTps="14B · 55 tok/s · 70B · 13 tok/s"
        concurrentBehavior="Tek SoC + 800 GB/s + KV cache coherent → vLLM-mlx ve Ollama-parallel en verimli burada. Continuous batching % verimlilik %85-90."
        effectiveCapacity="8-15 concurrent · 180+ tok/s total (14B)"
        verdict="Gerçek API servisi için sweet spot"
        verdictTone="good"
      />
    </div>
  );
}

function ConcurrencyCard({
  letter,
  tone,
  title,
  singleThreadTps,
  concurrentBehavior,
  effectiveCapacity,
  verdict,
  verdictTone,
}: {
  letter: string;
  tone: "amber" | "sky" | "emerald";
  title: string;
  singleThreadTps: string;
  concurrentBehavior: string;
  effectiveCapacity: string;
  verdict: string;
  verdictTone: "good" | "ok" | "bad";
}) {
  const toneCfg = {
    amber: "border-amber-500/30 bg-amber-500/5",
    sky: "border-sky-500/30 bg-sky-500/5",
    emerald: "border-emerald-500/30 bg-emerald-500/5",
  }[tone];
  const verdictCfg = {
    good: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    ok: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    bad: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
  }[verdictTone];
  return (
    <Card className={toneCfg}>
      <CardHeader>
        <Badge variant="outline" className="w-fit">
          Senaryo {letter}
        </Badge>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <div className="text-xs text-muted-foreground">Tek istek</div>
          <div className="font-mono text-xs">{singleThreadTps}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Concurrent davranışı</div>
          <p className="text-sm leading-relaxed">{concurrentBehavior}</p>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Pratik kapasite</div>
          <div className="font-mono text-sm font-semibold">{effectiveCapacity}</div>
        </div>
        <div className={`rounded-lg px-3 py-2 text-xs font-semibold ${verdictCfg}`}>
          {verdict}
        </div>
      </CardContent>
    </Card>
  );
}

/* =========================================================================
 * Daily token capacity
 * ======================================================================= */

function DailyTokenCapacity() {
  const rows: Array<{
    model: string;
    a: string;
    b: string;
    c: string;
  }> = [
    {
      model: "14B Q5 (typical chat)",
      a: "~1.0 M tok",
      b: "~3.5 M tok",
      c: "~9.5 M tok",
    },
    {
      model: "32B Q4 (code/agent)",
      a: "~0.3 M tok",
      b: "~1.2 M tok",
      c: "~4.0 M tok",
    },
    {
      model: "70B Q4 (reasoning)",
      a: "~0.2 M tok",
      b: "—",
      c: "~2.0 M tok",
    },
  ];
  return (
    <div className="space-y-4">
      <MarkdownNote tone="info">
        {`Varsayım: 8 saat/gün aktif, ortalama %70 doluluk, 14B için eş zamanlı 3-8 istek,
32B için 2-5, 70B için 1-3. TTFT ağırlıklı değil — generation throughput'u çarpımla.`}
      </MarkdownNote>
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="p-3 text-left font-semibold">Model / kullanım</th>
              <th className="p-3 text-right font-semibold">A · 4× M4 16GB</th>
              <th className="p-3 text-right font-semibold">B · 2× M4 Pro 24GB</th>
              <th className="p-3 text-right font-semibold">C · M2 Ultra 64GB</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.model}
                className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}
              >
                <td className="p-3 font-medium">{r.model}</td>
                <td className="p-3 text-right font-mono text-xs">{r.a}</td>
                <td className="p-3 text-right font-mono text-xs">{r.b}</td>
                <td className="p-3 text-right font-mono text-xs font-semibold text-primary">
                  {r.c}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <MarkdownNote tone="insight" title="Cloud API ile kıyas">
        {`M2 Ultra'nın günlük **9.5 M token · 14B** kapasitesi cloud'da
GPT-4o Mini'de ~**$1.50/gün** = ~67 ₺/gün · **aylık ~2.000 ₺**. 36 ay TCO:
**72K ₺**. Yerelde 160K donanım + elektrik, break-even ~18-24 ay. Üstelik
API'de rate limit yok, veri yerel.`}
      </MarkdownNote>
    </div>
  );
}

/* =========================================================================
 * Ecosystem matrix
 * ======================================================================= */

function EcosystemMatrix() {
  const rows: Array<{
    feature: string;
    a: "full" | "partial" | "no";
    b: "full" | "partial" | "no";
    c: "full" | "partial" | "no";
    note?: string;
  }> = [
    { feature: "Ollama (inference)", a: "full", b: "full", c: "full" },
    { feature: "llama.cpp", a: "full", b: "full", c: "full" },
    { feature: "MLX-LM", a: "full", b: "full", c: "full" },
    { feature: "vLLM (CUDA gerekir)", a: "no", b: "no", c: "no" },
    { feature: "vllm-mlx (deneysel)", a: "partial", b: "partial", c: "partial" },
    { feature: "Continuous batching", a: "no", b: "partial", c: "full" },
    { feature: "Exo distributed", a: "full", b: "full", c: "no", note: "Tek kasa — gerek yok" },
    {
      feature: "LoRA fine-tune (MLX)",
      a: "partial",
      b: "full",
      c: "full",
      note: "A'da RAM yetmez",
    },
    { feature: "QLoRA 4-bit", a: "no", b: "no", c: "no", note: "Apple'da bitsandbytes yok" },
    { feature: "Flash Attention 2", a: "no", b: "no", c: "no" },
    { feature: "Hugging Face TGI", a: "no", b: "no", c: "no" },
    { feature: "OpenAI-compatible API", a: "full", b: "full", c: "full" },
  ];

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-muted/40">
          <tr>
            <th className="p-3 text-left font-semibold">Özellik</th>
            <th className="p-2 text-center font-semibold">A</th>
            <th className="p-2 text-center font-semibold">B</th>
            <th className="p-2 text-center font-semibold">C</th>
            <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Not</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.feature} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
              <td className="p-3 font-medium">{r.feature}</td>
              <EcoCell fit={r.a} />
              <EcoCell fit={r.b} />
              <EcoCell fit={r.c} />
              <td className="p-3 text-xs text-muted-foreground">{r.note ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EcoCell({ fit }: { fit: "full" | "partial" | "no" }) {
  const cfg = {
    full: <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" />,
    partial: <TriangleAlert className="mx-auto h-4 w-4 text-amber-500" />,
    no: <XCircle className="mx-auto h-4 w-4 text-rose-500" />,
  }[fit];
  return <td className="p-2 text-center">{cfg}</td>;
}

/* =========================================================================
 * TCO analysis
 * ======================================================================= */

function TcoAnalysis() {
  const rows: Array<{
    label: string;
    a: string;
    b: string;
    c: string;
  }> = [
    { label: "Donanım (sıfır)", a: "172.000 ₺", b: "160.000 ₺", c: "160.000 ₺" },
    { label: "Aksesuar (TB kablo/switch)", a: "~4.000 ₺", b: "~1.500 ₺", c: "0 ₺" },
    {
      label: "Elektrik · 8h/gün · 36 ay",
      a: "~14.000 ₺",
      b: "~10.500 ₺",
      c: "~10.000 ₺",
    },
    {
      label: "Bakım / yedek parça riski",
      a: "Orta (4 kasa)",
      b: "Düşük",
      c: "Çok düşük",
    },
    {
      label: "Apple Trade-In 36. ay (tahmini)",
      a: "~68.000 ₺ (4×17K)",
      b: "~64.000 ₺",
      c: "~72.000 ₺",
    },
    {
      label: "**Net 36 ay TCO**",
      a: "**~122.000 ₺**",
      b: "**~108.000 ₺**",
      c: "**~98.000 ₺**",
    },
  ];
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="p-3 text-left font-semibold">Kalem</th>
              <th className="p-3 text-right font-semibold">A</th>
              <th className="p-3 text-right font-semibold">B</th>
              <th className="p-3 text-right font-semibold">C</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.label}
                className={
                  r.label.includes("Net")
                    ? "bg-primary/5 font-semibold"
                    : i % 2 === 0
                    ? "bg-background"
                    : "bg-muted/20"
                }
              >
                <td className="p-3" dangerouslySetInnerHTML={{ __html: r.label.replace(/\*\*(.+)\*\*/g, "<b>$1</b>") }} />
                <td
                  className="p-3 text-right font-mono text-xs"
                  dangerouslySetInnerHTML={{ __html: r.a.replace(/\*\*(.+)\*\*/g, "<b>$1</b>") }}
                />
                <td
                  className="p-3 text-right font-mono text-xs"
                  dangerouslySetInnerHTML={{ __html: r.b.replace(/\*\*(.+)\*\*/g, "<b>$1</b>") }}
                />
                <td
                  className="p-3 text-right font-mono text-xs"
                  dangerouslySetInnerHTML={{ __html: r.c.replace(/\*\*(.+)\*\*/g, "<b>$1</b>") }}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <MarkdownNote tone="info">
        {`36 ay sonunda **C (M2 Ultra) en ucuz TCO** (~98K ₺). Üretkenliğin
zirvesinde daha hızlı + daha az fiziksel yönetim.`}
      </MarkdownNote>
    </div>
  );
}

/* =========================================================================
 * Score matrix
 * ======================================================================= */

function ScoreMatrix() {
  const scores: Array<{
    axis: string;
    weight: number;
    a: number;
    b: number;
    c: number;
  }> = [
    { axis: "Tek istek hızı", weight: 0.15, a: 4, b: 7, c: 10 },
    { axis: "Concurrent (API)", weight: 0.2, a: 3, b: 6, c: 10 },
    { axis: "Büyük model desteği (70B)", weight: 0.15, a: 5, b: 2, c: 9 },
    { axis: "Ekosistem olgunluk", weight: 0.1, a: 6, b: 8, c: 9 },
    { axis: "Fiyat/performans", weight: 0.1, a: 6, b: 7, c: 9 },
    { axis: "Kurulum kolaylığı", weight: 0.1, a: 4, b: 7, c: 10 },
    { axis: "Esneklik / upgrade", weight: 0.05, a: 8, b: 7, c: 4 },
    { axis: "Livability (ses, ısı, güç)", weight: 0.1, a: 7, b: 9, c: 9 },
    { axis: "Öğrenme değeri", weight: 0.05, a: 10, b: 7, c: 5 },
  ];

  const totalA = scores.reduce((s, r) => s + r.a * r.weight, 0).toFixed(2);
  const totalB = scores.reduce((s, r) => s + r.b * r.weight, 0).toFixed(2);
  const totalC = scores.reduce((s, r) => s + r.c * r.weight, 0).toFixed(2);

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-muted/40">
          <tr>
            <th className="p-3 text-left font-semibold">Eksen</th>
            <th className="p-3 text-center text-xs font-semibold text-muted-foreground">
              Ağırlık
            </th>
            <th className="p-3 text-center font-semibold">A</th>
            <th className="p-3 text-center font-semibold">B</th>
            <th className="p-3 text-center font-semibold">C</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((r, i) => (
            <tr key={r.axis} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
              <td className="p-3 font-medium">{r.axis}</td>
              <td className="p-2 text-center font-mono text-xs text-muted-foreground">
                {(r.weight * 100).toFixed(0)}%
              </td>
              <ScoreCell value={r.a} />
              <ScoreCell value={r.b} />
              <ScoreCell value={r.c} />
            </tr>
          ))}
          <tr className="border-t-2 bg-primary/5 font-semibold">
            <td className="p-3">Ağırlıklı toplam (10 üzerinden)</td>
            <td></td>
            <td className="p-3 text-center font-mono text-sm">{totalA}</td>
            <td className="p-3 text-center font-mono text-sm">{totalB}</td>
            <td className="p-3 text-center font-mono text-sm text-primary">
              {totalC} 🏆
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function ScoreCell({ value }: { value: number }) {
  const pct = (value / 10) * 100;
  const color =
    value >= 8 ? "bg-emerald-500" : value >= 6 ? "bg-amber-500" : "bg-rose-500";
  return (
    <td className="p-2 text-center">
      <div className="mx-auto flex w-16 flex-col items-center gap-1">
        <span className="font-mono text-xs font-semibold">{value}</span>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </td>
  );
}

/* =========================================================================
 * Hidden pitfalls
 * ======================================================================= */

function HiddenPitfalls() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <PitfallCard
        letter="A"
        tone="amber"
        title="4× M4 16GB — kataloğun söylemedikleri"
        items={[
          "Exo henüz production-ready değil — kırık güncellemeler, GitHub'da yama yapıyorsun",
          "16GB minilerin SSD'si tek NAND chip (256GB'da kesin, 512GB'da yaygın) → swap'e girerse 2× yavaşlama",
          "4 ayrı macOS update + 4 ayrı apple ID/session → yönetim maliyeti",
          "Exo master node çökerse 40GB pool gider, process restart uzun",
          "4 node = 4 fan = en sessiz senaryoda bile en gürültüsü",
        ]}
      />
      <PitfallCard
        letter="B"
        tone="sky"
        title="2× M4 Pro 24GB — kataloğun söylemedikleri"
        items={[
          "TB5 kablo kalitesi kritik (ucuz kablo 40Gb'de çalışır, 80Gb'de çakılır)",
          "Thunderbolt Share/IP ayarları Apple ID'ler farklıysa kırılır",
          "2 node en güzel şey: biri bozulsa diğeri bağımsız server olur",
          "70B modeller asla sığmaz — 160K ₺ bütçeyle 70B isteyen C seçmeli",
          "MLX distributed son 6 ayda stabilleşti, hâlâ bazı fine-tune recipe'leri kırık",
        ]}
      />
      <PitfallCard
        letter="C"
        tone="emerald"
        title="M2 Ultra 64GB — kataloğun söylemedikleri"
        items={[
          "Apple M2 Ultra Mac Studio'yu üretimden kaldırabilir (M3/M4 Ultra sonrası) → parça ömrü bakımı önemli",
          "Sıfır satın almak istersen stok sınırlı — 512GB baseline bulmak BTO gerekmeden zor",
          "64GB sabit, upgrade yok — 2-3 yıl sonra 128GB isteyince tamamını değiştirirsin",
          "AppleCare+ uzun vadede kritik (anakart arızası = yeni makine)",
          "Tek elektrik arızası = tüm servis gider (redundancy cluster'da daha iyi)",
        ]}
      />
    </div>
  );
}

function PitfallCard({
  letter,
  tone,
  title,
  items,
}: {
  letter: string;
  tone: "amber" | "sky" | "emerald";
  title: string;
  items: string[];
}) {
  const toneCfg = {
    amber: "border-amber-500/30 bg-amber-500/5",
    sky: "border-sky-500/30 bg-sky-500/5",
    emerald: "border-emerald-500/30 bg-emerald-500/5",
  }[tone];
  return (
    <Card className={toneCfg}>
      <CardHeader>
        <Badge variant="outline" className="w-fit">
          Senaryo {letter}
        </Badge>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {items.map((x) => (
            <li key={x} className="flex gap-2 leading-relaxed">
              <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
              <span>{x}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

/* =========================================================================
 * Decision tree
 * ======================================================================= */

function DecisionTree() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <DecisionRow
        q="Birincil hedef: API olarak paralel kullanıcılara LLM servisi mi?"
        answer="C · M2 Ultra 64GB"
        reason="Continuous batching + 800 GB/s + tek kasa yönetim. Concurrent 8-15 rahat."
      />
      <DecisionRow
        q="70B Q4 düzenli çalıştırmak istiyor musun?"
        answer="C · M2 Ultra 64GB"
        reason="45GB usable + 13 tok/s. A (44GB) sığar ama 2.5 tok/s kullanım dışı."
      />
      <DecisionRow
        q="2-3 yıl içinde RAM'i 128GB'a çıkarma yol haritası istiyor musun?"
        answer="B · 2× M4 Pro 24GB (sonra 2× daha)"
        reason="Incremental satın alma + TB5 cluster büyütülebilir. C'de upgrade yok."
      />
      <DecisionRow
        q="Exo/distributed inference öğrenmek birincil motivasyonun mu?"
        answer="A · 4× M4 16GB"
        reason="4 node en zengin topoloji deneyimi. Ayrıca tek tek satılabilir."
      />
      <DecisionRow
        q="Fine-tuning (LoRA, MLX) çoğunluk işin mi?"
        answer="C > B > A"
        reason="MLX fine-tune single machine'de kurulur. RAM ne kadar büyükse batch o kadar büyük."
      />
      <DecisionRow
        q="Tek başına web app + ajanla agent'lar çalıştıracak mısın?"
        answer="C veya B"
        reason="14B-32B aralığında yaşıyorsun. C konfor, B bütçe optimum."
      />
    </div>
  );
}

function DecisionRow({
  q,
  answer,
  reason,
}: {
  q: string;
  answer: string;
  reason: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Soru
        </div>
        <p className="mb-3 font-medium">{q}</p>
        <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">
          → Cevap
        </div>
        <p className="mb-2 font-semibold">{answer}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{reason}</p>
      </CardContent>
    </Card>
  );
}

/* =========================================================================
 * Final note
 * ======================================================================= */

function FinalNote() {
  const m2Ultra = getHardwareById("mac-studio-m2-ultra-64");
  const clusterB = getHardwareById("cluster-2x-mac-mini-m4-pro-24");
  const clusterA = getHardwareById("cluster-4x-mac-mini-m4-16");

  return (
    <div className="mt-10 space-y-4">
      <MarkdownNote tone="insight" title="Tek cümlelik hüküm">
        {`**API servisi amacıyla 160K ₺ bütçen varsa: Mac Studio M2 Ultra 64GB sıfır.**
Kullanılabilir 45GB bellek, 800 GB/s bant, continuous batching, tek kasa garanti.
Cluster deneyimi + esneklik birincil motivasyonsa 2× M4 Pro 24GB alternatif —
yine 160K, ama concurrent'ta ½, big model'da yetersiz.`}
      </MarkdownNote>
      <div className="rounded-xl border bg-muted/30 p-4 text-sm">
        <div className="mb-2 font-semibold">Ürün bağlantıları</div>
        <ul className="grid gap-1.5 sm:grid-cols-3">
          <li>
            A ·{" "}
            <ProductLink
              name="4× Mac mini M4 16GB/512GB"
              url={clusterA?.url}
            />
          </li>
          <li>
            B ·{" "}
            <ProductLink
              name="2× Mac mini M4 Pro 24GB/512GB"
              url={clusterB?.url}
            />
          </li>
          <li>
            C ·{" "}
            <ProductLink
              name="Mac Studio M2 Ultra 64GB/512GB"
              url={m2Ultra?.url}
            />
          </li>
        </ul>
      </div>
    </div>
  );
}
