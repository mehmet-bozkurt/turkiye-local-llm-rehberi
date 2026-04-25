import { Section } from "./Section";
import { SectionHeader } from "../SectionHeader";
import { MarkdownNote } from "../MarkdownNote";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Cpu,
  Brain,
  Layers,
  Gauge,
  CheckCircle2,
  XCircle,
  TriangleAlert,
  TrendingDown,
  Boxes,
  Crown,
  Trophy,
  Flame,
} from "lucide-react";

/**
 * 13 · Model Evreni 2026-Q2
 *
 * Amaç: 2025 ortasından 2026-Q2'ye kadar olan model piyasasının fotoğrafını
 * çekmek. Üç sorunun cevabı:
 *   1. Frontier kapalı (Claude 4.6 / Gemini 3.1 Pro / GPT-5.4) vs açık ağırlık?
 *   2. "2026-32B > 2025-70B" tezi doğru mu? Hangi eksende?
 *   3. Benim 64GB M2 Ultra'ma ne sığar, hangisini yüklemeliyim?
 *
 * Veri: 2026-Q2 community benchmark'ları (MMLU-Pro, GPQA-Diamond, LiveCodeBench,
 * SWE-bench Verified), resmi model kartları, /r/LocalLLaMA weekly threads.
 * Hatırlatma: benchmark'lar tek başına karar değil — prompt eval hızı + tool-use
 * + context fidelity pratikte daha belirleyici.
 */
export function ModelEvreni() {
  return (
    <Section id="model-evreni">
      <SectionHeader
        eyebrow="13 · Model Evreni 2026-Q2"
        title="Günümüz LLM haritası — kapalı frontier, açık ağırlık devrimi ve küçülen parametre eğrisi"
        description="2026 ortasına geldiğimizde piyasa üç cepheye ayrılmış durumda: frontier-closed (Claude 4.6 / Gemini 3.1 Pro / GPT-5.4), açık-frontier (DeepSeek R1, Llama 4 Scout, Qwen 3.6) ve efficiency-focused küçük modeller. Lokal çalıştırmak isteyen biri için en önemli gelişme: 2026 32B'leri 2025 70B'leri çoğu eksende yenmeye başladı."
      />

      <VerdictCard />

      <SectionHeader
        className="mt-14"
        eyebrow="Frontier vs Açık Ağırlık"
        title="En tepe kim? Fark kapanıyor mu?"
        description="Kapalı frontier'ın avantajı hâlâ var ama marj daraldı. Açık modeller 2025'e göre 2 nesil atladı."
      />
      <FrontierVsOpenGrid />

      <SectionHeader
        className="mt-14"
        eyebrow="Parametre efficiency eğrisi"
        title="'2026-32B > 2025-70B' tezi doğru mu?"
        description="Kısa cevap: evet, birçok eksende. Uzun cevap: nerede, hangi saat, hangi benchmark'ta?"
      />
      <ParameterEfficiency />

      <SectionHeader
        className="mt-14"
        eyebrow="Açık ağırlık şampiyonları"
        title="Lokal çalıştırılabilir en iddialı 6 model"
      />
      <OpenModelCatalog />

      <SectionHeader
        className="mt-14"
        eyebrow="Benchmark matrisi"
        title="Aynı test, beş model — 2026-Q2 skorları"
        description="MMLU-Pro (genel bilgi, reasoning), GPQA-Diamond (uzman PhD soruları), LiveCodeBench (competitive programming), SWE-bench Verified (real-world repo fixing)."
      />
      <BenchmarkMatrix />

      <SectionHeader
        className="mt-14"
        eyebrow="MoE vs Dense"
        title="Llama 4 Scout (109B MoE) vs Qwen 3.6 (27B dense) — hangisi pratikte kazanır?"
      />
      <MoEvsDense />

      <SectionHeader
        className="mt-14"
        eyebrow="Reasoning modeller"
        title="DeepSeek R1-0528 — 'düşünen' modelin pratik değeri"
      />
      <ReasoningModels />

      <SectionHeader
        className="mt-14"
        eyebrow="M2 Ultra 64GB için"
        title="Senin donanımına somut tavsiye"
      />
      <M2UltraRecommendation />

      <SectionHeader
        className="mt-14"
        eyebrow="Sonraki 6 ay"
        title="2026-Q3/Q4'te beklenen hamleler"
      />
      <RoadmapNote />
    </Section>
  );
}

/* =========================================================================
 * Verdict card
 * ======================================================================= */

function VerdictCard() {
  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
          <Sparkles className="h-4 w-4" />
          TL;DR · 2026-Q2 özet
        </div>
        <h3 className="mb-4 text-2xl font-bold tracking-tight">
          Frontier kapalı modeller hâlâ ince marjla önde, ama{" "}
          <span className="text-primary">açık ağırlık dünyası 2025'e göre 2 nesil atladı</span>.
          32B dense modeller 70B'leri yemeye başladı, MoE mimarisi normalleşti,
          reasoning (R1 tarzı) <em>standart</em> hâline geliyor.
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <VerdictCol
            icon={<Crown className="h-5 w-5" />}
            tone="amber"
            title="Frontier kapalı"
            models="Claude Opus 4.6 · Gemini 3.1 Pro · GPT-5.4"
            takeaway="Hâlâ tepede — özellikle agentic tool-use, multimodal, long-context'te. Marj ~%8-12'ye indi."
          />
          <VerdictCol
            icon={<Trophy className="h-5 w-5" />}
            tone="sky"
            title="Açık frontier"
            models="DeepSeek R1-0528 · Llama 4 Scout · Qwen 3.6 27B"
            takeaway="En iyi frontier'a %90 yaklaştı. Lokal çalıştırma + fine-tune + private data için pratikte en değerlisi."
          />
          <VerdictCol
            icon={<TrendingDown className="h-5 w-5" />}
            tone="emerald"
            title="Efficiency patlaması"
            models="Qwen 3.6 27B · Phi-5 · Mistral Small 3.1"
            takeaway="27B dense, 2025'in 70B'sini MMLU-Pro ve SWE-bench'te yeniyor. 32-64GB makineye altın çağ."
          />
        </div>
      </CardContent>
    </Card>
  );
}

function VerdictCol({
  icon,
  tone,
  title,
  models,
  takeaway,
}: {
  icon: React.ReactNode;
  tone: "amber" | "sky" | "emerald";
  title: string;
  models: string;
  takeaway: string;
}) {
  const toneCfg = {
    amber: "border-amber-500/30 bg-amber-500/10",
    sky: "border-sky-500/30 bg-sky-500/10",
    emerald: "border-emerald-500/30 bg-emerald-500/10",
  }[tone];
  return (
    <div className={`rounded-xl border p-4 ${toneCfg}`}>
      <div className="mb-2 flex items-center gap-2">{icon}</div>
      <div className="font-semibold">{title}</div>
      <div className="mb-2 text-xs text-muted-foreground">{models}</div>
      <p className="text-sm leading-relaxed">{takeaway}</p>
    </div>
  );
}

/* =========================================================================
 * Frontier vs Open grid
 * ======================================================================= */

function FrontierVsOpenGrid() {
  const frontier: FrontierRow[] = [
    {
      name: "Claude Opus 4.6",
      lab: "Anthropic",
      strengths: "Long-context coding (1M), tool-use, agentic workflows, en kararlı stil",
      weakness: "API-only, pahalı (~3× GPT-5.4 input), rate limits",
      mmluPro: "88.2",
      swebench: "69.1",
      tone: "amber",
    },
    {
      name: "Gemini 3.1 Pro",
      lab: "Google",
      strengths: "2M context, multimodal (video/ses), en ucuz frontier API",
      weakness: "Kod üretiminde Claude gerisi, safety filters çok agresif",
      mmluPro: "86.8",
      swebench: "62.4",
      tone: "sky",
    },
    {
      name: "GPT-5.4",
      lab: "OpenAI",
      strengths: "Dengeli generalist, o1/o3 reasoning entegre, ekosistem en geniş",
      weakness: "Coding'de Claude'dan geride, stil sterilleşti",
      mmluPro: "87.1",
      swebench: "65.8",
      tone: "emerald",
    },
  ];

  const open: OpenRow[] = [
    {
      name: "DeepSeek R1-0528",
      lab: "DeepSeek",
      size: "671B MoE · 37B active",
      strengths: "Reasoning şampiyonu (R1-style thinking), attack-chain analysis rakipsiz, API en ucuz frontier (~$0.55/1M)",
      weakness: "Lokalde ancak 4-bit quantize ile 1 TB+ RAM'e sığar, pratikte API",
      mmluPro: "87.1",
      swebench: "61.4",
    },
    {
      name: "Llama 4 Scout",
      lab: "Meta",
      size: "109B MoE · 17B active",
      strengths: "10M context (piyasa lideri), repo-wide analiz, Apache-style lisans",
      weakness: "Reasoning'de R1'in gerisinde, MoE routing overhead",
      mmluPro: "82.4",
      swebench: "54.7",
    },
    {
      name: "Qwen 3.6 27B",
      lab: "Alibaba",
      size: "27B dense",
      strengths: "Agentic coding'de 397B MoE'leri yeniyor, Apache 2.0, 64GB RAM'e rahat sığar",
      weakness: "Multimodal yok (ayrı Qwen-VL), dense olduğu için inference VRAM-heavy",
      mmluPro: "81.8",
      swebench: "58.3",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Crown className="h-4 w-4 text-amber-500" />
          Frontier kapalı · API-only
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {frontier.map((m) => (
            <FrontierCard key={m.name} {...m} />
          ))}
        </div>
      </div>
      <div>
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Trophy className="h-4 w-4 text-sky-500" />
          Açık frontier · weights indirilebilir
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {open.map((m) => (
            <OpenCard key={m.name} {...m} />
          ))}
        </div>
      </div>
      <MarkdownNote tone="insight" title="2026-Q2 gerçekliği">
        {`Kapalı frontier hâlâ önde **ama marj ~%8-12**. 2024'te aynı fark ~%30'du.
Açık ağırlık modeller (R1, Llama 4 Scout, Qwen 3.6) pratikte **senin veriyi
bulut'a göndermeden** çoğu görevi halledebilir hâle geldi. Bu, özel veri ile
çalışan herkes için oyun değiştirici.`}
      </MarkdownNote>
    </div>
  );
}

interface FrontierRow {
  name: string;
  lab: string;
  strengths: string;
  weakness: string;
  mmluPro: string;
  swebench: string;
  tone: "amber" | "sky" | "emerald";
}

function FrontierCard({ name, lab, strengths, weakness, mmluPro, swebench, tone }: FrontierRow) {
  const toneCfg = {
    amber: "border-amber-500/30",
    sky: "border-sky-500/30",
    emerald: "border-emerald-500/30",
  }[tone];
  return (
    <Card className={`card-hover ${toneCfg}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {lab}
          </Badge>
          <Crown className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <BenchmarkBadges mmluPro={mmluPro} swebench={swebench} />
        <div>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-emerald-500">
            Güçlü
          </div>
          <p className="text-sm leading-relaxed">{strengths}</p>
        </div>
        <div>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-rose-500">
            Zayıf
          </div>
          <p className="text-sm leading-relaxed">{weakness}</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface OpenRow {
  name: string;
  lab: string;
  size: string;
  strengths: string;
  weakness: string;
  mmluPro: string;
  swebench: string;
}

function OpenCard({ name, lab, size, strengths, weakness, mmluPro, swebench }: OpenRow) {
  return (
    <Card className="card-hover border-sky-500/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {lab}
          </Badge>
          <Boxes className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardTitle className="text-lg">{name}</CardTitle>
        <div className="text-xs text-muted-foreground">{size}</div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <BenchmarkBadges mmluPro={mmluPro} swebench={swebench} />
        <div>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-emerald-500">
            Güçlü
          </div>
          <p className="text-sm leading-relaxed">{strengths}</p>
        </div>
        <div>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-rose-500">
            Zayıf
          </div>
          <p className="text-sm leading-relaxed">{weakness}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function BenchmarkBadges({ mmluPro, swebench }: { mmluPro: string; swebench: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="muted" className="text-xs">
        MMLU-Pro · {mmluPro}
      </Badge>
      <Badge variant="muted" className="text-xs">
        SWE-bench V · {swebench}
      </Badge>
    </div>
  );
}

/* =========================================================================
 * Parameter efficiency
 * ======================================================================= */

function ParameterEfficiency() {
  const rows: Array<{
    era: string;
    model: string;
    params: string;
    mmlu: string;
    swe: string;
    vram4bit: string;
    tone: "slate" | "amber" | "emerald";
  }> = [
    {
      era: "2025-Q2",
      model: "Llama 3.1 70B Instruct",
      params: "70B dense",
      mmlu: "71.2",
      swe: "28.1",
      vram4bit: "~42 GB",
      tone: "slate",
    },
    {
      era: "2025-Q3",
      model: "Qwen 2.5 72B Instruct",
      params: "72B dense",
      mmlu: "74.8",
      swe: "35.6",
      vram4bit: "~44 GB",
      tone: "slate",
    },
    {
      era: "2026-Q1",
      model: "Qwen 3 32B",
      params: "32B dense",
      mmlu: "77.4",
      swe: "42.8",
      vram4bit: "~20 GB",
      tone: "amber",
    },
    {
      era: "2026-Q2",
      model: "Qwen 3.6 27B",
      params: "27B dense",
      mmlu: "81.8",
      swe: "58.3",
      vram4bit: "~17 GB",
      tone: "emerald",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="p-3 text-left font-semibold">Dönem</th>
              <th className="p-3 text-left font-semibold">Model</th>
              <th className="p-3 text-left font-semibold">Parametre</th>
              <th className="p-3 text-left font-semibold">MMLU-Pro</th>
              <th className="p-3 text-left font-semibold">SWE-bench V</th>
              <th className="p-3 text-left font-semibold">VRAM (Q4_K_M)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const toneCfg = {
                slate: "",
                amber: "bg-amber-500/5",
                emerald: "bg-emerald-500/10 font-semibold",
              }[r.tone];
              return (
                <tr
                  key={r.model}
                  className={`${toneCfg} ${i % 2 === 0 && r.tone === "slate" ? "bg-muted/20" : ""}`}
                >
                  <td className="p-3 text-muted-foreground">{r.era}</td>
                  <td className="p-3">{r.model}</td>
                  <td className="p-3">{r.params}</td>
                  <td className="p-3">{r.mmlu}</td>
                  <td className="p-3">{r.swe}</td>
                  <td className="p-3">{r.vram4bit}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <MarkdownNote tone="insight" title="Gözlem: 1 yılda 2.4x parametre verimi">
        {`**2025-Q2 → 2026-Q2**: MMLU-Pro skorunu 71.2'den 81.8'e çıkarırken
parametre sayısı 70B → 27B'ye düştü. Aynı skor için **%38 parametre**, **%40
VRAM**. 2025 yazında 42GB VRAM isteyen bir görev şimdi 17GB'a sığıyor.
- **Nedenleri**: daha iyi training data curation, synthetic reasoning traces,
DPO/KTO yerine GRPO, MoE routing insights dense'e geri yansıdı.
- **Pratik sonuç**: 64GB M2 Ultra'n 2025 kriterlerinde "70B zorlanır" kasasıydı,
2026-Q2'de **birden fazla modeli aynı anda** tutabilen rahat bir kasa.`}
      </MarkdownNote>
    </div>
  );
}

/* =========================================================================
 * Open model catalog
 * ======================================================================= */

function OpenModelCatalog() {
  const models: OpenCatalogRow[] = [
    {
      name: "Qwen 3.6 27B",
      license: "Apache 2.0",
      size: "27B dense",
      vram4bit: "17 GB",
      vram8bit: "28 GB",
      specialty: "Agentic coding + tool-use şampiyonu",
      fitsM2Ultra: true,
    },
    {
      name: "DeepSeek R1-0528",
      license: "MIT",
      size: "671B MoE (37B active)",
      vram4bit: "~380 GB",
      vram8bit: "~700 GB",
      specialty: "Reasoning + exploit chain analizi",
      fitsM2Ultra: false,
    },
    {
      name: "DeepSeek R1-Distill-Qwen 32B",
      license: "MIT",
      size: "32B dense",
      vram4bit: "20 GB",
      vram8bit: "34 GB",
      specialty: "R1 reasoning'i 32B'e distile edilmiş — lokalde R1 tadı",
      fitsM2Ultra: true,
    },
    {
      name: "Llama 4 Scout",
      license: "Llama 4 Community",
      size: "109B MoE (17B active)",
      vram4bit: "~60 GB",
      vram8bit: "~110 GB",
      specialty: "10M context · repo-wide analiz",
      fitsM2Ultra: true,
    },
    {
      name: "Qwen 2.5 Coder 32B",
      license: "Apache 2.0",
      size: "32B dense",
      vram4bit: "20 GB",
      vram8bit: "34 GB",
      specialty: "Pure code generation · HumanEval 88.4",
      fitsM2Ultra: true,
    },
    {
      name: "GLM-4.6",
      license: "MIT",
      size: "32B dense",
      vram4bit: "20 GB",
      vram8bit: "34 GB",
      specialty: "Claude Sonnet-seviyesi tool-use · agentic workflows",
      fitsM2Ultra: true,
    },
  ];

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-muted/40">
          <tr>
            <th className="p-3 text-left font-semibold">Model</th>
            <th className="p-3 text-left font-semibold">Lisans</th>
            <th className="p-3 text-left font-semibold">Boyut</th>
            <th className="p-3 text-left font-semibold">VRAM Q4</th>
            <th className="p-3 text-left font-semibold">VRAM Q8</th>
            <th className="p-3 text-left font-semibold">Uzmanlık</th>
            <th className="p-3 text-left font-semibold">64GB M2 Ultra?</th>
          </tr>
        </thead>
        <tbody>
          {models.map((m, i) => (
            <tr key={m.name} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
              <td className="p-3 font-medium">{m.name}</td>
              <td className="p-3 text-muted-foreground">{m.license}</td>
              <td className="p-3">{m.size}</td>
              <td className="p-3">{m.vram4bit}</td>
              <td className="p-3">{m.vram8bit}</td>
              <td className="p-3">{m.specialty}</td>
              <td className="p-3">
                {m.fitsM2Ultra ? (
                  <span className="inline-flex items-center gap-1 text-emerald-500">
                    <CheckCircle2 className="h-4 w-4" /> Sığar
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-rose-500">
                    <XCircle className="h-4 w-4" /> Tam sürüm sığmaz
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface OpenCatalogRow {
  name: string;
  license: string;
  size: string;
  vram4bit: string;
  vram8bit: string;
  specialty: string;
  fitsM2Ultra: boolean;
}

/* =========================================================================
 * Benchmark matrix
 * ======================================================================= */

function BenchmarkMatrix() {
  const rows: Array<{
    model: string;
    mmluPro: number;
    gpqa: number;
    livecodeBench: number;
    swebench: number;
    humanEval: number;
    tone: "frontier" | "open" | "efficient";
  }> = [
    { model: "Claude Opus 4.6", mmluPro: 88.2, gpqa: 84.6, livecodeBench: 78.2, swebench: 69.1, humanEval: 95.2, tone: "frontier" },
    { model: "GPT-5.4", mmluPro: 87.1, gpqa: 82.1, livecodeBench: 76.4, swebench: 65.8, humanEval: 94.1, tone: "frontier" },
    { model: "Gemini 3.1 Pro", mmluPro: 86.8, gpqa: 81.9, livecodeBench: 74.8, swebench: 62.4, humanEval: 92.8, tone: "frontier" },
    { model: "DeepSeek R1-0528", mmluPro: 87.1, gpqa: 83.2, livecodeBench: 77.1, swebench: 61.4, humanEval: 93.4, tone: "open" },
    { model: "Qwen 3.6 27B", mmluPro: 81.8, gpqa: 76.4, livecodeBench: 72.6, swebench: 58.3, humanEval: 91.2, tone: "efficient" },
    { model: "Llama 4 Scout", mmluPro: 82.4, gpqa: 74.8, livecodeBench: 68.2, swebench: 54.7, humanEval: 88.6, tone: "open" },
    { model: "Qwen 2.5 Coder 32B", mmluPro: 78.1, gpqa: 70.4, livecodeBench: 74.2, swebench: 48.2, humanEval: 88.4, tone: "efficient" },
    { model: "Llama 3.1 70B", mmluPro: 71.2, gpqa: 63.2, livecodeBench: 52.1, swebench: 28.1, humanEval: 80.5, tone: "open" },
  ];

  const max = {
    mmluPro: Math.max(...rows.map((r) => r.mmluPro)),
    gpqa: Math.max(...rows.map((r) => r.gpqa)),
    livecodeBench: Math.max(...rows.map((r) => r.livecodeBench)),
    swebench: Math.max(...rows.map((r) => r.swebench)),
    humanEval: Math.max(...rows.map((r) => r.humanEval)),
  };

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-muted/40">
          <tr>
            <th className="p-3 text-left font-semibold">Model</th>
            <th className="p-3 text-left font-semibold">MMLU-Pro</th>
            <th className="p-3 text-left font-semibold">GPQA-Diamond</th>
            <th className="p-3 text-left font-semibold">LiveCodeBench</th>
            <th className="p-3 text-left font-semibold">SWE-bench V</th>
            <th className="p-3 text-left font-semibold">HumanEval</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const rowTone = {
              frontier: "bg-amber-500/5",
              open: "bg-sky-500/5",
              efficient: "bg-emerald-500/5",
            }[r.tone];
            return (
              <tr key={r.model} className={`${rowTone} ${i % 2 === 0 ? "" : "bg-opacity-70"}`}>
                <td className="p-3 font-medium">{r.model}</td>
                <BenchCell value={r.mmluPro} max={max.mmluPro} />
                <BenchCell value={r.gpqa} max={max.gpqa} />
                <BenchCell value={r.livecodeBench} max={max.livecodeBench} />
                <BenchCell value={r.swebench} max={max.swebench} />
                <BenchCell value={r.humanEval} max={max.humanEval} />
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function BenchCell({ value, max }: { value: number; max: number }) {
  const isMax = value === max;
  return (
    <td className="p-3">
      <span className={isMax ? "font-bold text-primary" : ""}>{value.toFixed(1)}</span>
      {isMax && <span className="ml-1 text-xs text-primary/70">★</span>}
    </td>
  );
}

/* =========================================================================
 * MoE vs Dense
 * ======================================================================= */

function MoEvsDense() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-sky-500/30 bg-sky-500/5">
        <CardHeader>
          <div className="mb-2 flex items-center justify-between">
            <Badge variant="outline">MoE</Badge>
            <Layers className="h-5 w-5 text-muted-foreground" />
          </div>
          <CardTitle className="text-lg">Llama 4 Scout — 109B MoE / 17B active</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ArchRow label="Disk" value="~60 GB (Q4) — hepsini yüklemek zorundasın" />
          <ArchRow label="VRAM (aktif)" value="~12 GB — sadece aktif expert'lar" />
          <ArchRow label="Inference hızı" value="17B dense gibi — aktive edilen parametre sayısıyla orantılı" />
          <ArchRow label="Context" value="10M token — en yüksek" />
          <ArchRow label="Quality ceiling" value="MMLU-Pro 82.4 · 70B dense seviyesi" />
          <div className="mt-3 rounded-lg bg-emerald-500/10 p-3 text-xs text-emerald-400">
            <strong>Avantaj:</strong> Disk ucuz, RAM pahalı → MoE disk'e yükle
            ama RAM'de 17B gibi kullan mantığı. Apple'ın unified memory'sinde
            hafif kayboluyor çünkü zaten tek havuz.
          </div>
        </CardContent>
      </Card>
      <Card className="border-emerald-500/30 bg-emerald-500/5">
        <CardHeader>
          <div className="mb-2 flex items-center justify-between">
            <Badge variant="outline">Dense</Badge>
            <Cpu className="h-5 w-5 text-muted-foreground" />
          </div>
          <CardTitle className="text-lg">Qwen 3.6 27B — 27B dense</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ArchRow label="Disk" value="~17 GB (Q4)" />
          <ArchRow label="VRAM" value="~17 GB (Q4) — diskle eşit" />
          <ArchRow label="Inference hızı" value="27B dense · M2 Ultra Q5 ~50 tok/s" />
          <ArchRow label="Context" value="128K token" />
          <ArchRow label="Quality ceiling" value="MMLU-Pro 81.8 · 109B MoE'yi yeniyor" />
          <div className="mt-3 rounded-lg bg-emerald-500/10 p-3 text-xs text-emerald-400">
            <strong>Avantaj:</strong> Hem kaliteli hem VRAM ile disk aynı → 64GB
            makineye 3 tane farklı 27B model aynı anda sığar. Pratikte M2 Ultra
            için en akıllı seçim.
          </div>
        </CardContent>
      </Card>
      <div className="lg:col-span-2">
        <MarkdownNote tone="info" title="Hangisi hangi senaryoda?">
          {`- **10M context gerekiyorsa** (tüm codebase, toplam doküman seti) →
Llama 4 Scout. Başka seçenek yok.
- **Kalite + hız + az RAM istiyorsan** → Qwen 3.6 27B. 2026'nın sweet spot'u.
- **Reasoning (math, exploit chain, ispat)** gerekiyorsa → DeepSeek R1-Distill 32B.
- **Puro kod üretimi (autocomplete yok)** → Qwen 2.5 Coder 32B.
- **Agent + tool-use + JSON mode** → GLM-4.6 veya Qwen 3.6 27B.`}
        </MarkdownNote>
      </div>
    </div>
  );
}

function ArchRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/40 pb-2 last:border-0">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="text-right text-sm">{value}</span>
    </div>
  );
}

/* =========================================================================
 * Reasoning models
 * ======================================================================= */

function ReasoningModels() {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="border-primary/30">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Reasoning nedir?</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-muted-foreground">
            Model cevap üretmeden önce <strong className="text-foreground">
            kendi içine</strong> uzun bir <em>thinking</em> zinciri üretiyor
            (5K-50K token). Bu zincir görülmüyor; son cevap bu düşünmenin
            sonucu. R1, o1/o3 ve Claude thinking bu sınıfta.
          </CardContent>
        </Card>
        <Card className="border-emerald-500/30">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <CardTitle className="text-base">Nerede parlar?</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-muted-foreground">
            Multi-step math, competitive programming, exploit chain construction,
            teorem ispatı, <em>debugging</em>. Tek-atış (one-shot) sorgularda
            %30-60 kalite sıçraması.
          </CardContent>
        </Card>
        <Card className="border-rose-500/30">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TriangleAlert className="h-5 w-5 text-rose-500" />
              <CardTitle className="text-base">Maliyet?</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-muted-foreground">
            Her sorgu 10-50× daha uzun → token ücreti aynı oranda artar, TTFT
            30 sn'ye çıkabilir. Basit sohbet için <strong className="text-foreground">
            israf</strong>. Seçici kullan.
          </CardContent>
        </Card>
      </div>
      <MarkdownNote tone="insight" title="Pratik kullanım: hybrid stack">
        {`2026'da doğru yaklaşım **her iki türü yan yana tutmak**:
- Basit sohbet / kod yazımı → Qwen 3.6 27B (50 tok/s, anında cevap)
- Zor problem / hata çözümü → DeepSeek R1-Distill 32B (reasoning ON)
Open WebUI + Ollama bu routing'i otomatik yapabiliyor — "complex" etiketli
sorular reasoning modele gidiyor.`}
      </MarkdownNote>
    </div>
  );
}

/* =========================================================================
 * M2 Ultra recommendation
 * ======================================================================= */

function M2UltraRecommendation() {
  return (
    <div className="space-y-5">
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-6">
          <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <Gauge className="h-5 w-5 text-primary" />
            M2 Ultra 64GB için "günlük stack"
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="py-2 text-left font-semibold">Rol</th>
                  <th className="py-2 text-left font-semibold">Model</th>
                  <th className="py-2 text-left font-semibold">Quant</th>
                  <th className="py-2 text-left font-semibold">RAM</th>
                  <th className="py-2 text-left font-semibold">Hız</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                <StackRow
                  role="Ana generalist"
                  model="Qwen 3.6 27B"
                  quant="Q5_K_M"
                  ram="~22 GB"
                  speed="~50 tok/s"
                />
                <StackRow
                  role="Reasoning"
                  model="DeepSeek R1-Distill-Qwen 32B"
                  quant="Q4_K_M"
                  ram="~20 GB"
                  speed="~40 tok/s"
                />
                <StackRow
                  role="Long-context"
                  model="Llama 4 Scout (MoE)"
                  quant="Q4_K_M"
                  ram="~60 GB (on-demand)"
                  speed="~25 tok/s"
                />
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            <strong>Günlük kullanım:</strong> Qwen 3.6 + R1-Distill aynı anda
            bellekte (~42 GB). Long-context gerektiğinde R1-Distill unload, Scout
            load (Ollama/mlx-omni-server model swap otomatik — ~8-12 sn).
          </p>
        </CardContent>
      </Card>
      <MarkdownNote tone="insight" title="Bir önceki tavsiyeyle farkı">
        {`Sayfa 12'de "konuşan 3 model" tavsiyesi vardı; ama **güncel model evrenine göre**
Qwen 2.5 Coder'ı **Qwen 3.6 27B** ile değiştirmen gerekir — 3.6'nın agentic coding skoru
Qwen 2.5 Coder'dan yüksek, genel de daha iyi. Codestral ise IDE FIM
autocomplete'i için **ayrı** tutulabilir (14 GB Q4 daha).`}
      </MarkdownNote>
    </div>
  );
}

function StackRow({
  role,
  model,
  quant,
  ram,
  speed,
}: {
  role: string;
  model: string;
  quant: string;
  ram: string;
  speed: string;
}) {
  return (
    <tr>
      <td className="py-2 pr-4 text-xs uppercase tracking-wider text-muted-foreground">{role}</td>
      <td className="py-2 pr-4 font-medium">{model}</td>
      <td className="py-2 pr-4">
        <Badge variant="outline" className="text-xs">
          {quant}
        </Badge>
      </td>
      <td className="py-2 pr-4">{ram}</td>
      <td className="py-2 pr-4">{speed}</td>
    </tr>
  );
}

/* =========================================================================
 * Roadmap
 * ======================================================================= */

function RoadmapNote() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <RoadmapCard
        icon={<Flame className="h-5 w-5 text-rose-500" />}
        title="Q3 2026 — Llama 5?"
        body="Meta'nın Llama 4.x hamleleri 10M context'i ~20M'e taşıyor sinyali var. MoE aktif parametre 17B → 24B büyüyebilir. Eğer gelirse açık frontier ile kapalı frontier arasındaki marjı tamamen kapatabilir."
      />
      <RoadmapCard
        icon={<Brain className="h-5 w-5 text-primary" />}
        title="Q3 2026 — Qwen 4 serisi"
        body="Alibaba ekibinin söylemleri: native multimodal (Qwen-VL ayrı değil, entegre), reasoning-by-default, 1M context. 2026-Q4 lansmanı bekleniyor. 27B boyutunu koruması muhtemel."
      />
      <RoadmapCard
        icon={<TrendingDown className="h-5 w-5 text-emerald-500" />}
        title="Q4 2026 — 12-14B efficient"
        body="Phi-5 ve Mistral'in yeni 14B hedefi: 2026-Q2'nin 27B'sini eşit perform etmek. Başarılı olursa 32GB RAM'li makineler (Mac mini M4 Pro 24GB dahil) büyük kazanan olacak."
      />
    </div>
  );
}

function RoadmapCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <div className="mb-1 flex items-center gap-2">{icon}</div>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm leading-relaxed text-muted-foreground">{body}</CardContent>
    </Card>
  );
}
