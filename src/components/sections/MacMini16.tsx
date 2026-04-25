import { Section } from "./Section";
import { SectionHeader } from "../SectionHeader";
import { MarkdownNote } from "../MarkdownNote";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductLink } from "../ProductLink";
import { getHardwareById } from "@/data/hardware";
import {
  Cable,
  Cpu,
  MemoryStick,
  Zap,
  Gauge,
  Network,
  Layers,
  CheckCircle2,
  XCircle,
  TriangleAlert,
} from "lucide-react";

/**
 * 11 · 4× Mac mini M4 (base 16GB) derin analiz sayfası.
 *
 * Tek soru üzerine kurulu: "120K TL bütçeyle 4 adet base Mac mini almak mantıklı mı?"
 *
 * Kaynaklar (2026-Q1):
 * - Exo Labs benchmarks blog (day-1/day-2): https://blog.exolabs.net/day-1
 * - Exo GitHub issue #587 (2x16GB vs 1x32GB tartışması)
 * - Apple TR fiyat sayfası: M4 16GB/256GB = 27.999 TL (baz model)
 * - Thunderbolt 4/5 spec: developer.apple.com + intel.com
 * - Topluluk benchmark'ları: /r/LocalLLaMA, blog.exolabs.net
 */
export function MacMini16() {
  return (
    <Section id="mac-mini-16">
      <SectionHeader
        eyebrow="11 · 4× Mac mini 16GB Derinlemesine"
        title="120-172K ₺'ye 4 tane Mac mini almak gerçekten mantıklı mı?"
        description="Apple'ın temel 16GB M4 mini'si viral oldu — 'evde 70B çalıştır' videoları. Bu sayfa o videonun arkasındaki gerçek sayıları ve gerçek kararı netleştirir. 2026-Q2 güncel sıfır fiyat: 512GB 42K ₺ × 4 = 172K (256GB 2025 baseline: 120K)."
      />

      <PricingUpdateNote />

      <BigAnswerCard />

      <SectionHeader
        className="mt-14"
        eyebrow="Temel matematik"
        title="120.000 ₺ gerçekte ne alıyor?"
      />
      <BudgetBreakdown />

      <SectionHeader
        className="mt-14"
        eyebrow="En kritik soru"
        title="Yalnızca 1'inin mi, hepsinin mi hafızası önemli?"
        description="Cevabı pipeline-parallel inference belirliyor. Basit bir mimari farkıyla büyük sonuç değişir."
      />
      <MemoryDistribution />

      <SectionHeader
        className="mt-14"
        eyebrow="Hangi modeller çalışır?"
        title="4 × ~10 GB kullanılabilir bellek = 40 GB havuz"
        description="Tam liste, boyut ve gerçekçi tok/s tahminleriyle. 'Sığar' ≠ 'iyi çalışır' — ikisini ayrı sütunlarda takip ediyoruz."
      />
      <ModelFitMatrix />

      <SectionHeader
        className="mt-14"
        eyebrow="Interconnect"
        title="4 Mac mini'yi birbirine nasıl bağlarsın?"
        description="Gerçek bottleneck bandwidth değil, LATENCY. TB4 / TB5 / 10GbE / Gigabit karşılaştırması."
      />
      <InterconnectTable />

      <SectionHeader
        className="mt-14"
        eyebrow="Kıyas"
        title="Aynı bütçeyle 3 gerçek alternatif"
        description="4× M4 16GB cluster, tek M4 Pro 64GB, ikinci el dual RTX 3090. Farklı bütçelerde nerede oynarlar?"
      />
      <AlternativesComparison />

      <SectionHeader
        className="mt-14"
        eyebrow="Gerçek TPS beklentisi"
        title="Exo Labs'ın açık benchmark verileri"
        description="Tek request için cluster daha YAVAŞ olur — karşı-sezgisel ama temel bir kural."
      />
      <ExoBenchmarkCard />

      <SectionHeader
        className="mt-14"
        eyebrow="Kimler için mantıklı?"
        title="Senaryo matrisi — evet / hayır / belki"
      />
      <ScenarioMatrix />

      <SectionHeader
        className="mt-14"
        eyebrow="Pratik setup"
        title="Yazılım ve kurulum adımları"
      />
      <SetupGuide />

      <SectionHeader
        className="mt-14"
        eyebrow="Bonus · +1 mini senaryosu"
        title="Peki 5 tane alırsam ne değişir?"
        description="Marjinal bir mini'nin yarattığı domino etki: yeni model sınıfı, yeni maliyet, yeni karmaşıklık. 120K TL → 148K TL geçişinin gerçek getirisi."
      />
      <ScaleFromFourToFive />

      <SectionHeader
        className="mt-14"
        eyebrow="Bonus · Bant genişliği senaryosu"
        title="Ya Thunderbolt 5 kullanabilseydik?"
        description="TB4 (40 Gbps) → TB5 (80 Gbps) 2× bant genişliği. Ama base M4 mini'de TB5 yok. Bu tuzağın ardındaki gerçek hesap."
      />
      <ThunderboltFiveScenario />

      <SectionHeader
        className="mt-14"
        eyebrow="Bonus · Depolama senaryosu"
        title="SSD kapasiteleri ve hızı bir darboğaz mı?"
        description="256GB mi, 512GB mi, 1TB mı? Her node için aynı mı, asimetrik mi? Apple'ın M4 mini'de sakladığı bir SSD hızı tuzağı var — önce onu kırıyoruz."
      />
      <StorageAnalysis />

      <SectionHeader
        className="mt-14"
        eyebrow="Dashboard'ın kararı"
        title="Bu bütçeyi nereye koymalıyım?"
      />
      <FinalVerdict />
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* PricingUpdateNote — 2026-Q2 sıfır fiyat güncellemesi                */
/* ------------------------------------------------------------------ */

function PricingUpdateNote() {
  return (
    <MarkdownNote tone="warning" title="2026-Q2 sıfır fiyat güncellemesi (kullanıcı referansı)">
{`Kullanıcı kararı: **512GB SSD baseline** üzerinden gidiyoruz (256GB NAND tuzağı yok).
Güncel sıfır fiyatlar:

- **Mac mini M4 · 16GB · 512GB**: 42.000 ₺ sıfır (Apple TR 2026-Q2)
- **Mac mini M4 Pro · 24GB · 512GB**: 78.000 ₺ sıfır
- **Mac Studio M2 Ultra · 64GB · 512GB**: 160.000 ₺ sıfır · (2. el ~115K ₺)

Bu sayfadaki analiz başlangıçta "**120K ile 4× 256GB mini**" sorusuyla kurulmuştu.
512GB sıfır baseline'da aynı konfigürasyon **~172K ₺**'ya çıkar. Hem 256GB hem 512GB
bağlamları aşağıda korunuyor — 256GB "bütçeyi sıkıştırarak 120K'ya sığdırmak" senaryosu
olarak okuyun. **Eşit 160-172K bütçede farklı senaryoların (tek kasa M2 Ultra vs
2× M4 Pro TB5 vs 4× M4 TB4) yan yana kıyası için Sayfa 12'ye bak.**`}
    </MarkdownNote>
  );
}

/* ------------------------------------------------------------------ */
/* BigAnswerCard                                                      */
/* ------------------------------------------------------------------ */

function BigAnswerCard() {
  const mini = getHardwareById("mac-mini-m4-16");
  const cluster = getHardwareById("cluster-4x-mac-mini-m4-16");
  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-primary/50 text-primary">
            Kısa cevap
          </Badge>
          <Badge variant="outline" className="border-amber-500/50 text-amber-400">
            Niş senaryo
          </Badge>
        </div>
        <CardTitle className="pt-2 text-2xl leading-tight">
          Çoğu kullanıcı için{" "}
          <span className="text-rose-400">hayır</span> — ama{" "}
          <span className="text-emerald-400">üç özel senaryoda</span> evet.
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 text-sm leading-relaxed">
        <p className="text-muted-foreground">
          4 adet base{" "}
          <ProductLink
            name="Mac mini M4 16GB/512GB"
            url={mini?.url}
          />{" "}
          (sıfır 42.000 ₺ × 4 = ~172.000 ₺; 256GB 2025 baseline ~120K ₺)
          birleştirmek ilk bakışta cazip bir{" "}
          <span className="text-foreground">"dağıtık süper bilgisayar"</span>{" "}
          fantezisi sunar. Pratikte sonuç şu:
        </p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <BigFactCard
            icon={<MemoryStick className="h-4 w-4" />}
            title="Bellek havuzu"
            value="~40 GB"
            sub="4 × ~10 GB kullanılabilir"
            tone="primary"
          />
          <BigFactCard
            icon={<Gauge className="h-4 w-4" />}
            title="70B Q4 · tek request"
            value="3-5 tok/s"
            sub="Cluster overhead'i düşürür"
            tone="warning"
          />
          <BigFactCard
            icon={<Network className="h-4 w-4" />}
            title="70B Q4 · çoklu request"
            value="10-14 tok/s"
            sub="Paralel iş yükünde kazanır"
            tone="success"
          />
        </div>
        <MarkdownNote tone="insight" title="Tek cümle özet">
{`**160-172K ₺ eşit bütçede (2026-Q2 sıfır)**: **Mac Studio M2 Ultra 64GB sıfır 160K** 70B Q4'te **12-15 tok/s** alırsın; 4× base 16GB/512GB (172K) ise **3-5 tok/s** (cluster) verir. 4× setup yalnızca **aynı anda birden fazla model/request çalıştırmak**, **öğrenme laboratuvarı** veya **incremental alım** senaryosunda mantıklı — yoksa tek kasa her eksende kazanır.`}
        </MarkdownNote>
        {cluster?.url && (
          <p className="text-xs text-muted-foreground">
            Dashboard'daki mevcut kayıt:{" "}
            <ProductLink name={cluster.name} url={cluster.url} /> — TR pazarı
            tahmini{" "}
            <span className="font-mono text-foreground">
              {cluster.approxPriceTRY?.toLocaleString("tr-TR")} ₺
            </span>
            , toplam unified memory{" "}
            <span className="font-mono text-foreground">
              {cluster.unifiedMemoryGB} GB
            </span>
            , Thunderbolt 4 ring topoloji.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function BigFactCard({
  icon,
  title,
  value,
  sub,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  sub: string;
  tone: "primary" | "warning" | "success";
}) {
  const toneClass = {
    primary: "border-primary/30 bg-primary/5 text-primary",
    warning: "border-amber-500/30 bg-amber-500/5 text-amber-400",
    success: "border-emerald-500/30 bg-emerald-500/5 text-emerald-400",
  }[tone];
  return (
    <div className={`rounded-xl border p-4 ${toneClass}`}>
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider opacity-80">
        {icon}
        {title}
      </div>
      <div className="font-mono text-2xl font-bold leading-none">{value}</div>
      <div className="mt-1 text-[11px] text-muted-foreground">{sub}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* BudgetBreakdown                                                    */
/* ------------------------------------------------------------------ */

function BudgetBreakdown() {
  const rows = [
    {
      item: "Mac mini M4 16GB / 256GB × 4",
      unit: "~28.500 ₺",
      total: "114.000 ₺",
      note: "Apple TR baz model · güncel kampanya fiyatı",
    },
    {
      item: "Thunderbolt 4 kablo × 3 (2 m)",
      unit: "~1.200 ₺",
      total: "3.600 ₺",
      note: "Ring topoloji: A↔B↔C↔D↔A (4 kablo). 4. kablo kritik değil",
    },
    {
      item: "USB-C hub + monitör kablosu",
      unit: "~800 ₺",
      total: "800 ₺",
      note: "Yalnız 1 cihaza bağlanır (orchestrator node)",
    },
    {
      item: "Gigabit switch + kablolar (opsiyonel)",
      unit: "~500 ₺",
      total: "500 ₺",
      note: "Keşif/management için. Inference TB üzerinden",
    },
  ];
  const sum =
    114_000 + 3_600 + 800 + 500;
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          Malzeme listesi — tek seferlik yatırım
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-3 py-2">Kalem</th>
              <th className="px-3 py-2 text-right">Birim</th>
              <th className="px-3 py-2 text-right">Toplam</th>
              <th className="px-3 py-2">Not</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.item}
                className="border-b border-border/40 last:border-0"
              >
                <td className="px-3 py-2 font-medium">{r.item}</td>
                <td className="px-3 py-2 text-right font-mono text-xs text-muted-foreground">
                  {r.unit}
                </td>
                <td className="px-3 py-2 text-right font-mono text-foreground">
                  {r.total}
                </td>
                <td className="px-3 py-2 text-xs text-muted-foreground">
                  {r.note}
                </td>
              </tr>
            ))}
            <tr className="bg-primary/5 font-semibold">
              <td className="px-3 py-3" colSpan={2}>
                Toplam (tek seferlik)
              </td>
              <td className="px-3 py-3 text-right font-mono text-primary">
                ~{sum.toLocaleString("tr-TR")} ₺
              </td>
              <td className="px-3 py-3 text-xs text-muted-foreground">
                120.000 ₺ sınırının altında
              </td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* MemoryDistribution                                                 */
/* ------------------------------------------------------------------ */

function MemoryDistribution() {
  return (
    <div className="space-y-6">
      <MarkdownNote tone="info" title="En sık karıştırılan nokta">
{`Dağıtık inference **pipeline parallel** çalışır: modelin **katmanları** 4 mini arasında bölünür. Her mini sadece kendi payına düşen katmanları belleğe koyar. Yani:

- **Hepsinin belleği aynı oranda önemli.** 1 tanesinin bellek miktarını artırsan diğerleri bundan faydalanmaz.
- Exo cluster **heterojen hafızada homojen dağıtım** yapar — en küçük node'u referans alır. 3 tanesi 16GB, bir tanesi 32GB ise dashboard sana 64GB değil **48GB + atıl 16GB** verir.
- Her mini'de yaklaşık **10-11 GB** LLM için kullanılabilir: macOS + system reserved = ~4-5 GB, wired memory sınırı = ~12 GB.`}
      </MarkdownNote>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            Llama 3.3 70B Q4 (≈ 40 GB) 4 mini arasında nasıl dağılır?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <ShardNode
              name="Node 1 · Orchestrator"
              role="Tokenizer + Layer 1-20"
              memory="10 GB"
              subtitle="Kullanıcıyla konuşan mini (kablosuz monitör/klavye buradan)"
              primary
            />
            <ShardNode
              name="Node 2"
              role="Layer 21-40"
              memory="10 GB"
              subtitle="Thunderbolt ile Node 1'e bağlı"
            />
            <ShardNode
              name="Node 3"
              role="Layer 41-60"
              memory="10 GB"
              subtitle="Thunderbolt ile Node 2'ye bağlı"
            />
            <ShardNode
              name="Node 4 · Sampler"
              role="Layer 61-80 + LM head"
              memory="10 GB"
              subtitle="Son token'ı üretir, Node 1'e geri verir"
              accent
            />
          </div>
          <div className="mt-4 rounded-md border border-border/50 bg-secondary/30 p-3 text-xs text-muted-foreground">
            <Layers className="mr-1 inline h-3 w-3" /> <strong>Toplam:</strong>{" "}
            ~40 GB model ağırlığı · ~1 GB KV-cache havuzu (her node 256 MB) ·{" "}
            <strong>her node'da</strong> ~5 GB system overhead dışarıda tutulur.
            Yani model <em>sığar</em>, ama KV-cache için çok az yer kalır → uzun
            context'lerde (&gt;8K token) throttling başlar.
          </div>
        </CardContent>
      </Card>

      <MarkdownNote tone="warning" title="Asimetrik bellek tuzağı">
{`"1 tanesini 32GB, diğerlerini 16GB alsam daha iyi olur mu?" → **Hayır.** Exo'nun mevcut planlayıcısı (2026-Q1) asimetrik pipeline sharding yapmıyor, model katmanlarını **eşit** dağıtıyor. Fazla bellek **kullanılamıyor**, sadece KV-cache için marjinal avantaj veriyor.

Gerçek senaryoda 4 × 16GB ile 4 × 24GB arası fark **performans değil, context uzunluğu**: 16GB config'te 4K-8K context rahat, 24GB config'te 16K-32K rahat.`}
      </MarkdownNote>
    </div>
  );
}

function ShardNode({
  name,
  role,
  memory,
  subtitle,
  primary,
  accent,
}: {
  name: string;
  role: string;
  memory: string;
  subtitle: string;
  primary?: boolean;
  accent?: boolean;
}) {
  const border = primary
    ? "border-primary/50 bg-primary/5"
    : accent
      ? "border-accent/50 bg-accent/5"
      : "border-border/60 bg-secondary/20";
  return (
    <div className={`rounded-xl border p-4 ${border}`}>
      <div className="mb-1 flex items-center gap-1.5">
        <Cpu className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-semibold">{name}</span>
      </div>
      <div className="mb-2 font-mono text-xs text-foreground">{role}</div>
      <div className="flex items-center justify-between gap-2 border-t border-border/40 pt-2 text-[11px]">
        <span className="text-muted-foreground">Bellek kullanımı</span>
        <span className="font-mono font-semibold text-primary">{memory}</span>
      </div>
      <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
        {subtitle}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ModelFitMatrix                                                     */
/* ------------------------------------------------------------------ */

interface ModelRow {
  name: string;
  size: string;
  fits: "full" | "tight" | "no";
  single: string;
  multi: string;
  note: string;
}

const MODEL_ROWS: ModelRow[] = [
  {
    name: "Llama 3.1 8B Q4",
    size: "~4.6 GB",
    fits: "full",
    single: "25-35 tok/s",
    multi: "70-100 tok/s (batch 4)",
    note: "Tek mini'de zaten çok rahat — cluster burada YAVAŞLATIR. Cluster'ı paralel 4 agent için kullan.",
  },
  {
    name: "Qwen 2.5 14B Q4",
    size: "~8 GB",
    fits: "full",
    single: "15-22 tok/s",
    multi: "45-65 tok/s",
    note: "Hâlâ tek mini'ye sığar. Cluster ancak concurrent request için anlamlı.",
  },
  {
    name: "Qwen3 32B Q4",
    size: "~18 GB",
    fits: "full",
    single: "7-10 tok/s",
    multi: "20-30 tok/s",
    note: "2 mini yeter, 4 mini'de ek node'lar atıl. İyi sweet-spot.",
  },
  {
    name: "Mixtral 8x7B Q4 (MoE)",
    size: "~26 GB",
    fits: "full",
    single: "12-16 tok/s",
    multi: "35-50 tok/s",
    note: "MoE sparse aktivasyon burada çok güzel çalışır — 3 mini yeter.",
  },
  {
    name: "Llama 3.3 70B Q4",
    size: "~40 GB",
    fits: "tight",
    single: "3-5 tok/s",
    multi: "10-14 tok/s",
    note: "Cluster'ın varlık nedeni. 4 mini zorunlu, context 4-8K ile sınırlı. TTFT 20-30 sn.",
  },
  {
    name: "Qwen3 72B Q4",
    size: "~41 GB",
    fits: "tight",
    single: "3-5 tok/s",
    multi: "10-13 tok/s",
    note: "Llama 70B ile aynı bütçede. Matematik ve çok dilli görevde üstün.",
  },
  {
    name: "GPT-OSS 120B Q4 (MoE)",
    size: "~60 GB",
    fits: "no",
    single: "—",
    multi: "—",
    note: "4 × 16 = 64 teorik, ama KV-cache + overhead nedeniyle sığmıyor. 5-6 mini gerekli.",
  },
  {
    name: "Llama 3.1 405B Q4",
    size: "~225 GB",
    fits: "no",
    single: "—",
    multi: "—",
    note: "Kesinlikle sığmaz. 14+ mini gerekli (Exo viral demo'sunun yaptığı).",
  },
  {
    name: "DeepSeek V3.1 671B Q4",
    size: "~400 GB",
    fits: "no",
    single: "—",
    multi: "—",
    note: "4× base 16GB için imkansız. 8× M4 Pro 64GB lazım (~480K TL).",
  },
];

function ModelFitMatrix() {
  return (
    <Card>
      <CardContent className="overflow-x-auto p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-3 py-2">Model</th>
              <th className="px-3 py-2 text-right">Boyut (Q4)</th>
              <th className="px-3 py-2 text-right">Sığar mı?</th>
              <th className="px-3 py-2 text-right">Tek request</th>
              <th className="px-3 py-2 text-right">Multi (4x batch)</th>
              <th className="px-3 py-2">Not</th>
            </tr>
          </thead>
          <tbody>
            {MODEL_ROWS.map((r) => (
              <tr
                key={r.name}
                className="border-b border-border/40 last:border-0"
              >
                <td className="px-3 py-2 font-medium">{r.name}</td>
                <td className="px-3 py-2 text-right font-mono text-xs text-muted-foreground">
                  {r.size}
                </td>
                <td className="px-3 py-2 text-right">
                  <FitBadge fit={r.fits} />
                </td>
                <td className="px-3 py-2 text-right font-mono text-xs">
                  {r.single}
                </td>
                <td className="px-3 py-2 text-right font-mono text-xs">
                  {r.multi}
                </td>
                <td className="px-3 py-2 text-[11px] text-muted-foreground">
                  {r.note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function FitBadge({ fit }: { fit: "full" | "tight" | "no" }) {
  if (fit === "full") {
    return (
      <Badge variant="outline" className="border-emerald-500/50 text-emerald-400">
        ✓ Rahat
      </Badge>
    );
  }
  if (fit === "tight") {
    return (
      <Badge variant="outline" className="border-amber-500/50 text-amber-400">
        ⚠ Sınırda
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="border-rose-500/50 text-rose-400">
      ✗ Sığmaz
    </Badge>
  );
}

/* ------------------------------------------------------------------ */
/* InterconnectTable                                                  */
/* ------------------------------------------------------------------ */

function InterconnectTable() {
  const rows = [
    {
      tech: "Thunderbolt 4",
      bw: "40 Gbps (~4.5 GB/s pratik)",
      latency: "~10 µs",
      cost: "~1.200 ₺/kablo",
      support: "Base M4 mini 3 port",
      verdict: "Varsayılan · ring topoloji için ideal",
      tone: "success",
    },
    {
      tech: "Thunderbolt 5",
      bw: "80-120 Gbps (~10 GB/s)",
      latency: "~8 µs",
      cost: "~1.800 ₺/kablo",
      support: "❌ Base M4 mini'de YOK (sadece M4 Pro)",
      verdict: "Base model için alakasız — Pro'ya geç",
      tone: "muted",
    },
    {
      tech: "10 Gigabit Ethernet",
      bw: "10 Gbps (~1.1 GB/s)",
      latency: "~25 µs",
      cost: "~3.500 ₺/mini (USB-C adaptör)",
      support: "Her mini'ye ayrı adaptör + 10GbE switch",
      verdict: "Latency TB4'ten kötü, para çöpe",
      tone: "danger",
    },
    {
      tech: "Gigabit Ethernet (dahili)",
      bw: "1 Gbps (~120 MB/s)",
      latency: "~150 µs",
      cost: "0 ₺",
      support: "Dahili port — keşif ve management için",
      verdict: "❌ Inference için KULLANMA · 70B TPS yarıya düşer",
      tone: "danger",
    },
    {
      tech: "USB4 (40 Gbps)",
      bw: "40 Gbps paylaşımlı",
      latency: "~20 µs",
      cost: "~500 ₺/kablo",
      support: "TB4 portunu destekler",
      verdict: "TB4'ün jenerik versiyonu; aynı hızı verir",
      tone: "primary",
    },
  ];
  return (
    <Card>
      <CardContent className="overflow-x-auto p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-3 py-2">Teknoloji</th>
              <th className="px-3 py-2 text-right">Bandwidth</th>
              <th className="px-3 py-2 text-right">Latency</th>
              <th className="px-3 py-2 text-right">Maliyet</th>
              <th className="px-3 py-2">Destek</th>
              <th className="px-3 py-2">Yorum</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.tech}
                className="border-b border-border/40 last:border-0"
              >
                <td className="px-3 py-2 font-medium">
                  <Cable className="mr-1 inline h-3 w-3 text-muted-foreground" />
                  {r.tech}
                </td>
                <td className="px-3 py-2 text-right font-mono text-xs">
                  {r.bw}
                </td>
                <td className="px-3 py-2 text-right font-mono text-xs text-muted-foreground">
                  {r.latency}
                </td>
                <td className="px-3 py-2 text-right font-mono text-xs">
                  {r.cost}
                </td>
                <td className="px-3 py-2 text-[11px] text-muted-foreground">
                  {r.support}
                </td>
                <td
                  className={`px-3 py-2 text-[11px] ${
                    r.tone === "success"
                      ? "text-emerald-400"
                      : r.tone === "danger"
                        ? "text-rose-400"
                        : r.tone === "muted"
                          ? "text-muted-foreground"
                          : "text-sky-400"
                  }`}
                >
                  {r.verdict}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* AlternativesComparison                                             */
/* ------------------------------------------------------------------ */

function AlternativesComparison() {
  const alts = [
    {
      title: "4 × Mac mini M4 16GB (120K ₺)",
      tone: "primary" as const,
      rank: "Bu sayfa",
      mem: "~40 GB (paylaşımlı)",
      fit: "70B Q4 sınırda",
      singleTps: "3-5 tok/s",
      multiTps: "10-14 tok/s",
      finetune: "❌ MLX olgun değil",
      power: "~260 W yük (4× 65W)",
      noise: "🟢 Sessiz (fansız idle)",
      pros: [
        "Paralel 4 agent çalıştırabilir",
        "Modüler: 1'i bozulsa diğerleri devam",
        "Öğrenme laboratuvarı olarak ideal",
        "Toplam 40 TOPS NPU + 40-core GPU",
      ],
      cons: [
        "Tek request'te en yavaş seçenek",
        "4 adet cihaz = 4 adet macOS yönetimi",
        "Thunderbolt ring kurulumu kırılgan",
        "KV-cache dar → uzun context sınırlı",
      ],
    },
    {
      title: "1 × Mac mini M4 Pro 64GB (~142K ₺)",
      tone: "accent" as const,
      rank: "🥇 Tek kullanıcı için",
      mem: "64 GB (tek havuz)",
      fit: "70B Q4 rahat",
      singleTps: "10-12 tok/s",
      multiTps: "15-20 tok/s",
      finetune: "⚠ MLX-LM LoRA deneysel",
      power: "~75 W yük",
      noise: "🟢 Çok sessiz",
      pros: [
        "Tek request'te 2-3× daha hızlı",
        "Tek makine = sıfır setup karmaşası",
        "273 GB/s memory bandwidth",
        "Thunderbolt 5 · gelecek proof",
      ],
      cons: [
        "Paralel 4 agent çalıştıramaz",
        "Upgrade yolu yok (kapalı kutu)",
        "Tek cihaz arızası = tüm durur",
      ],
    },
    {
      title: "Dual RTX 3090 PC (~150K ₺ DIY, 2. el)",
      tone: "success" as const,
      rank: "🥇 Hız + fine-tune için",
      mem: "48 GB VRAM + 64 GB RAM",
      fit: "70B Q4 rahat + hızlı",
      singleTps: "18-25 tok/s",
      multiTps: "40-60 tok/s (vLLM)",
      finetune: "✅ QLoRA 70B rahat",
      power: "~750 W yük",
      noise: "🟠 Gürültülü (3 fan)",
      pros: [
        "CUDA + vLLM + fine-tune her şey var",
        "Upgrade yolu açık (3. GPU eklenebilir)",
        "Tek request'te en hızlı seçenek",
        "Aynı bütçede en yüksek ham güç",
      ],
      cons: [
        "750W elektrik + gürültü + ısı",
        "Madencilik kartı ikinci el riski",
        "Yaz ayında throttle (%22-30)",
        "Windows/Linux gerekli",
      ],
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {alts.map((a) => (
        <AlternativeCard key={a.title} {...a} />
      ))}
    </div>
  );
}

function AlternativeCard({
  title,
  tone,
  rank,
  mem,
  fit,
  singleTps,
  multiTps,
  finetune,
  power,
  noise,
  pros,
  cons,
}: {
  title: string;
  tone: "primary" | "accent" | "success";
  rank: string;
  mem: string;
  fit: string;
  singleTps: string;
  multiTps: string;
  finetune: string;
  power: string;
  noise: string;
  pros: string[];
  cons: string[];
}) {
  const border = {
    primary: "border-primary/40 bg-primary/5",
    accent: "border-accent/40 bg-accent/5",
    success: "border-emerald-500/40 bg-emerald-500/5",
  }[tone];
  return (
    <Card className={`card-hover flex flex-col ${border}`}>
      <CardHeader className="pb-2">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {rank}
        </div>
        <CardTitle className="pt-1 text-base leading-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 text-xs">
        <dl className="space-y-1">
          <SpecRow label="Toplam bellek" value={mem} />
          <SpecRow label="70B Q4" value={fit} />
          <SpecRow label="Tek request TPS" value={singleTps} mono />
          <SpecRow label="Multi-request TPS" value={multiTps} mono />
          <SpecRow label="Fine-tune" value={finetune} />
          <SpecRow label="Güç (yük)" value={power} mono />
          <SpecRow label="Ses" value={noise} />
        </dl>
        <div>
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
            <CheckCircle2 className="mr-1 inline h-3 w-3" /> Güçlü
          </div>
          <ul className="space-y-0.5">
            {pros.map((p) => (
              <li
                key={p}
                className="flex gap-1.5 text-[11px] text-muted-foreground"
              >
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-rose-400">
            <XCircle className="mr-1 inline h-3 w-3" /> Zayıf
          </div>
          <ul className="space-y-0.5">
            {cons.map((c) => (
              <li
                key={c}
                className="flex gap-1.5 text-[11px] text-muted-foreground"
              >
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-rose-400" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function SpecRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-b border-border/30 pb-1 last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={mono ? "font-mono text-foreground" : "text-foreground"}>
        {value}
      </dd>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ExoBenchmarkCard                                                   */
/* ------------------------------------------------------------------ */

function ExoBenchmarkCard() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            Exo Labs resmi benchmark (LLaMA 3.2 3B · M4 Pro)
          </CardTitle>
          <div className="text-xs text-muted-foreground">
            Kaynak:{" "}
            <a
              href="https://blog.exolabs.net/day-1"
              target="_blank"
              rel="noopener"
              className="hover:text-primary"
            >
              blog.exolabs.net/day-1
            </a>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-3 py-2">Setup</th>
                <th className="px-3 py-2 text-right">Tek request TPS</th>
                <th className="px-3 py-2 text-right">Multi-request TPS</th>
                <th className="px-3 py-2 text-right">Ölçek</th>
              </tr>
            </thead>
            <tbody>
              <BenchRow
                label="1× M4 Pro (24GB)"
                single="49.3"
                multi="49.3"
                scale="1.0×"
              />
              <BenchRow
                label="2× M4 Pro cluster"
                single="44.4 ↓"
                multi="95.7"
                scale="1.94× (multi)"
                highlight
              />
              <BenchRow
                label="3× M4 Pro cluster"
                single="39.7 ↓"
                multi="108.8"
                scale="2.21× (multi)"
                highlight
              />
            </tbody>
          </table>
        </CardContent>
      </Card>

      <MarkdownNote tone="warning" title="Karşı-sezgisel sonuç">
{`- Tek request cluster'a **4 node eklediğinde % 20 YAVAŞLIYOR** (ağ overhead'i).
- Multi-request (paralel 4 istek) için **% 120 daha hızlı** (2.2× ölçek).
- Bu verilerden base M4'e ekstrapolasyon: LLaMA 3.2 3B tek request 4× M4 cluster'da **~32-36 tok/s** civarı (M4 Pro'nun ~%70'i). Multi: **~85-95 tok/s**.

**Karar mantığı:** Tek request hızı istiyorsan 4× cluster doğru değil. Çoklu iş yükü (batch belge özetleme, agent fleet, paralel kullanıcı) istiyorsan cluster doğru.`}
      </MarkdownNote>
    </div>
  );
}

function BenchRow({
  label,
  single,
  multi,
  scale,
  highlight,
}: {
  label: string;
  single: string;
  multi: string;
  scale: string;
  highlight?: boolean;
}) {
  return (
    <tr
      className={`border-b border-border/40 last:border-0 ${highlight ? "bg-primary/5" : ""}`}
    >
      <td className="px-3 py-2 font-medium">{label}</td>
      <td className="px-3 py-2 text-right font-mono text-xs">{single}</td>
      <td className="px-3 py-2 text-right font-mono text-xs">{multi}</td>
      <td className="px-3 py-2 text-right font-mono text-[11px] text-muted-foreground">
        {scale}
      </td>
    </tr>
  );
}

/* ------------------------------------------------------------------ */
/* ScenarioMatrix                                                     */
/* ------------------------------------------------------------------ */

function ScenarioMatrix() {
  const scenarios = [
    {
      who: "Tek kullanıcı · kod asistanı (GitHub Copilot alternatifi)",
      verdict: "no" as const,
      reason:
        "Tek request gerekli · 4× cluster tek M4 Pro 64GB'dan 2-3× daha yavaş. Direkt Pro al ya da dual 3090.",
    },
    {
      who: "Bir geliştirici · günde 5-10 agent paralel (browser-use, Cursor agents, MCP)",
      verdict: "maybe" as const,
      reason:
        "Sınırda mantıklı. Her agent ayrı node'da çalışabilir, ama 14B-32B modeller yeter → tek M4 Pro da paralel çalıştırır. Cluster'ın tek avantajı: ayrı modeller aynı anda.",
    },
    {
      who: "Küçük ofis · 5-10 kişi dahili ChatGPT alternatifi",
      verdict: "yes" as const,
      reason:
        "Multi-request throughput önemli. Aggregate 10-14 TPS, 5 kişi için yeter. Gizlilik avantajı + sessiz + düşük güç bonus.",
    },
    {
      who: "Araştırmacı / MLE · paralel deney + sharding öğrenmek",
      verdict: "yes" as const,
      reason:
        "Öğrenme laboratuvarı olarak paha biçilmez: pipeline parallel, tensor parallel, heterojen cluster, RDMA gibi konular hands-on öğrenilir.",
    },
    {
      who: "Gizlilik kritik · tıbbi / hukuki / kurumsal veri",
      verdict: "maybe" as const,
      reason:
        "Evet — ama 1× Mac Studio M2 Ultra 64GB ikinci el (~115K ₺) daha güçlü. Cluster'ın avantajı yalnızca paralel ofis erişimi.",
    },
    {
      who: "Batch iş yükü · gecelik 1000 belge özetleme",
      verdict: "yes" as const,
      reason:
        "Tam vuruş. 4× mini 4 belgeyi aynı anda işler → 4× throughput. Tek kullanıcı latency değil, toplam süre önemli.",
    },
    {
      who: "Fine-tune · kendi verinle QLoRA 70B eğitmek",
      verdict: "no" as const,
      reason:
        "Apple Silicon fine-tune için hâlâ kapalı kapı. MLX-LM LoRA var ama QLoRA yok, Unsloth yok, FA2 yok. Dual 3090 tek seçenek.",
    },
    {
      who: "Ev otomasyon · 7/24 Home Assistant + LLM agent",
      verdict: "maybe" as const,
      reason:
        "Tek mini M4 16GB (30K ₺) 7B model için yeter. Cluster overhead değmez. Büyümek istersen sonra ekleyebilirsin.",
    },
    {
      who: "Saf token ekonomisi · aylık en ucuz cloud alternatifi",
      verdict: "no" as const,
      reason:
        "DeepSeek V3.1 API (~350 ₺/ay günlük 500K token) 4× mini yerel (~4.000 ₺/ay amortize + elektrik) 10× daha ucuz. Dashboard Q6 bulgusu burada da geçerli.",
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {scenarios.map((s) => (
        <ScenarioRow key={s.who} {...s} />
      ))}
    </div>
  );
}

function ScenarioRow({
  who,
  verdict,
  reason,
}: {
  who: string;
  verdict: "yes" | "no" | "maybe";
  reason: string;
}) {
  const config = {
    yes: {
      label: "✅ EVET",
      border: "border-emerald-500/40 bg-emerald-500/5",
      text: "text-emerald-400",
    },
    no: {
      label: "❌ HAYIR",
      border: "border-rose-500/40 bg-rose-500/5",
      text: "text-rose-400",
    },
    maybe: {
      label: "⚠️ BELKİ",
      border: "border-amber-500/40 bg-amber-500/5",
      text: "text-amber-400",
    },
  }[verdict];
  return (
    <div className={`rounded-xl border p-4 ${config.border}`}>
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="text-sm font-medium leading-tight">{who}</div>
        <Badge
          variant="outline"
          className={`shrink-0 border-transparent ${config.text} bg-transparent font-mono text-[10px]`}
        >
          {config.label}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground">{reason}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SetupGuide                                                         */
/* ------------------------------------------------------------------ */

function SetupGuide() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            <Network className="mr-1.5 inline h-4 w-4" />
            Fiziksel kurulum (ring topoloji)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <ol className="list-decimal space-y-1.5 pl-4 text-muted-foreground">
            <li>4 mini'yi yan yana, havalandırması açık yerleştir (en az 10 cm ara).</li>
            <li>
              Ring topoloji: Mini1 TB4-port1 ↔ Mini2 port1 · Mini2 port2 ↔ Mini3 port1 · Mini3 port2 ↔ Mini4 port1 · Mini4 port2 ↔ Mini1 port2.
            </li>
            <li>Gigabit ethernet kablolarını switch'e bağla (keşif için).</li>
            <li>
              Yalnız Mini1'e USB-C monitör + klavye bağla — diğerleri
              "headless" (uzak SSH).
            </li>
            <li>
              Her mini için Apple ID (aynı olabilir) · macOS Sequoia+ / Tahoe
              (RDMA için).
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            <Zap className="mr-1.5 inline h-4 w-4" />
            Yazılım yığını (Exo + MLX)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          <pre className="overflow-x-auto rounded-md border border-border/60 bg-secondary/30 p-3 font-mono text-[11px] leading-relaxed">
{`# Her mini'ye tek tek:
brew install python@3.12
pip3 install exo-labs mlx

# Recovery mode'da (macOS 26.2+):
rdma_ctl enable

# Mini1'de (orchestrator):
exo run llama-3.3-70b --nodes 4

# Exo otomatik keşif ile
# diğer 3 mini'yi bulur ve
# model katmanlarını dağıtır.`}
          </pre>
          <p className="text-[11px] text-muted-foreground">
            Exo, Thunderbolt üzerinden RDMA destekler (macOS Tahoe 26.2+).
            Latency 10 µs'e düşer — MLX tam avantajı kullanır.
          </p>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            <TriangleAlert className="mr-1.5 inline h-4 w-4 text-amber-400" />
            Sık yaşanan problemler
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 text-xs md:grid-cols-3">
          <TroubleshootCard
            title="Gigabit fallback"
            desc="TB4 bağlantısı düzgün kurulmazsa Exo Gigabit'e düşer → 70B TPS yarıya iner. macOS 'System Report > Thunderbolt' ile bağlantıyı doğrula."
          />
          <TroubleshootCard
            title="KV-cache taşması"
            desc="16GB × 4 = 64GB teorik ama model ağırlığı 40GB, system reserved 20GB, KV-cache için sadece 4GB kalır. Context'i 4K-8K'da tut, MLX-LM --max-kv-tokens 2048 gibi parametre eklemeyi dene."
          />
          <TroubleshootCard
            title="Tek node düşerse"
            desc="Ring topolojide bir mini giderse tüm pipeline kırılır. Yedekli mimari için Exo henüz hot-failover desteklemiyor (2026-Q1). Üretim ortamında risk."
          />
        </CardContent>
      </Card>
    </div>
  );
}

function TroubleshootCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
      <div className="mb-1 text-xs font-semibold text-amber-400">{title}</div>
      <p className="text-[11px] text-muted-foreground">{desc}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FinalVerdict                                                       */
/* ------------------------------------------------------------------ */

function FinalVerdict() {
  return (
    <div className="space-y-4">
      <Card className="border-primary/40 bg-gradient-to-br from-primary/10 via-transparent to-accent/10">
        <CardHeader>
          <CardTitle className="text-xl">
            Dashboard'ın 4× Mac mini 16GB kararı
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed">
          <p>
            <span className="font-semibold text-foreground">
              Çoğu kullanıcı için 120.000 ₺'yi tek M4 Pro 14/20 48GB 1TB'a (125K) tamamlamak ya da 150K+ ₺ bütçe ayırıp Dual 3090 PC kurmak daha doğru karar.
            </span>{" "}
            Bu "çoğu" kategorisine giren kim? Dashboard'ın önceki
            bölümlerindeki tipik persona'lar — bireysel kod asistanı, tek
            kullanıcı chat, gizlilik birincil.
          </p>
          <p>
            <span className="font-semibold text-foreground">
              4× mini 16GB cluster spesifik olarak şu kullanıcı için doğru:
            </span>{" "}
            (1) aynı anda 4+ agent / paralel request koşturacak, (2) öğrenmeyi hedefleyen
            MLE, (3) 5-10 kişilik küçük bir ofis, (4) batch workload
            (gecelik belge özetleme, veri zenginleştirme).
          </p>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <VerdictBox
              title="Sadece paralel iş yükü için"
              value="4× Mac mini 16GB"
              sub="120K ₺ · 10-14 TPS multi-request"
              tone="primary"
            />
            <VerdictBox
              title="Tek kullanıcı performans için"
              value="1× Mac mini M4 Pro 64GB"
              sub="~142K ₺ · 10-12 TPS single · sessiz"
              tone="accent"
            />
            <VerdictBox
              title="Hız + fine-tune için"
              value="Dual RTX 3090 PC"
              sub="~150K ₺ DIY · 18-25 TPS · CUDA · gürültülü"
              tone="success"
            />
          </div>
        </CardContent>
      </Card>

      <MarkdownNote tone="insight" title="Niş gerçek">
{`4× mini 16GB cluster, dashboard'ın diğer bölümlerinde (Q3, Butce Onerileri) "genel karar" olarak önerilmedi — çünkü **genel** kullanıcı tek kişidir. Bu sayfa özel olarak **"4 tane almak istiyorum" diyen kullanıcıya** odaklandı. Cevap: **bilinçli olarak seçersen doğru araç; viral video etkisiyle alırsan pişmanlık.**`}
      </MarkdownNote>

      <MarkdownNote tone="warning" title="Unutulmaması gereken">
{`- **Elektrik (36 ay)**: 4× 65W yük × 3 sa + 4× 10W idle × 21 sa = 840 Wh/gün = 25.2 kWh/ay × 5 ₺/kWh = **~125 ₺/ay**. Tek M4 Pro **~30 ₺/ay**. Dual 3090 **~685 ₺/ay**.
- **Yaz sıcağı**: 4× mini'nin toplam ısı çıkışı Dual 3090'ın yarısı bile değil. 35°C'de throttle yok. ✅
- **Ses**: 4 tane fansız çalışır (idle), yük altında hafif. Tek M4 Pro veya Studio ile aynı akustik sınıf.
- **Yeniden satış**: Apple ürünlerinin 3 yıl sonraki ikinci el değeri %55-65'ini korur. NVIDIA kartlar aynı dönemde %30-40'ına düşer. Finansal çıkışta avantaj.`}
      </MarkdownNote>
    </div>
  );
}

function VerdictBox({
  title,
  value,
  sub,
  tone,
}: {
  title: string;
  value: string;
  sub: string;
  tone: "primary" | "accent" | "success";
}) {
  const toneClass = {
    primary: "border-primary/40 bg-primary/5",
    accent: "border-accent/40 bg-accent/5",
    success: "border-emerald-500/40 bg-emerald-500/5",
  }[tone];
  return (
    <div className={`rounded-xl border p-4 ${toneClass}`}>
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      <div className="font-semibold leading-tight">{value}</div>
      <div className="mt-1 font-mono text-[11px] text-muted-foreground">
        {sub}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ScaleFromFourToFive — bonus bölüm                                  */
/* ------------------------------------------------------------------ */

function ScaleFromFourToFive() {
  return (
    <div className="space-y-6">
      <DeltaMetricsStrip />

      <BudgetDeltaCard />

      <TopologyDelta />

      <NewModelsUnlocked />

      <PerformanceDelta />

      <MarginalTradeoffCard />

      <ScaleVerdict />
    </div>
  );
}

/* ---- 1) Üst özet şerit ---- */

function DeltaMetricsStrip() {
  const rows = [
    {
      label: "Bütçe",
      from: "~120.000 ₺",
      to: "~148.000 ₺",
      delta: "+28.000 ₺ (%23)",
      tone: "warning" as const,
      sub: "Sadece 1 mini + 1 TB4 kablosu eklenir",
    },
    {
      label: "Toplam unified memory",
      from: "64 GB (4×16)",
      to: "80 GB (5×16)",
      delta: "+16 GB (%25)",
      tone: "success" as const,
      sub: "~50 GB usable (system reserved düşülünce)",
    },
    {
      label: "En büyük sığdırılabilir model",
      from: "Llama 3.3 70B Q4",
      to: "GPT-OSS 120B Q4 (MoE)",
      delta: "~2× parametre",
      tone: "primary" as const,
      sub: "MoE aktif 5B param · hızı ilginç",
    },
    {
      label: "Tek request 70B Q4 TPS",
      from: "3-5 tok/s",
      to: "2-4 tok/s",
      delta: "-%15-20 (daha yavaş!)",
      tone: "danger" as const,
      sub: "Pipeline derinliği ↑ = overhead ↑",
    },
    {
      label: "Multi-request aggregate TPS",
      from: "10-14 tok/s (4 batch)",
      to: "13-17 tok/s (5 batch)",
      delta: "+%20-25",
      tone: "success" as const,
      sub: "Diminishing returns başlar",
    },
    {
      label: "Elektrik (yük)",
      from: "~260 W",
      to: "~325 W",
      delta: "+65 W",
      tone: "warning" as const,
      sub: "Aylık +30 ₺ (3 sa/gün yük)",
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
      {rows.map((r) => (
        <DeltaMetricCard key={r.label} {...r} />
      ))}
    </div>
  );
}

function DeltaMetricCard({
  label,
  from,
  to,
  delta,
  sub,
  tone,
}: {
  label: string;
  from: string;
  to: string;
  delta: string;
  sub: string;
  tone: "primary" | "success" | "warning" | "danger";
}) {
  const toneClass = {
    primary: "border-primary/30 bg-primary/5",
    success: "border-emerald-500/30 bg-emerald-500/5",
    warning: "border-amber-500/30 bg-amber-500/5",
    danger: "border-rose-500/30 bg-rose-500/5",
  }[tone];
  const deltaColor = {
    primary: "text-primary",
    success: "text-emerald-400",
    warning: "text-amber-400",
    danger: "text-rose-400",
  }[tone];
  return (
    <div className={`rounded-xl border p-4 ${toneClass}`}>
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
        <span>{from}</span>
        <span className="text-foreground">→</span>
        <span className="font-semibold text-foreground">{to}</span>
      </div>
      <div className={`mt-2 font-mono text-sm font-bold ${deltaColor}`}>
        {delta}
      </div>
      <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
        {sub}
      </p>
    </div>
  );
}

/* ---- 2) Bütçe delta ---- */

function BudgetDeltaCard() {
  const rows = [
    {
      item: "5. Mac mini M4 16GB",
      cost: "+28.500 ₺",
      note: "Apple TR baz fiyat (güncel kampanyalı)",
    },
    {
      item: "5. Thunderbolt 4 kablo (ring kapatmak için)",
      cost: "+1.200 ₺",
      note: "Ring A↔B↔C↔D↔E↔A = 5 kablo (4 yerine)",
    },
    {
      item: "Ethernet switch port yükü",
      cost: "+0 ₺",
      note: "Mevcut gigabit switch yeter (5-8 port standart)",
    },
    {
      item: "Elektrik (36 ay marjinal)",
      cost: "+1.100 ₺",
      note: "~30 ₺/ay × 36 ay (3 sa/gün yük, 5 ₺/kWh)",
    },
  ];
  const sum = 28_500 + 1_200 + 1_100;
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          Gerçek marjinal maliyet (4 → 5)
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-3 py-2">Eklenen kalem</th>
              <th className="px-3 py-2 text-right">Maliyet</th>
              <th className="px-3 py-2">Not</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.item}
                className="border-b border-border/40 last:border-0"
              >
                <td className="px-3 py-2 font-medium">{r.item}</td>
                <td className="px-3 py-2 text-right font-mono text-xs">
                  {r.cost}
                </td>
                <td className="px-3 py-2 text-[11px] text-muted-foreground">
                  {r.note}
                </td>
              </tr>
            ))}
            <tr className="bg-primary/5 font-semibold">
              <td className="px-3 py-3">Toplam marjinal</td>
              <td className="px-3 py-3 text-right font-mono text-primary">
                +~{sum.toLocaleString("tr-TR")} ₺ (36 ay · elektrik dahil)
              </td>
              <td className="px-3 py-3 text-xs text-muted-foreground">
                Tek seferlik 29.700 ₺ + 3 yıl elektrik
              </td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

/* ---- 3) Topoloji değişim ---- */

function TopologyDelta() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          <Network className="mr-1.5 inline h-4 w-4" />
          Topoloji: 4 node ring vs 5 node ring
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TopologyDiagram
            title="4 node ring (mevcut)"
            nodes={["M1", "M2", "M3", "M4"]}
            cables={4}
            pipelineDepth={4}
            tone="primary"
          />
          <TopologyDiagram
            title="5 node ring (bonus)"
            nodes={["M1", "M2", "M3", "M4", "M5"]}
            cables={5}
            pipelineDepth={5}
            tone="accent"
          />
        </div>
        <MarkdownNote tone="info" title="Port matematiği">
{`Base M4 mini'de **3× TB4 portu** var. Ring topoloji her node'dan **sadece 2 port** kullanır (önceki + sonraki). Yani 5 node ring için donanım engeli yok — hâlâ 1 port boşta (monitör / harici SSD / backup).

**Tam mesh (her node hepsine bağlı) imkansız**: 5 node için her mini 4 komşuya bağlanmalı, port yetmiyor. Ama Exo tam mesh gerektirmiyor; ring yeterli.`}
        </MarkdownNote>
      </CardContent>
    </Card>
  );
}

function TopologyDiagram({
  title,
  nodes,
  cables,
  pipelineDepth,
  tone,
}: {
  title: string;
  nodes: string[];
  cables: number;
  pipelineDepth: number;
  tone: "primary" | "accent";
}) {
  const border =
    tone === "primary"
      ? "border-primary/40 bg-primary/5"
      : "border-accent/40 bg-accent/5";
  const nodeColor =
    tone === "primary"
      ? "border-primary/60 text-primary"
      : "border-accent/60 text-accent-foreground";
  return (
    <div className={`rounded-xl border p-4 ${border}`}>
      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {nodes.map((n, i) => (
          <div key={n} className="flex items-center gap-2">
            <span
              className={`inline-flex h-8 w-8 items-center justify-center rounded-full border bg-secondary/50 font-mono text-[11px] font-semibold ${nodeColor}`}
            >
              {n}
            </span>
            {i < nodes.length - 1 && (
              <Cable className="h-3 w-3 text-muted-foreground" />
            )}
          </div>
        ))}
        <Cable className="h-3 w-3 text-muted-foreground" />
        <span className="text-[10px] font-mono text-muted-foreground">
          ↩ M1
        </span>
      </div>
      <dl className="mt-4 space-y-1 text-xs">
        <div className="flex justify-between border-b border-border/30 pb-1">
          <dt className="text-muted-foreground">TB4 kablo</dt>
          <dd className="font-mono">{cables}</dd>
        </div>
        <div className="flex justify-between border-b border-border/30 pb-1">
          <dt className="text-muted-foreground">Pipeline derinliği</dt>
          <dd className="font-mono">{pipelineDepth} shard</dd>
        </div>
        <div className="flex justify-between border-b border-border/30 pb-1">
          <dt className="text-muted-foreground">Her node TB4 port kullanımı</dt>
          <dd className="font-mono">2 / 3</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Tek node arızası</dt>
          <dd className="font-mono text-rose-400">Tüm pipeline durur</dd>
        </div>
      </dl>
    </div>
  );
}

/* ---- 4) Yeni erişilen modeller ---- */

function NewModelsUnlocked() {
  const rows = [
    {
      name: "GPT-OSS 120B Q4 (MoE)",
      size: "~60 GB",
      activeParams: "~5B aktif",
      tps: "8-14 tok/s",
      note: "EN BÜYÜK KAZANÇ: MoE sparse aktivasyon, cluster için ideal. Token başına sadece 5B param aktif → ağ yükü düşük.",
      priority: "unlock" as const,
    },
    {
      name: "Mixtral 8x22B Q4 (MoE)",
      size: "~80 GB",
      activeParams: "~39B aktif",
      tps: "—",
      note: "Sınırda. 50 GB usable'a sığmıyor ama Q3_K_M quant ile (~58 GB) denenebilir. Kalite düşer.",
      priority: "tight" as const,
    },
    {
      name: "Llama 3.3 70B Q5_K_M",
      size: "~49 GB",
      activeParams: "70B dense",
      tps: "3-4 tok/s",
      note: "4 node'da Q5 mümkün değildi (49 GB > 40 GB). 5 node ile kalite artışı +%5-8 benchmark puanı.",
      priority: "quality" as const,
    },
    {
      name: "Llama 3.3 70B Q6_K",
      size: "~58 GB",
      activeParams: "70B dense",
      tps: "—",
      note: "Hâlâ sınırda. 50 GB usable'a sığmıyor, KV-cache çok dar. 6 node gerekli.",
      priority: "tight" as const,
    },
    {
      name: "Qwen3 72B Q5_K_M",
      size: "~51 GB",
      activeParams: "72B dense",
      tps: "3-4 tok/s",
      note: "Matematik + çok dilli kalite. 4 node'da Q4 zorlar, 5 node'da Q5 rahat.",
      priority: "quality" as const,
    },
    {
      name: "Llama 3.1 405B Q4",
      size: "~225 GB",
      activeParams: "405B dense",
      tps: "—",
      note: "5 node'da da imkansız. 14+ mini gerekli (orijinal Exo viral demo'su).",
      priority: "impossible" as const,
    },
  ];
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          5. mini ile hangi modeller "açılır"?
        </CardTitle>
        <div className="text-xs text-muted-foreground">
          Usable memory: 40 GB → 50 GB · KV-cache için ek 10 GB
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-3 py-2">Model</th>
              <th className="px-3 py-2 text-right">Boyut</th>
              <th className="px-3 py-2 text-right">Aktif param</th>
              <th className="px-3 py-2 text-right">Tek req. TPS</th>
              <th className="px-3 py-2">Değişim / not</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.name}
                className="border-b border-border/40 last:border-0"
              >
                <td className="px-3 py-2 font-medium">
                  <UnlockBadge priority={r.priority} /> {r.name}
                </td>
                <td className="px-3 py-2 text-right font-mono text-xs text-muted-foreground">
                  {r.size}
                </td>
                <td className="px-3 py-2 text-right font-mono text-xs">
                  {r.activeParams}
                </td>
                <td className="px-3 py-2 text-right font-mono text-xs">
                  {r.tps}
                </td>
                <td className="px-3 py-2 text-[11px] text-muted-foreground">
                  {r.note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function UnlockBadge({
  priority,
}: {
  priority: "unlock" | "tight" | "quality" | "impossible";
}) {
  if (priority === "unlock") {
    return (
      <Badge
        variant="outline"
        className="mr-1 border-emerald-500/50 text-emerald-400"
      >
        ★ YENİ
      </Badge>
    );
  }
  if (priority === "quality") {
    return (
      <Badge
        variant="outline"
        className="mr-1 border-primary/50 text-primary"
      >
        +Kalite
      </Badge>
    );
  }
  if (priority === "tight") {
    return (
      <Badge
        variant="outline"
        className="mr-1 border-amber-500/50 text-amber-400"
      >
        ⚠ Sınır
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="mr-1 border-rose-500/50 text-rose-400"
    >
      ✗
    </Badge>
  );
}

/* ---- 5) Performans değişimi ---- */

function PerformanceDelta() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          <Gauge className="mr-1.5 inline h-4 w-4" />
          Performans değişimi — 4 node vs 5 node
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-3 py-2">Senaryo</th>
                <th className="px-3 py-2 text-right">4 node</th>
                <th className="px-3 py-2 text-right">5 node</th>
                <th className="px-3 py-2 text-right">Δ</th>
                <th className="px-3 py-2">Sebep</th>
              </tr>
            </thead>
            <tbody>
              <PerfRow
                scenario="8B model · tek request"
                four="25-35"
                five="20-30"
                delta="-%15"
                reason="Cluster her zaman overhead ekler; küçük model tek mini'de kalmalı"
                direction="down"
              />
              <PerfRow
                scenario="32B Q4 · tek request"
                four="7-10"
                five="6-9"
                delta="-%10"
                reason="Pipeline derinliği ↑ → activation pass'leri ↑"
                direction="down"
              />
              <PerfRow
                scenario="70B Q4 · tek request"
                four="3-5"
                five="2-4"
                delta="-%15-20"
                reason="Her shard'a daha az katman, ama her katman arası TB4 geçişi var"
                direction="down"
              />
              <PerfRow
                scenario="70B Q4 · multi-request (pipeline dolu)"
                four="10-14"
                five="13-17"
                delta="+%20-25"
                reason="Paralel 5 request pipeline'ı dolu tutar, her node sürekli çalışır"
                direction="up"
                highlight
              />
              <PerfRow
                scenario="GPT-OSS 120B MoE · tek request"
                four="— (sığmaz)"
                five="8-14"
                delta="YENİ"
                reason="MoE aktif 5B param → ağ yükü düşük, cluster için ideal model"
                direction="unlock"
                highlight
              />
              <PerfRow
                scenario="Prompt-eval (TTFT · 2K token)"
                four="20-30 sn"
                five="25-35 sn"
                delta="-%20"
                reason="Prompt tüm pipeline'dan 1 kez geçer; daha fazla hop"
                direction="down"
              />
              <PerfRow
                scenario="Context penceresi (KV-cache)"
                four="4-8K"
                five="8-16K"
                delta="+%100"
                reason="Artan bellekle KV-cache rahatlar; uzun context mümkün"
                direction="up"
                highlight
              />
            </tbody>
          </table>
        </div>

        <MarkdownNote tone="warning" title="Karşı-sezgisel ama kritik">
{`**5. mini tek request'te 4 mini'den YAVAŞ.** Exo day-1 verisi bu trendi doğruluyor (1x=49.3, 2x=44.4, 3x=39.7 → ekstrapolasyon 4x≈35, 5x≈31).

Mantık: Pipeline parallel'de tek request tek seferde 1 shard'dan diğerine geçer. Daha fazla shard = daha fazla ağ geçişi = daha fazla latency. Her TB4 hop ~10 µs + activation serialization ~50 µs = 1 katman geçişi ~60 µs; 80 katmanlı 70B için 4 shard'da ~15 hop, 5 shard'da ~20 hop = **+300 µs/token**.`}
        </MarkdownNote>
      </CardContent>
    </Card>
  );
}

function PerfRow({
  scenario,
  four,
  five,
  delta,
  reason,
  direction,
  highlight,
}: {
  scenario: string;
  four: string;
  five: string;
  delta: string;
  reason: string;
  direction: "up" | "down" | "unlock";
  highlight?: boolean;
}) {
  const deltaColor = {
    up: "text-emerald-400",
    down: "text-rose-400",
    unlock: "text-primary",
  }[direction];
  return (
    <tr
      className={`border-b border-border/40 last:border-0 ${highlight ? "bg-primary/5" : ""}`}
    >
      <td className="px-3 py-2 font-medium">{scenario}</td>
      <td className="px-3 py-2 text-right font-mono text-xs text-muted-foreground">
        {four}
      </td>
      <td className="px-3 py-2 text-right font-mono text-xs">{five}</td>
      <td className={`px-3 py-2 text-right font-mono text-xs ${deltaColor}`}>
        {delta}
      </td>
      <td className="px-3 py-2 text-[11px] text-muted-foreground">{reason}</td>
    </tr>
  );
}

/* ---- 6) Marjinal getiri matrisi ---- */

function MarginalTradeoffCard() {
  const items = [
    {
      title: "MoE büyük modelleri (120B) açılır",
      tone: "good" as const,
      detail:
        "GPT-OSS 120B Q4 sığar. MoE aktif params düşük olduğu için cluster'da hızlı (8-14 tok/s). Yerel olarak 120B sınıf modeli çalıştırabilmek büyük niş.",
    },
    {
      title: "70B'de kalite upgrade (Q4 → Q5)",
      tone: "good" as const,
      detail:
        "Q5_K_M quantization benchmark'larda Q4'ten %5-8 daha iyi. Hassas görevlerde (matematik, kod) fark edilebilir.",
    },
    {
      title: "Uzun context (4K → 16K)",
      tone: "good" as const,
      detail:
        "5 node'un ekstra 10 GB'ı çoğunlukla KV-cache'e gider. Uzun RAG chunk'ları, tüm kod dosyası, 50 sayfa PDF analizi mümkün.",
    },
    {
      title: "Tek request performans kaybı",
      tone: "bad" as const,
      detail:
        "Mevcut 70B TPS'i zaten sınırda (3-5), 5 node ile 2-4'e düşer. Bir kullanıcı tek chat yaparken fark edilebilir yavaşlık.",
    },
    {
      title: "Setup karmaşıklığı +%25",
      tone: "bad" as const,
      detail:
        "5 adet macOS kurulumu, güvenlik yaması, 5 adet Apple ID, 5 uzak SSH, 5 disk bakımı. Zaman maliyeti gerçek.",
    },
    {
      title: "Kırılganlık artışı",
      tone: "bad" as const,
      detail:
        "Ring topolojide 1 node düşerse tüm pipeline durur. 5 node'da arıza olasılığı 4'e göre %25 daha yüksek (basit istatistik).",
    },
    {
      title: "Üretim ortamı hâlâ uygun değil",
      tone: "neutral" as const,
      detail:
        "5 node olsa bile Exo hot-failover yok (2026-Q1). Ciddi iş yükü için hâlâ hobi/deney sınıfı.",
    },
    {
      title: "Fiziksel yerleşim",
      tone: "neutral" as const,
      detail:
        "5 mini yan yana hava akımı için ~60 cm masa alanı gerekir. Basit ama planlamak gerek.",
    },
  ];
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          28.000 ₺ ek maliyetin gerçek faturası
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {items.map((i) => (
          <TradeoffRow key={i.title} {...i} />
        ))}
      </CardContent>
    </Card>
  );
}

function TradeoffRow({
  title,
  detail,
  tone,
}: {
  title: string;
  detail: string;
  tone: "good" | "bad" | "neutral";
}) {
  const config = {
    good: {
      border: "border-emerald-500/30 bg-emerald-500/5",
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
    },
    bad: {
      border: "border-rose-500/30 bg-rose-500/5",
      icon: <XCircle className="h-4 w-4 text-rose-400" />,
    },
    neutral: {
      border: "border-border/60 bg-secondary/30",
      icon: <TriangleAlert className="h-4 w-4 text-muted-foreground" />,
    },
  }[tone];
  return (
    <div className={`rounded-lg border p-3 ${config.border}`}>
      <div className="mb-1 flex items-center gap-2 text-sm font-medium">
        {config.icon}
        <span>{title}</span>
      </div>
      <p className="text-[11px] leading-snug text-muted-foreground">{detail}</p>
    </div>
  );
}

/* ---- 7) Karar ---- */

function ScaleVerdict() {
  return (
    <Card className="border-accent/40 bg-gradient-to-br from-accent/10 via-transparent to-primary/5">
      <CardHeader>
        <CardTitle className="text-lg">
          Karar: 28.000 ₺'yi 5. mini'ye mi koymalı?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-relaxed">
        <p>
          <span className="font-semibold text-foreground">
            Sadece şu iki durum için 5. mini'yi ekle:
          </span>
        </p>
        <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">
              GPT-OSS 120B yerel çalıştırmak istiyorsun
            </span>{" "}
            — mahremiyet gerekçesiyle MoE sınıfı bir modele erişim. 5 node bu
            modelin tek-makineye-sığmayan yerel versiyonu için <em>giriş bileti</em>.
          </li>
          <li>
            <span className="font-medium text-foreground">
              RAG / kod asistanı için uzun context kritik
            </span>{" "}
            — 50+ sayfa belgeleri tek seferde işleyeceksen KV-cache
            alanı kazandırır. Q5 quantization + 16K context avantajı anlam
            kazanır.
          </li>
        </ol>

        <p>
          <span className="font-semibold text-foreground">
            Diğer tüm durumlarda 28.000 ₺'yi daha iyi yerlere koy:
          </span>
        </p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <AltSpendCard
            title="Mevcut mini'leri upgrade et"
            amount="+28K ₺"
            plan="Her mini'yi 32 GB'a çıkar (4 × +7K). Asimetrik değil simetrik upgrade; toplam 128 GB → Llama 70B Q5 + 32K context rahat."
            tone="primary"
          />
          <AltSpendCard
            title="Cloud API kredisi"
            amount="28K ₺ = ~$620"
            plan="DeepSeek V3.1 ile ~80 milyon token. Günde 500K kullanırsan 160 gün ücretsiz kullanım. 5 yıla yayarsan 'hiç cloud bitmez'."
            tone="accent"
          />
          <AltSpendCard
            title="Dual 3090 PC'ye geçiş"
            amount="Üstüne +85-90K ₺"
            plan="4 mini'yi sat (~%55 değer korunur = ~63K ₺), üstüne ~87K ₺ ekle, ~150K ₺'lık Dual 3090 DIY kur. Fine-tune + 2-3× hız + CUDA ekosistemi (ses/ısı pahalına)."
            tone="success"
          />
        </div>

        <MarkdownNote tone="insight" title="Ölçeklendirme prensibi">
{`**4 → 5 mini geçişi lineer getiri değil, hiperbolik azalım.** İlk mini'nin getirisi (tek cihaz kurmak) en büyük, 2. mini cluster kurmayı açar, 3-4. mini 70B'yi mümkün kılar. 5. mini ise 120B MoE'yi açar ama her ek mini'nin marjinal değeri azalır.

**Tavsiye**: Eğer 148K ₺'n varsa baştan bu bütçeyle değerlendir. Ama **önce 4 mini al, 6 ay çalıştır, sonra gerçek ihtiyacın varsa 5.'yi ekle.** Modüler sistemin tek avantajı budur.`}
        </MarkdownNote>
      </CardContent>
    </Card>
  );
}

function AltSpendCard({
  title,
  amount,
  plan,
  tone,
}: {
  title: string;
  amount: string;
  plan: string;
  tone: "primary" | "accent" | "success";
}) {
  const toneClass = {
    primary: "border-primary/40 bg-primary/5",
    accent: "border-accent/40 bg-accent/5",
    success: "border-emerald-500/40 bg-emerald-500/5",
  }[tone];
  const amountColor = {
    primary: "text-primary",
    accent: "text-accent-foreground",
    success: "text-emerald-400",
  }[tone];
  return (
    <div className={`rounded-xl border p-4 ${toneClass}`}>
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      <div className={`mb-2 font-mono text-sm font-bold ${amountColor}`}>
        {amount}
      </div>
      <p className="text-[11px] leading-snug text-muted-foreground">{plan}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ThunderboltFiveScenario — TB5 hayali senaryosu                     */
/* ------------------------------------------------------------------ */

function ThunderboltFiveScenario() {
  return (
    <div className="space-y-6">
      <TB5TrapCallout />

      <TB5SpecCompare />

      <TB5BottleneckAnalysis />

      <TB5PerformanceDelta />

      <TB5HardwareRealities />

      <TB5VerdictCard />
    </div>
  );
}

/* ---- 1) Erken uyarı: temel tuzak ---- */

function TB5TrapCallout() {
  return (
    <Card className="border-rose-500/40 bg-rose-500/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          <TriangleAlert className="mr-1.5 inline h-4 w-4 text-rose-400" />
          Önce kritik gerçek: base M4 mini'de TB5 yok
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p>
          TB5 varsayımının tuzağı: M4 base mini (16GB/24GB, ~28K ₺) hâlâ{" "}
          <span className="font-semibold text-foreground">2× Thunderbolt 4</span>{" "}
          ile geliyor. TB5 donanım olarak sadece şu Apple ürünlerinde var:
        </p>
        <ul className="ml-4 list-disc space-y-1 text-[13px]">
          <li>
            <span className="font-mono text-foreground">M4 Pro Mac mini</span>{" "}
            (3× TB5) — ~45.000 ₺'den başlar
          </li>
          <li>
            <span className="font-mono text-foreground">M4 Max / M3 Ultra Mac Studio</span>{" "}
            (6× TB5)
          </li>
          <li>
            <span className="font-mono text-foreground">M4 Max / M4 Pro MacBook Pro</span>
          </li>
        </ul>
        <p className="pt-1">
          Yani "TB5 olsaydı" senaryosu teknik olarak "M4 Pro mini'ye yükseltsek"
          senaryosu ile aynı şey. Aşağıdaki analizler bu iki soruya birlikte cevap
          veriyor.
        </p>
      </CardContent>
    </Card>
  );
}

/* ---- 2) Spec karşılaştırma ---- */

function TB5SpecCompare() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          <Cable className="mr-1.5 inline h-4 w-4" />
          TB4 vs TB5 — çıplak spec farkı
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-3 py-2">Özellik</th>
                <th className="px-3 py-2 text-right">Thunderbolt 4</th>
                <th className="px-3 py-2 text-right">Thunderbolt 5</th>
                <th className="px-3 py-2 text-right">Δ</th>
              </tr>
            </thead>
            <tbody>
              <TB5SpecRow
                label="Çift yönlü bant genişliği"
                tb4="40 Gbps (sym.)"
                tb5="80 Gbps (sym.)"
                delta="2×"
                highlight
              />
              <TB5SpecRow
                label="Display boost modu"
                tb4="—"
                tb5="120 Gbps (asym.)"
                delta="3×"
              />
              <TB5SpecRow
                label="Veri için pratik throughput"
                tb4="~3.5 GB/s"
                tb5="~7 GB/s"
                delta="2×"
                highlight
              />
              <TB5SpecRow
                label="Hop latency (node-to-node)"
                tb4="~1-2 µs"
                tb5="~1-2 µs"
                delta="Aynı"
              />
              <TB5SpecRow
                label="PCIe bridge"
                tb4="PCIe 3.0 ×4"
                tb5="PCIe 4.0 ×4"
                delta="2×"
              />
              <TB5SpecRow
                label="Güç iletimi (PD)"
                tb4="100 W"
                tb5="240 W"
                delta="2.4×"
              />
              <TB5SpecRow
                label="Kablo uzunluk (pasif)"
                tb4="2 m / 40 Gbps"
                tb5="1 m / 80 Gbps"
                delta="Daha kısa"
              />
              <TB5SpecRow
                label="Geriye uyumluluk"
                tb4="USB4, TB3"
                tb5="TB4, USB4 v2, TB3"
                delta="Üst küme"
              />
              <TB5SpecRow
                label="Base M4 mini'de var mı?"
                tb4="✓ 2 port"
                tb5="✗ (donanım yok)"
                delta="Tuzak"
              />
            </tbody>
          </table>
        </div>
        <MarkdownNote tone="info" title="Latency'nin değişmemesi önemli">
{`LLM inference'ta **bant genişliği** ile **latency** iki farklı darboğaz. TB5'in ana getirisi bant genişliği (büyük veri hızlı geçer), latency'de anlamlı fark yok. Yani token-başına küçük activation geçişinde (~32 KB) fark ~%50 hızlanma, ama prefill'deki büyük prompt-activation transferinde (~32 MB) fark gerçekten ~2×.`}
        </MarkdownNote>
      </CardContent>
    </Card>
  );
}

function TB5SpecRow({
  label,
  tb4,
  tb5,
  delta,
  highlight,
}: {
  label: string;
  tb4: string;
  tb5: string;
  delta: string;
  highlight?: boolean;
}) {
  return (
    <tr
      className={`border-b border-border/40 last:border-0 ${highlight ? "bg-primary/5" : ""}`}
    >
      <td className="px-3 py-2 font-medium">{label}</td>
      <td className="px-3 py-2 text-right font-mono text-xs text-muted-foreground">
        {tb4}
      </td>
      <td className="px-3 py-2 text-right font-mono text-xs">{tb5}</td>
      <td
        className={`px-3 py-2 text-right font-mono text-xs ${highlight ? "text-primary" : "text-muted-foreground"}`}
      >
        {delta}
      </td>
    </tr>
  );
}

/* ---- 3) Darboğaz analizi ---- */

function TB5BottleneckAnalysis() {
  const stages = [
    {
      stage: "Token üretim (decode)",
      perToken: "~32 KB / katman geçişi",
      tb4Time: "~1 µs (hop latency baskın)",
      tb5Time: "~1 µs",
      impact: "Minimum",
      tone: "neutral" as const,
      explain:
        "Tek token decode'da küçük activation geçiyor. Latency-bound. TB5 bant genişliğini kullanamıyor.",
    },
    {
      stage: "Prompt evaluation (prefill · 2K token)",
      perToken: "~32 MB / katman geçişi",
      tb4Time: "~6-8 ms / hop",
      tb5Time: "~3-4 ms / hop",
      impact: "Yüksek (TTFT ~%40 düşer)",
      tone: "strong" as const,
      explain:
        "Büyük prompt'ta tüm token'ların activation'ı aynı anda geçer. Bant genişliği darboğazı. TB5 burada parlıyor.",
    },
    {
      stage: "Multi-request batched decode",
      perToken: "~128-256 KB (batch × 32 KB)",
      tb4Time: "~40-80 µs / hop",
      tb5Time: "~20-40 µs / hop",
      impact: "Orta (~%15-20 hızlanma)",
      tone: "medium" as const,
      explain:
        "4 paralel istek → activation 4× büyür. TB4 sınırda çalışır, TB5 rahat.",
    },
    {
      stage: "Tensor parallel all-reduce",
      perToken: "~5 MB / token (70B)",
      tb4Time: "~1.4 ms",
      tb5Time: "~700 µs",
      impact: "Kritik (TP'yi mümkün kılar)",
      tone: "strong" as const,
      explain:
        "TB4'te tensor parallelism pratik değil, pipeline zorunlu. TB5'te 2-way TP + 2-way PP hybrid mümkün hale gelir.",
    },
    {
      stage: "Model yükleme (soğuk başlatma)",
      perToken: "40-60 GB toplam",
      tb4Time: "~3-4 dk",
      tb5Time: "~1.5-2 dk",
      impact: "Orta (tek seferlik)",
      tone: "medium" as const,
      explain:
        "Shard'ların ilk dağıtımı. Kullanıcı sadece 1 kere yaşar ama test döngüsünde hissedilir.",
    },
  ];
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          <Layers className="mr-1.5 inline h-4 w-4" />
          Bant genişliği nerede gerçekten önemli?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-3 py-2">Aşama</th>
                <th className="px-3 py-2 text-right">Veri / geçiş</th>
                <th className="px-3 py-2 text-right">TB4</th>
                <th className="px-3 py-2 text-right">TB5</th>
                <th className="px-3 py-2">Etki</th>
              </tr>
            </thead>
            <tbody>
              {stages.map((s) => (
                <tr
                  key={s.stage}
                  className={`border-b border-border/40 last:border-0 ${s.tone === "strong" ? "bg-emerald-500/5" : s.tone === "medium" ? "bg-primary/5" : ""}`}
                >
                  <td className="px-3 py-2 font-medium">{s.stage}</td>
                  <td className="px-3 py-2 text-right font-mono text-[11px] text-muted-foreground">
                    {s.perToken}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-xs text-muted-foreground">
                    {s.tb4Time}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-xs">
                    {s.tb5Time}
                  </td>
                  <td className="px-3 py-2 text-[11px]">
                    <span className="font-semibold">{s.impact}</span>
                    <div className="mt-0.5 text-muted-foreground">
                      {s.explain}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <MarkdownNote tone="insight" title="Darboğaz profili">
{`**70B tek-kullanıcı sohbet**, token-başına küçük activation geçişi yapar ve esas yavaşlık GPU compute'tadır. TB5 burada **%5-10 civarı marjinal** fayda sağlar.

**Prefill (TTFT)** ve **tensor parallelism** senaryolarında ise TB5 oyunun kurallarını değiştirir. Büyük prompt RAG, uzun context, kod analizi kullanım senaryolarında fark **~2×** seviyesine çıkar.`}
        </MarkdownNote>
      </CardContent>
    </Card>
  );
}

/* ---- 4) Performans delta (TB4 → TB5) ---- */

function TB5PerformanceDelta() {
  const rows = [
    {
      scenario: "70B Q4 · tek request token gen",
      tb4: "3-5 tok/s",
      tb5: "4-6 tok/s",
      gain: "+%10-20",
      tone: "mild" as const,
    },
    {
      scenario: "70B Q4 · prompt-eval (2K token)",
      tb4: "20-30 sn",
      tb5: "12-18 sn",
      gain: "+%40",
      tone: "strong" as const,
    },
    {
      scenario: "70B Q4 · multi-request (4 paralel)",
      tb4: "10-14 tok/s",
      tb5: "14-20 tok/s",
      gain: "+%30-40",
      tone: "strong" as const,
    },
    {
      scenario: "GPT-OSS 120B MoE · tek request",
      tb4: "(sığmaz / sınırda)",
      tb5: "10-16 tok/s",
      gain: "Unlock",
      tone: "strong" as const,
    },
    {
      scenario: "32B Q4 · tek request",
      tb4: "7-10 tok/s",
      tb5: "8-11 tok/s",
      gain: "+%10",
      tone: "mild" as const,
    },
    {
      scenario: "8B · tek request",
      tb4: "25-35 tok/s",
      tb5: "26-36 tok/s",
      gain: "~0",
      tone: "none" as const,
    },
    {
      scenario: "Model yükleme (cold boot)",
      tb4: "~3-4 dk",
      tb5: "~1.5-2 dk",
      gain: "+%50",
      tone: "mild" as const,
    },
    {
      scenario: "Tensor parallel (2×TP + 2×PP)",
      tb4: "(pratik değil)",
      tb5: "~6-9 tok/s",
      gain: "Unlock",
      tone: "strong" as const,
    },
  ];
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          <Gauge className="mr-1.5 inline h-4 w-4" />
          Performans projeksiyonu — 4 node cluster
        </CardTitle>
        <div className="text-xs text-muted-foreground">
          Aynı 4 node konfigürasyonda sadece interconnect TB4 → TB5 değişirse
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-3 py-2">Senaryo</th>
                <th className="px-3 py-2 text-right">TB4 (mevcut)</th>
                <th className="px-3 py-2 text-right">TB5 (varsayım)</th>
                <th className="px-3 py-2 text-right">Kazanım</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <TB5PerfRow key={r.scenario} {...r} />
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function TB5PerfRow({
  scenario,
  tb4,
  tb5,
  gain,
  tone,
}: {
  scenario: string;
  tb4: string;
  tb5: string;
  gain: string;
  tone: "strong" | "mild" | "none";
}) {
  const gainColor = {
    strong: "text-emerald-400",
    mild: "text-primary",
    none: "text-muted-foreground",
  }[tone];
  const rowBg = tone === "strong" ? "bg-emerald-500/5" : "";
  return (
    <tr className={`border-b border-border/40 last:border-0 ${rowBg}`}>
      <td className="px-3 py-2 font-medium">{scenario}</td>
      <td className="px-3 py-2 text-right font-mono text-xs text-muted-foreground">
        {tb4}
      </td>
      <td className="px-3 py-2 text-right font-mono text-xs">{tb5}</td>
      <td
        className={`px-3 py-2 text-right font-mono text-xs font-semibold ${gainColor}`}
      >
        {gain}
      </td>
    </tr>
  );
}

/* ---- 5) Donanım gerçekliği — TB5 için ne almalı ---- */

function TB5HardwareRealities() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          TB5'e geçmek için gereken donanım yükseltmesi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <TB5HardwareOption
            tone="base"
            title="Mevcut durum"
            spec="4× M4 base mini 16GB"
            port="2× TB4 per node"
            cost="~120.000 ₺"
            memory="64 GB (40 usable)"
            verdict="TB5 yok. Pipeline parallel çalışır, prefill yavaş."
          />
          <TB5HardwareOption
            tone="upgrade"
            title="Minimum TB5 yükseltmesi"
            spec="4× M4 Pro mini 24GB"
            port="3× TB5 per node"
            cost="~180.000 ₺ (+60K)"
            memory="96 GB (~72 usable)"
            verdict="TB5 açılır. Memory +%80, GPU core 10→20, prefill 2× hızlanır."
            recommended
          />
          <TB5HardwareOption
            tone="premium"
            title="Cluster için ideal"
            spec="4× M4 Pro mini 64GB"
            port="3× TB5 per node"
            cost="~320.000 ₺"
            memory="256 GB (~200 usable)"
            verdict="405B bile sığar. Ama bu noktada 1× M3 Ultra Studio (256GB) daha mantıklı (~220K ₺)."
          />
        </div>

        <MarkdownNote tone="warning" title="Yükseltmenin gerçek marjinal maliyeti">
{`**4× M4 base mini → 4× M4 Pro mini 24GB**: +60.000 ₺.

Bu paranın karşılığında sadece TB5 almıyorsun; paket halinde şunlar geliyor:
- **+32 GB unified memory** (64 → 96 GB, KV-cache ve daha kaliteli quant için)
- **2× GPU core** sayısı (10 → 20 per node, token/sn doğrudan etkilenir)
- **+40% CPU core** (10 → 14 per node)
- **+50% memory bandwidth** (120 GB/s → 273 GB/s per node — LLM için en kritik spec)

Yani TB5 için 60K ₺ ödemiyorsun; **genel donanım tier'ı yükseltmesi** için ödüyorsun. TB5 bu paketin ~%15'i kadar katkı sağlar; gerçek sıçramanın %85'i memory bandwidth ve GPU core'dan geliyor.`}
        </MarkdownNote>
      </CardContent>
    </Card>
  );
}

function TB5HardwareOption({
  tone,
  title,
  spec,
  port,
  cost,
  memory,
  verdict,
  recommended,
}: {
  tone: "base" | "upgrade" | "premium";
  title: string;
  spec: string;
  port: string;
  cost: string;
  memory: string;
  verdict: string;
  recommended?: boolean;
}) {
  const border = {
    base: "border-border/60 bg-secondary/30",
    upgrade: "border-emerald-500/40 bg-emerald-500/5",
    premium: "border-accent/40 bg-accent/5",
  }[tone];
  return (
    <div className={`relative rounded-xl border p-4 ${border}`}>
      {recommended && (
        <Badge
          variant="outline"
          className="absolute -top-2 right-3 border-emerald-500/50 bg-background text-emerald-400"
        >
          ★ Sweet spot
        </Badge>
      )}
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      <div className="font-semibold leading-tight">{spec}</div>
      <dl className="mt-3 space-y-1.5 text-xs">
        <div className="flex justify-between border-b border-border/30 pb-1">
          <dt className="text-muted-foreground">Port</dt>
          <dd className="font-mono text-[11px]">{port}</dd>
        </div>
        <div className="flex justify-between border-b border-border/30 pb-1">
          <dt className="text-muted-foreground">Bellek</dt>
          <dd className="font-mono text-[11px]">{memory}</dd>
        </div>
        <div className="flex justify-between border-b border-border/30 pb-1">
          <dt className="text-muted-foreground">Maliyet</dt>
          <dd className="font-mono text-[11px] font-semibold">{cost}</dd>
        </div>
      </dl>
      <p className="mt-3 text-[11px] leading-snug text-muted-foreground">
        {verdict}
      </p>
    </div>
  );
}

/* ---- 6) Karar ---- */

function TB5VerdictCard() {
  return (
    <Card className="border-primary/40 bg-gradient-to-br from-primary/10 via-transparent to-accent/5">
      <CardHeader>
        <CardTitle className="text-lg">
          Karar: TB5 için 60.000 ₺ ek ödemeye değer mi?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-relaxed">
        <p>
          <span className="font-semibold text-foreground">
            "Aynı 4 node, sadece TB4 → TB5" saf senaryosu imkansız.
          </span>{" "}
          Apple bu ayrımı donanım tier'ı olarak yapıyor. Dolayısıyla soru aslında
          şu: <em>M4 base mini yerine M4 Pro mini alayım mı?</em>
        </p>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <VerdictColumn
            tone="good"
            title="M4 Pro mini cluster'a geç, eğer…"
            items={[
              "Prefill / TTFT en kritik metrik ise (RAG, uzun context, kod analizi)",
              "Multi-request aggregate throughput'a ihtiyacın varsa (ekip, servis)",
              "GPT-OSS 120B MoE gibi büyük modelleri stabil çalıştırmak istiyorsan",
              "Cluster'ı 3+ yıl kullanmayı planlıyorsan (amortisman uzar)",
              "Memory bandwidth darboğazın canını sıkıyorsa (en önemli sebep)",
            ]}
          />
          <VerdictColumn
            tone="bad"
            title="TB5'e zıplama, eğer…"
            items={[
              "Kullanım çoğunlukla tek-kullanıcı sohbet ise (TB5 etkisi %10'un altında)",
              "Bütçe 150K ₺'yi aşamıyorsa (M4 Pro cluster 180K ₺'ye dayanıyor)",
              "Mac Studio M3 Ultra (256GB, ~220K ₺) aynı bütçeye yakın ve daha güçlü",
              "Dual RTX 3090 PC (~150K ₺ DIY) fine-tune'u önemsediğin durumda daha iyi",
              "Bu bir 'öğrenme / deney' projesi ise (4× base mini ile başlayıp öğren, sonra karar ver)",
            ]}
          />
        </div>

        <MarkdownNote tone="insight" title="Dashboard pozisyonu">
{`**TB5 lüks değil, bir eşik geçişi**. O eşik prefill ve memory bandwidth. Eğer uzun prompt işleyeceksen, multi-user servis kuracaksan veya 120B MoE yerel çalıştırmak istiyorsan, TB5'in dahil olduğu M4 Pro mini cluster'ına yükselme **gerçekten faydalı**.

Ama ev kullanıcısı, tek sohbet senaryosunda fark ~%10-15 seviyesinde. Bu fark için ekstra 60.000 ₺ vermek finansal olarak verimsiz. Aynı parayla **3 ay cloud API kullanımı + fine-tune kredi + M4 base cluster** beraber alınabilir.

**Pratik yol**: 4× M4 base mini ile başla, 6 ay çalıştır, darboğazı deneyimle. Eğer prefill / bandwidth kesen durumlar yaşıyorsan o zaman M4 Pro upgrade'ine geç — mevcut mini'leri sat (%55 değer korunur, ~63K ₺), üstüne 117K ₺ ekle, M4 Pro cluster kur.`}
        </MarkdownNote>
      </CardContent>
    </Card>
  );
}

function VerdictColumn({
  tone,
  title,
  items,
}: {
  tone: "good" | "bad";
  title: string;
  items: string[];
}) {
  const config =
    tone === "good"
      ? {
          border: "border-emerald-500/30 bg-emerald-500/5",
          icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
          titleColor: "text-emerald-400",
        }
      : {
          border: "border-rose-500/30 bg-rose-500/5",
          icon: <XCircle className="h-4 w-4 text-rose-400" />,
          titleColor: "text-rose-400",
        };
  return (
    <div className={`rounded-xl border p-4 ${config.border}`}>
      <div
        className={`mb-3 flex items-center gap-2 text-sm font-semibold ${config.titleColor}`}
      >
        {config.icon}
        {title}
      </div>
      <ul className="space-y-1.5 text-[13px] text-muted-foreground">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-foreground">·</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* StorageAnalysis — SSD kapasite + hız senaryosu                     */
/* ------------------------------------------------------------------ */

function StorageAnalysis() {
  return (
    <div className="space-y-6">
      <SSDSpeedTrapCallout />

      <StorageNeedsBreakdown />

      <AppleStorageUpgradeTable />

      <StorageScenarioMatrix />

      <AsymmetricVsSymmetric />

      <ExternalSSDOption />

      <StorageVerdict />
    </div>
  );
}

/* ---- 1) Kritik uyarı: 256GB SSD hız tuzağı ---- */

function SSDSpeedTrapCallout() {
  return (
    <Card className="border-rose-500/40 bg-rose-500/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          <TriangleAlert className="mr-1.5 inline h-4 w-4 text-rose-400" />
          Önce bilinmesi gereken: M4 mini 256GB SSD ~%50 daha yavaş
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="text-muted-foreground">
          Apple base M4 mini'de 256GB SSD'yi tek NAND chip ile üretiyor; 512GB+ modeller
          çift chip ile interleaved okuma yapıyor. Pratik sonuç (Blackmagic Disk Speed
          Test, BlackLotusLabs, 9to5Mac benchmark'ları):
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-3 py-2">Kapasite</th>
                <th className="px-3 py-2 text-right">Okuma</th>
                <th className="px-3 py-2 text-right">Yazma</th>
                <th className="px-3 py-2">Teknik</th>
              </tr>
            </thead>
            <tbody>
              <SSDSpeedRow
                cap="256 GB"
                read="~2.100 MB/s"
                write="~1.500 MB/s"
                tech="Tek NAND chip (yavaş)"
                tone="bad"
              />
              <SSDSpeedRow
                cap="512 GB"
                read="~3.000 MB/s"
                write="~3.200 MB/s"
                tech="Çift NAND interleaved"
                tone="good"
              />
              <SSDSpeedRow
                cap="1 TB"
                read="~3.500 MB/s"
                write="~3.400 MB/s"
                tech="Çift NAND optimize"
                tone="good"
              />
              <SSDSpeedRow
                cap="2 TB+"
                read="~3.600 MB/s"
                write="~3.500 MB/s"
                tech="Dörtlü NAND (marjinal)"
                tone="neutral"
              />
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">
          Yani 256 → 512 geçişi sadece kapasite değil,{" "}
          <span className="font-semibold text-foreground">
            %50 okuma + %110 yazma hızı
          </span>{" "}
          farkı yaratıyor. Yük altında swap ve model yükleme senaryolarında bu fark
          doğrudan kullanıcı deneyimine yansıyor.
        </p>
      </CardContent>
    </Card>
  );
}

function SSDSpeedRow({
  cap,
  read,
  write,
  tech,
  tone,
}: {
  cap: string;
  read: string;
  write: string;
  tech: string;
  tone: "good" | "bad" | "neutral";
}) {
  const bg =
    tone === "bad"
      ? "bg-rose-500/5"
      : tone === "good"
        ? "bg-emerald-500/5"
        : "";
  const col =
    tone === "bad"
      ? "text-rose-400"
      : tone === "good"
        ? "text-emerald-400"
        : "text-muted-foreground";
  return (
    <tr className={`border-b border-border/40 last:border-0 ${bg}`}>
      <td className="px-3 py-2 font-mono font-semibold">{cap}</td>
      <td className={`px-3 py-2 text-right font-mono text-xs ${col}`}>
        {read}
      </td>
      <td className={`px-3 py-2 text-right font-mono text-xs ${col}`}>
        {write}
      </td>
      <td className="px-3 py-2 text-[11px] text-muted-foreground">{tech}</td>
    </tr>
  );
}

/* ---- 2) Cluster'da disk gerçekte ne için kullanılıyor? ---- */

function StorageNeedsBreakdown() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          Cluster'da SSD ne işe yarıyor? Her node ne kadar yer tutar?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <StorageUseCard
            title="Master node (genelde M1)"
            role="Model depolama + orkestrasyon"
            items={[
              { label: "macOS Sequoia + Xcode CLT", size: "~50 GB" },
              { label: "Exo runtime + Python env", size: "~4 GB" },
              { label: "Tam model arşivi (ana kaynak)", size: "40-80 GB" },
              { label: "Kendi shard'ı (RAM'e yüklenir)", size: "~10 GB" },
              { label: "Model cache (HuggingFace)", size: "~30 GB" },
              { label: "KV-cache / temp dosyalar", size: "~5 GB" },
              { label: "Kullanıcı alanı (logs, konuşmalar)", size: "~10 GB" },
            ]}
            total="~150-190 GB"
            verdict="256 GB ÇOK TIGHT. Model test ederken bir ikincisi indirilince dolar. En az 512 GB, ideal 1 TB."
            tone="warning"
          />
          <StorageUseCard
            title="Slave node (M2, M3, M4)"
            role="Sadece kendi shard'ını çalıştırır"
            items={[
              { label: "macOS Sequoia + Xcode CLT", size: "~50 GB" },
              { label: "Exo runtime + Python env", size: "~4 GB" },
              { label: "Sadece kendi shard'ı", size: "~10 GB" },
              { label: "System cache / swap alanı", size: "~10 GB" },
              { label: "Log / telemetry", size: "~2 GB" },
            ]}
            total="~75-80 GB"
            verdict="256 GB FAZLASIYLA YETER. Zaten 40+ GB boş kalır. Hız tuzağı sorun, ama kapasite değil."
            tone="success"
          />
        </div>
        <MarkdownNote tone="info" title="Neden asimetrik olabilir?">
{`Pipeline parallel inference'ta **tam model sadece bir yerde tutulmak zorunda değil** — Exo shard'ları parça parça node'lara dağıtabilir. Ama pratikte en az bir node'da tam model olması şu işe yarar:
- **Yeni model test**: HuggingFace'ten indir → dağıt
- **Model versiyonu değiştir**: Q4 → Q5 upgrade
- **Fine-tuned versiyonları saklama**: İleride eklediğin kendi LoRA adapter'ları

Yani **1 node "depo", 3 node "işçi"** mimarisi mantıklı.`}
        </MarkdownNote>
      </CardContent>
    </Card>
  );
}

function StorageUseCard({
  title,
  role,
  items,
  total,
  verdict,
  tone,
}: {
  title: string;
  role: string;
  items: { label: string; size: string }[];
  total: string;
  verdict: string;
  tone: "success" | "warning";
}) {
  const border =
    tone === "warning"
      ? "border-amber-500/40 bg-amber-500/5"
      : "border-emerald-500/40 bg-emerald-500/5";
  const totalColor =
    tone === "warning" ? "text-amber-400" : "text-emerald-400";
  return (
    <div className={`rounded-xl border p-4 ${border}`}>
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      <div className="mb-3 text-sm font-semibold">{role}</div>
      <dl className="space-y-1 text-xs">
        {items.map((it) => (
          <div
            key={it.label}
            className="flex justify-between border-b border-border/30 pb-1 last:border-0"
          >
            <dt className="text-muted-foreground">{it.label}</dt>
            <dd className="font-mono">{it.size}</dd>
          </div>
        ))}
        <div className="flex justify-between border-t border-border/60 pt-2 font-semibold">
          <dt>Toplam minimum</dt>
          <dd className={`font-mono ${totalColor}`}>{total}</dd>
        </div>
      </dl>
      <p className="mt-3 text-[11px] leading-snug text-muted-foreground">
        <span className="font-semibold text-foreground">Verdict: </span>
        {verdict}
      </p>
    </div>
  );
}

/* ---- 3) Apple upgrade fiyatları ---- */

function AppleStorageUpgradeTable() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          <Zap className="mr-1.5 inline h-4 w-4" />
          Apple TR SSD upgrade fiyatları (M4 base mini, 2026-Q1)
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-3 py-2">Upgrade</th>
              <th className="px-3 py-2 text-right">Ek maliyet / node</th>
              <th className="px-3 py-2 text-right">4 node için</th>
              <th className="px-3 py-2">Kazanım</th>
            </tr>
          </thead>
          <tbody>
            <UpgradeRow
              upgrade="256 → 512 GB"
              perNode="+4.000 ₺"
              cluster="+16.000 ₺"
              gain="Kapasite 2×, okuma +%50, yazma +%110 (NAND tuzağından çıkış)"
              tone="strong"
            />
            <UpgradeRow
              upgrade="256 → 1 TB"
              perNode="+10.000 ₺"
              cluster="+40.000 ₺"
              gain="Kapasite 4×, tam hız, master node için ideal"
              tone="medium"
            />
            <UpgradeRow
              upgrade="256 → 2 TB"
              perNode="+22.000 ₺"
              cluster="+88.000 ₺"
              gain="Kapasite 8×, hızda marjinal fark. Overkill."
              tone="weak"
            />
            <UpgradeRow
              upgrade="512 → 1 TB"
              perNode="+6.000 ₺"
              cluster="+24.000 ₺"
              gain="Sadece kapasite (hız zaten tam)"
              tone="medium"
            />
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function UpgradeRow({
  upgrade,
  perNode,
  cluster,
  gain,
  tone,
}: {
  upgrade: string;
  perNode: string;
  cluster: string;
  gain: string;
  tone: "strong" | "medium" | "weak";
}) {
  const color = {
    strong: "text-emerald-400",
    medium: "text-primary",
    weak: "text-muted-foreground",
  }[tone];
  return (
    <tr className="border-b border-border/40 last:border-0">
      <td className="px-3 py-2 font-medium">{upgrade}</td>
      <td className={`px-3 py-2 text-right font-mono text-xs ${color}`}>
        {perNode}
      </td>
      <td className={`px-3 py-2 text-right font-mono text-xs font-semibold ${color}`}>
        {cluster}
      </td>
      <td className="px-3 py-2 text-[11px] text-muted-foreground">{gain}</td>
    </tr>
  );
}

/* ---- 4) Senaryo matrisi — 4 farklı konfigürasyon ---- */

function StorageScenarioMatrix() {
  const scenarios = [
    {
      id: "all-256",
      title: "Tüm node'lar 256GB",
      budget: "120.000 ₺ (baseline)",
      delta: "0 ₺",
      perNode: "4× 256GB · yavaş SSD",
      bottleneck: "VAR — master darboğaz",
      bottleneckDetail:
        "Master'da ~256GB'ın ~190GB'ı dolu olacak. 40GB'lık ikinci bir model indirmek imkansız. Ayrıca 256GB yavaş NAND → cold boot ~4 dk, swap thrashing riski.",
      modelSwitch: "~4-5 dk (yavaş SSD'den okuma)",
      swapRisk: "YÜKSEK — 16GB RAM ile 70B shard sıkışırsa yavaş swap",
      verdict: "YETERSİZ" as const,
      tone: "bad" as const,
    },
    {
      id: "asymmetric",
      title: "1× 1TB + 3× 256GB (asimetrik)",
      budget: "130.000 ₺",
      delta: "+10.000 ₺",
      perNode: "M1: 1TB hızlı · M2-M4: 256GB yavaş",
      bottleneck: "AZALIR — ama slave'lerde swap riski",
      bottleneckDetail:
        "Master node geniş ve hızlı → model arşivi rahat. Ama slave'ler hâlâ yavaş 256GB NAND kullanıyor; 16GB RAM sıkışırsa swap yavaş.",
      modelSwitch: "~2 dk master'da, slave distribution TB4 üzerinden",
      swapRisk: "ORTA — slave'ler hâlâ yavaş NAND'a swap yapar",
      verdict: "MAKUL" as const,
      tone: "medium" as const,
    },
    {
      id: "all-512",
      title: "Tüm node'lar 512GB",
      budget: "136.000 ₺",
      delta: "+16.000 ₺",
      perNode: "4× 512GB · tam hızlı SSD",
      bottleneck: "YOK",
      bottleneckDetail:
        "Hem kapasite (512GB × 4 = 2TB efektif) hem de hız (3GB/s) her node'da aynı. Swap yaşansa bile hızlı. Master'da 2 farklı model + yedek rahat tutulur.",
      modelSwitch: "~1.5 dk (her node yerel shard'ı hızlı yükler)",
      swapRisk: "DÜŞÜK — hızlı SSD swap'ı bile tolere eder",
      verdict: "SWEET SPOT" as const,
      tone: "best" as const,
    },
    {
      id: "all-1tb",
      title: "Tüm node'lar 1TB",
      budget: "160.000 ₺",
      delta: "+40.000 ₺",
      perNode: "4× 1TB · tam hızlı SSD",
      bottleneck: "YOK",
      bottleneckDetail:
        "Kapasite 4TB efektif — onlarca model, fine-tune checkpoint, veri seti. Hız farkı 512GB'a göre marjinal.",
      modelSwitch: "~1.3 dk",
      swapRisk: "DÜŞÜK",
      verdict: "LÜKS" as const,
      tone: "good" as const,
    },
  ];
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          4 farklı depolama konfigürasyonu
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {scenarios.map((s) => (
          <StorageScenarioCard key={s.id} {...s} />
        ))}
      </CardContent>
    </Card>
  );
}

function StorageScenarioCard({
  title,
  budget,
  delta,
  perNode,
  bottleneck,
  bottleneckDetail,
  modelSwitch,
  swapRisk,
  verdict,
  tone,
}: {
  title: string;
  budget: string;
  delta: string;
  perNode: string;
  bottleneck: string;
  bottleneckDetail: string;
  modelSwitch: string;
  swapRisk: string;
  verdict: "YETERSİZ" | "MAKUL" | "SWEET SPOT" | "LÜKS";
  tone: "bad" | "medium" | "best" | "good";
}) {
  const config = {
    bad: {
      border: "border-rose-500/40 bg-rose-500/5",
      badge: "border-rose-500/50 text-rose-400",
    },
    medium: {
      border: "border-amber-500/40 bg-amber-500/5",
      badge: "border-amber-500/50 text-amber-400",
    },
    best: {
      border: "border-emerald-500/60 bg-emerald-500/10 ring-1 ring-emerald-500/30",
      badge: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400",
    },
    good: {
      border: "border-primary/40 bg-primary/5",
      badge: "border-primary/50 text-primary",
    },
  }[tone];
  return (
    <div className={`relative rounded-xl border p-4 ${config.border}`}>
      <Badge
        variant="outline"
        className={`absolute -top-2 right-3 bg-background ${config.badge}`}
      >
        {verdict}
      </Badge>
      <div className="mb-2 text-sm font-semibold">{title}</div>
      <dl className="space-y-1 text-xs">
        <div className="flex justify-between border-b border-border/30 pb-1">
          <dt className="text-muted-foreground">Toplam bütçe</dt>
          <dd className="font-mono">{budget}</dd>
        </div>
        <div className="flex justify-between border-b border-border/30 pb-1">
          <dt className="text-muted-foreground">Baseline'a göre fark</dt>
          <dd className="font-mono">{delta}</dd>
        </div>
        <div className="flex justify-between border-b border-border/30 pb-1">
          <dt className="text-muted-foreground">Node başı</dt>
          <dd className="font-mono text-[11px]">{perNode}</dd>
        </div>
        <div className="flex justify-between border-b border-border/30 pb-1">
          <dt className="text-muted-foreground">Darboğaz?</dt>
          <dd className="font-mono text-[11px] font-semibold">{bottleneck}</dd>
        </div>
        <div className="flex justify-between border-b border-border/30 pb-1">
          <dt className="text-muted-foreground">Model yükleme</dt>
          <dd className="font-mono text-[11px]">{modelSwitch}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Swap riski</dt>
          <dd className="font-mono text-[11px]">{swapRisk}</dd>
        </div>
      </dl>
      <p className="mt-3 text-[11px] leading-snug text-muted-foreground">
        {bottleneckDetail}
      </p>
    </div>
  );
}

/* ---- 5) Asimetrik mı simetrik mi? ---- */

function AsymmetricVsSymmetric() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          1 node'un mu hafızası önemli, hepsinin mi?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-relaxed">
        <p className="text-muted-foreground">
          <span className="font-semibold text-foreground">Kısa cevap:</span>{" "}
          <span className="italic">Kapasite</span> açısından sadece bir node'un büyük
          olması yeterli. Ama <span className="italic">hız</span> açısından hepsinin
          512GB+ olması önemli. Sebebi Apple'ın 256GB tek-NAND tuzağı.
        </p>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-border/60 bg-secondary/30 p-3">
            <div className="mb-1.5 text-sm font-semibold">
              Kapasite (storage size) — asimetrik olabilir
            </div>
            <p className="text-[12px] text-muted-foreground">
              Pipeline parallel'de her node sadece kendi shard'ını çalıştırır. 70B Q4
              modelin sadece ~10GB'lık dilimi slave'de. Kapasite olarak 256GB fazlasıyla
              yeter. Ana model arşivi <span className="font-semibold text-foreground">
              tek master node'da</span> durabilir. Asimetrik kurulum kapasite
              açısından <span className="font-semibold text-emerald-400">sorunsuz</span>.
            </p>
          </div>
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-3">
            <div className="mb-1.5 text-sm font-semibold text-rose-300">
              Hız (SSD bandwidth) — simetrik olmak ZORUNDA
            </div>
            <p className="text-[12px] text-muted-foreground">
              Slave'de 256GB yavaş NAND varsa → o node'un 16GB RAM'i sıkıştığında swap
              catastrophic yavaşlar. Bir node yavaşsa pipeline hızı{" "}
              <span className="font-semibold text-rose-400">en yavaş node kadardır</span>.
              Hız açısından asimetrik kurulum{" "}
              <span className="font-semibold text-rose-400">darboğaz yaratır</span>.
            </p>
          </div>
        </div>

        <MarkdownNote tone="insight" title="Darboğaz formülü">
{`**Pipeline hızı = min(node hızları)** — zincirdeki en zayıf halka tüm sistemi belirler.

Bu yüzden **"1× 1TB + 3× 256GB"** konfigürasyonu cazip görünse de 3 slave'deki yavaş NAND, memory pressure anında tüm cluster'ı yere indirir. Ya hepsi en az 512GB, ya master 1TB + slave'ler **en az 512GB** olmalı.

**"Bir darboğaz oluştursun istemiyorum"** hedefi için minimum kabul: **Tüm node'lar ≥ 512GB**.`}
        </MarkdownNote>
      </CardContent>
    </Card>
  );
}

/* ---- 6) Harici SSD seçeneği ---- */

function ExternalSSDOption() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          Alternatif: harici TB4 SSD ile model arşivi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="text-muted-foreground">
          Apple'ın dahili SSD upgrade'i pahalı (GB başına ~65 ₺). TB4 üzerinden harici
          NVMe SSD bağlamak alternatif yol:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-3 py-2">Seçenek</th>
                <th className="px-3 py-2 text-right">Kapasite</th>
                <th className="px-3 py-2 text-right">Hız</th>
                <th className="px-3 py-2 text-right">Fiyat</th>
                <th className="px-3 py-2">Not</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/40">
                <td className="px-3 py-2 font-medium">
                  Apple dahili 1TB (master)
                </td>
                <td className="px-3 py-2 text-right font-mono text-xs">1 TB</td>
                <td className="px-3 py-2 text-right font-mono text-xs">~3.5 GB/s</td>
                <td className="px-3 py-2 text-right font-mono text-xs">+10.000 ₺</td>
                <td className="px-3 py-2 text-[11px] text-muted-foreground">
                  Bootable, dahili, Apple Care kapsamında
                </td>
              </tr>
              <tr className="border-b border-border/40">
                <td className="px-3 py-2 font-medium">
                  Samsung T7 Shield / Crucial X10 (TB3)
                </td>
                <td className="px-3 py-2 text-right font-mono text-xs">2 TB</td>
                <td className="px-3 py-2 text-right font-mono text-xs">~1 GB/s</td>
                <td className="px-3 py-2 text-right font-mono text-xs">~5.000 ₺</td>
                <td className="px-3 py-2 text-[11px] text-muted-foreground">
                  Ucuz ama yavaş; sadece arşiv
                </td>
              </tr>
              <tr className="border-b border-border/40">
                <td className="px-3 py-2 font-medium">
                  OWC Envoy Pro FX (TB4 NVMe)
                </td>
                <td className="px-3 py-2 text-right font-mono text-xs">2 TB</td>
                <td className="px-3 py-2 text-right font-mono text-xs">~2.8 GB/s</td>
                <td className="px-3 py-2 text-right font-mono text-xs">~14.000 ₺</td>
                <td className="px-3 py-2 text-[11px] text-muted-foreground">
                  Dahili hıza yakın, ama TB portlarından birini yer
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-medium">
                  USB4 NVMe kutu + 990 Pro 2TB
                </td>
                <td className="px-3 py-2 text-right font-mono text-xs">2 TB</td>
                <td className="px-3 py-2 text-right font-mono text-xs">~3.2 GB/s</td>
                <td className="px-3 py-2 text-right font-mono text-xs">~10.000 ₺</td>
                <td className="px-3 py-2 text-[11px] text-muted-foreground">
                  En iyi ₺/GB, DIY çözüm
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <MarkdownNote tone="warning" title="Harici SSD'nin ince yazılı hakikatları">
{`- **TB4 port'u harcanır**: Ring topoloji için her mini'de 2 port kullanılıyor; 3. portu harici SSD'ye verirsen yedek/monitör için port kalmaz.
- **Swap için kullanılamaz**: macOS sistem swap'ını sadece dahili diskte tutuyor. Yani 256GB dahili hâlâ memory pressure'a maruz kalır.
- **macOS externaldan full boot desteklemez (M4 mini)**: Sadece data partition mantığında kullanılabilir.
- **En mantıklı kullanım**: Master node'da harici SSD = model arşivi; slave'lerde dahili yeterli.`}
        </MarkdownNote>
      </CardContent>
    </Card>
  );
}

/* ---- 7) Karar ---- */

function StorageVerdict() {
  return (
    <Card className="border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-transparent to-primary/5">
      <CardHeader>
        <CardTitle className="text-lg">
          Karar: SSD'ye ne kadar harcamalı?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-relaxed">
        <p>
          <span className="font-semibold text-foreground">
            Bütçeyi sırtlanabiliyorsan sweet spot: Tüm node'lar 512GB.
          </span>{" "}
          4× 512GB = +16.000 ₺ (toplam ~136K ₺). Bu 16K ₺:
        </p>
        <ul className="ml-4 list-disc space-y-1 text-muted-foreground">
          <li>
            256GB tek-NAND tuzağından çıkarır (okuma +%50, yazma +%110)
          </li>
          <li>
            Her node'da swap hızlı olur → memory pressure anında crash yerine yavaşlama
          </li>
          <li>
            Hiçbir node darboğaz olmaz (pipeline = min node hızı kuralı)
          </li>
          <li>
            Model yükleme 4 dk → 1.5 dk (test döngüsü rahat)
          </li>
        </ul>

        <p>
          <span className="font-semibold text-foreground">
            Daha az harcamak istiyorsan minimum kabul:
          </span>{" "}
          Master 1TB + slave'ler 512GB = +22.000 ₺. "Tüm slave'ler 256" önerisi{" "}
          <span className="font-semibold text-rose-400">
            darboğaz yarattığı için kaçınılmalı
          </span>
          .
        </p>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <StorageRecCard
            tier="Minimum güvenli"
            spec="1× 1TB + 3× 512GB"
            total="+22.000 ₺ (142K)"
            note="Master geniş, slave'ler hızlı. Darboğazsız en ucuz seçenek."
            tone="primary"
          />
          <StorageRecCard
            tier="★ Sweet spot"
            spec="4× 512GB"
            total="+16.000 ₺ (136K)"
            note="Tamamen simetrik, sade kurulum, master node kavramı gerekmez."
            tone="success"
          />
          <StorageRecCard
            tier="Gelecek-odaklı"
            spec="1× 2TB + 3× 512GB"
            total="+38.000 ₺ (158K)"
            note="Master'da çoklu model + fine-tune veri seti saklama kapasitesi."
            tone="accent"
          />
        </div>

        <MarkdownNote tone="insight" title="Net özet — soruların cevapları">
{`**"Tamamı 256GB olsa yeterli mi?"** → Hayır. Hem kapasite açısından master sıkışır, hem de tek-NAND yavaş SSD her node'da swap darboğazı yaratır.

**"1 tane 1TB + geri kalan 256GB yeterli mi?"** → Kapasite açısından evet, **hız açısından HAYIR**. Slave'lerdeki 256GB yavaş NAND tüm cluster'ı en yavaş node kadar indirir.

**"1 node'un mu hafızası önemli hepsinin mi?"** → Kapasite asimetrik olabilir, **hız simetrik olmak zorunda**. Pratik kural: Tüm node'lar ≥ 512GB (hız için), master ≥ 1TB (kapasite için, opsiyonel).

**"Bir darboğaz oluşturmasın"** → **4× 512GB** minimum. Bu konfigürasyonda SSD artık projenin herhangi bir senaryosunda darboğaz değil.`}
        </MarkdownNote>
      </CardContent>
    </Card>
  );
}

function StorageRecCard({
  tier,
  spec,
  total,
  note,
  tone,
}: {
  tier: string;
  spec: string;
  total: string;
  note: string;
  tone: "primary" | "accent" | "success";
}) {
  const border = {
    primary: "border-primary/40 bg-primary/5",
    accent: "border-accent/40 bg-accent/5",
    success: "border-emerald-500/40 bg-emerald-500/5",
  }[tone];
  const color = {
    primary: "text-primary",
    accent: "text-accent-foreground",
    success: "text-emerald-400",
  }[tone];
  return (
    <div className={`rounded-xl border p-4 ${border}`}>
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {tier}
      </div>
      <div className="mb-1 font-semibold">{spec}</div>
      <div className={`mb-2 font-mono text-sm font-bold ${color}`}>{total}</div>
      <p className="text-[11px] leading-snug text-muted-foreground">{note}</p>
    </div>
  );
}
