import {
  Trophy,
  ArrowUpRight,
  XCircle,
  Zap,
  Volume2,
  Sun,
  Cpu,
  Coins,
} from "lucide-react";
import { Section } from "./Section";
import { SectionHeader } from "../SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarkdownNote } from "../MarkdownNote";
import { ProductLink } from "../ProductLink";
import { ComparisonTable } from "../ComparisonTable";
import { BudgetTierLadder } from "../charts/BudgetTierLadder";
import { getHardwareById, usableLLMMemoryGB } from "@/data/hardware";
import { hardwareMonthlyElectricityTR } from "@/lib/calc";
import { cn, formatTRY } from "@/lib/utils";
import type { Hardware } from "@/types";

/**
 * 09 · Bütçe Önerileri
 * ─────────────────────
 * Dashboard'un tüm bulgularını (fiyat/performans, Q6 bulut ekonomisi,
 * Q7 fine-tune, Q8 yaşanabilirlik) tek bir "şu bütçeyle şunu al" özetine
 * indirger. 5 Türkiye pazarı kademesinde: 90K · 150K · 200K · 350K · 500K TL.
 */

export function ButceOnerileri() {
  return (
    <Section id="butce">
      <SectionHeader
        eyebrow="09 · Bütçe Önerileri"
        title="Bütçen ne kadarsa, en iyi yol hangisi?"
        description="Apple fiyatları (2026-Q1), ikinci el M2 Ultra piyasası, ithalat gümrük maliyetleri ve Q8 yaşanabilirlik (elektrik · ses · yaz termali) birleştirilmiş 5 kademe önerisi."
      />

      <MethodologyCard />

      <div className="mb-10 rounded-2xl border border-border/60 bg-card/40 p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Trophy className="h-4 w-4 text-amber-400" />
          Kademe özeti
        </div>
        <BudgetTierLadder />
      </div>

      <div className="space-y-8">
        <Tier90 />
        <Tier150 />
        <Tier200 />
        <Tier350 />
        <Tier500 />
      </div>

      <FinalComparisonTable />

      <MarkdownNote tone="insight" title="Üç ana çıkarım">
        {`
1. **90K–150K aralığında tek mantıklı çekirdek Apple** — 2026-Q2 fiyat güncellemesi: 90K bütçede artık 70B çalıştıran bir cihaz yok (Mac mini M4 Pro 14/20 48GB artık ~125K, Dual 3090 DIY ~150K). 115K Mac Studio M2 Ultra 2. el, 125K yeni Mac mini M4 Pro 14/20 48GB ve 150K Dual 3090 DIY — üçü de 70B Q4'e sığar. Apple seçenekleri 32-38 dB, Dual 3090 **60 dB = yaşanamaz**.
2. **200K+ bütçede her TL bulut bütçesine koymaktan değerli değil** — Q6 bulgusu sabit: günde 200K+ token üretmiyorsan DeepSeek V3.1 API ile 3 yıllık maliyet 60–90K TL'de kalıyor. O yüzden 200K TL'lik kademenin kazananı "**M2 Ultra 64GB + 85K TL 3 yıllık bulut fonu**" hibriti.
3. **350K+ bütçede asıl fark '192GB unified' olabilmek** — Mac Studio M3 Ultra 192GB, tek cihazda Qwen3 30B-A3B, GPT-OSS 120B MoE ve 70B Q8'i **aynı anda yüklü** tutar. Cluster 4× Mac mini Pro 64GB daha fazla bellek havuzu verir ama TB5 overhead nedeniyle 70B hızı üçte birine düşer. 500K bütçede tek Mac Studio + 180K TL bulut fonu, 4-node cluster'dan pragmatik açıdan daha güçlü.
`}
      </MarkdownNote>
    </Section>
  );
}

/* ───────────────────────── Metodoloji kartı ───────────────────────── */

function MethodologyCard() {
  return (
    <Card className="mb-8 border-primary/30 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Cpu className="h-4 w-4 text-primary" />
          Karar kriterleri (tüm kademeler için ortak)
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <Criterion
          icon={<Coins className="h-4 w-4 text-amber-400" />}
          title="TL / kullanılabilir GB"
          desc="Asıl hedef 'büyük model çalıştır': 70B Q4 için ≥34GB usable."
        />
        <Criterion
          icon={<Zap className="h-4 w-4 text-sky-400" />}
          title="Aylık elektrik (TR tarife)"
          desc="EPDK 2026-Q1 kademeli tarife · 4. dilim 6.2 TL/kWh."
        />
        <Criterion
          icon={<Volume2 className="h-4 w-4 text-emerald-400" />}
          title="Yük dB (1m)"
          desc="Oturma odası: ≤35 dB · yatak odası: ≤30 dB."
        />
        <Criterion
          icon={<Sun className="h-4 w-4 text-rose-400" />}
          title="Yaz termal kaybı"
          desc="Türkiye klimasız 32-38°C ortam · NVIDIA kartlar en hassas."
        />
      </CardContent>
    </Card>
  );
}

function Criterion({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-lg border border-border/40 bg-card/40 p-3">
      <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold">
        {icon}
        {title}
      </div>
      <div className="text-xs text-muted-foreground">{desc}</div>
    </div>
  );
}

/* ───────────────────────── 90.000 TL ───────────────────────── */

function Tier90() {
  return (
    <TierCard
      budget="90.000 TL"
      nickname="Giriş kademesi · 2026-Q2 dar bütçe"
      headline="70B artık bu bütçede yok — <32B modeller için en sessiz yol"
      primaryHwId="mac-mini-m4-pro-24"
      primaryPriceTL={78_000}
      primaryReasons={[
        "Mac mini M4 Pro 12/16 · 24GB · 512GB sıfır · 78K ₺ (Apple TR güncel)",
        "~17GB kullanılabilir → 14B Q6 ve 30B-A3B MoE rahat çalışır",
        "32 dB yük · tamamen sessiz · 65W maksimum · 0 ₺/ay elektrik farkı",
        "Türkiye Apple garantisi · 8K ₺ yedek bütçe",
      ]}
      primaryCapabilities={[
        "Qwen3 30B-A3B (MoE) · 32 tok/s (frontier yakın kalite)",
        "Qwen3 14B Q6 · 25 tok/s",
        "Codellama 13B Q4 · 35 tok/s",
        "70B Q4 sığmaz — bu bütçe sınırı",
      ]}
      alternatives={[
        {
          hwId: "pc-single-3090",
          priceTL: 85_000,
          note: "24GB VRAM · 70B partial offload (~6 tok/s). 2026-Q2'de 3090 2. el 25-30K ₺ + sistem ≈ 85K. Yaşanabilirlik dezavantajı: 52 dB, ~340 ₺/ay elektrik, %22 yaz kaybı. Fine-tune isteyenin tek seçeneği.",
          warning: true,
        },
        {
          hwId: "framework-desktop-amd-395-64",
          priceTL: 85_000,
          note: "x86 · Linux + Windows · ROCm olgun değil, ithalat + gümrük. Ekosistem olgunsa 2027'de tekrar değerlendir.",
          warning: true,
        },
      ]}
      avoid={{
        hwId: "mac-mini-m4-pro-48",
        priceTL: 125_000,
        reason:
          "2026-Q2'de 14/20 48GB 1TB Apple TR BTO ≈ 125K ₺ (kullanıcı gözlemi) — bu tier dışına çıktı. 70B Q4 hedefin varsa 120K tier'ına (115K Mac Studio M2 Ultra 2. el) yükselmen gerek. 12/16 48GB 1TB eski fiyatı 92K hâlâ Troyestore'da var ama Apple TR yeni ürünü artık 14/20 pakette.",
      }}
      takeaway="**2026-Q2 gerçeği: 90K artık 70B bütçesi değil.** Bu kademede <32B dense + MoE modelleriyle barışık ol; 70B için 115-125K tier'ına yükselme şart."
    />
  );
}

/* ───────────────────────── 150.000 TL ───────────────────────── */

function Tier150() {
  return (
    <TierCard
      budget="150.000 TL"
      nickname="Sweet spot · 70B kulvarı gerçek başlıyor"
      headline="İkinci el M2 Ultra 64GB 35K ₺ artıkla 2026-Q2'nin de tartışmasız kralı"
      primaryHwId="mac-studio-m2-ultra-64-used"
      primaryPriceTL={115_000}
      primaryReasons={[
        "800 GB/s bellek bant genişliği — yeni M4 Max (410 GB/s) ve Mac mini Pro (273 GB/s) 2-3x'i",
        "45GB kullanılabilir → Llama 3.3 70B Q4 rahat ~13 tok/s (bu kademenin hız kralı)",
        "32 dB yük · oturma odasında fark edilmez · 85 ₺/ay elektrik",
        "Yaz kaybı sadece %4 — Türkiye iklimine en iyi uyan profil",
        "35K ₺ artan bütçe: SSD upgrade / Apple Care / bulut fonu",
      ]}
      primaryCapabilities={[
        "Llama 3.3 70B Q4 · 13 tok/s (konforlu)",
        "Llama 3.3 70B Q5 · 10 tok/s (kalite odaklı)",
        "Qwen3 32B Q8 · 28 tok/s",
        "MLX fine-tune 7-14B LoRA mümkün",
      ]}
      alternatives={[
        {
          hwId: "mac-studio-m2-ultra-64",
          priceTL: 160_000,
          note: "**Sıfır 160K ₺** — 2. el'den 45K ₺ primi var ama Apple TR garantisi + AppleCare+ uzatma hakkı + 3 yıl ötelenebilir maliyet. Aynı donanım, sıfır güvenilirliği. Bütçe esnetmeye değer senaryo.",
        },
        {
          hwId: "cluster-2x-mac-mini-m4-pro-24",
          priceTL: 160_000,
          note: "2× M4 Pro 24GB TB5 cluster · 48GB pool · 35GB usable. 32B Q4 rahat ~10 tok/s; 70B Q4 sığmaz. Node başına bağımsız — upgrade esnekliği (2 node daha ekle). Aynı bütçede M2 Ultra'dan concurrent yarı hız.",
        },
        {
          hwId: "mac-mini-m4-pro-48",
          priceTL: 125_000,
          note: "Yeni + Apple garanti · 14/20 48GB 1TB TR Apple BTO ~125K ₺. 273 GB/s bant → 70B Q4 ~7-8 tok/s (M2 Ultra'nın yarısı). Garanti + upgrade + sessizlik primi için makul.",
        },
        {
          hwId: "framework-desktop-amd-395-128",
          priceTL: 140_000,
          note: "128GB pool — GPT-OSS 120B (MoE) sığar! 212 GB/s bant yavaşlatıyor. Ama Türkiye pazarında resmi satış yok → ithalat + gümrük riski.",
          warning: true,
        },
      ]}
      avoid={{
        hwId: "pc-dual-3090",
        priceTL: 150_000,
        reason:
          "2026-Q2 gerçek fiyat güncellemesi: 2. el 3090 25-30K ₺ × 2 + yeni sistem 80-100K ≈ **150K ₺ DIY** (hazır integrator 180-220K). Tam bu tier'da. 48GB VRAM, 70B Q4 ~20 tok/s cazip görünür. Ama Q8 verileri acımasız: **60 dB yükte** (server sınıfı, ayrı oda zorunlu), %30 yaz kaybı, 750W TDP → 685 ₺/ay elektrik. 3 yılda gizli maliyet +21.6K ₺, ayrı oda/ses yalıtımı +20-30K ₺. Gerçek maliyet 171K+. Ev kullanıcısı için net kaybeder; fine-tune / CUDA gerçekten kritikse ayrı çalışma odası varsa savunulabilir.",
      }}
      takeaway="**Bu kademenin galibi net.** M2 Ultra 64GB 2. el (115K) veya sıfır (160K · bütçeye zorluk), aynı bütçede Dual 3090 DIY'den 36 ayda ~53K ₺ daha ucuz (elektrik + ses yalıtımı dahil). 2. el garanti riski varsa **45K ₺ primle sıfır** hedefle (Tier 200'e yükselt). 2× M4 Pro 24GB TB5 cluster (160K) 32B'de yeter ama 70B sığmaz → bu tier'da M2 Ultra net kazanır."
    />
  );
}

/* ───────────────────────── 200.000 TL ───────────────────────── */

function Tier200() {
  return (
    <TierCard
      budget="200.000 TL"
      nickname="Hibrit kulvar · yerel + bulut"
      headline="150K'nın aynı kazananı + 85K TL 3 yıllık bulut fonu"
      primaryHwId="mac-studio-m2-ultra-64-used"
      primaryPriceTL={115_000}
      primaryPriceNote="+ ~85.000 TL 3 yıllık bulut API fonu"
      primaryReasons={[
        "Q6 bulgusu: günde 200K+ token üretmiyorsan DeepSeek V3.1 API 3 yılda 60-90K TL. Yerel donanıma 200K TL gömmek ekonomik olarak KAYIP.",
        "M2 Ultra günlük 70B/32B işi görür; 671B MoE veya frontier kalite gerektiğinde API'ye uç",
        "85K TL'yi 3 yıla böl → aylık ~2.300 TL bulut bütçesi. DeepSeek V3.1 ile günde ~700K token",
        "Yerelde bile 85K TL satın alımla fark yaratacak donanım yok — 200K'da her Türkiye profilindeki delta çok küçük",
      ]}
      primaryCapabilities={[
        "Yerel: 70B Q5 · 10 tok/s + tam gizlilik",
        "Bulut: Frontier kalite (GPT-5, Claude 4.5, DeepSeek V3.1 671B)",
        "Yerel: MLX fine-tune 7-14B",
        "Bulut: Fine-tune, batch, uzun context (>1M token)",
      ]}
      alternatives={[
        {
          hwId: "mac-studio-m4-max-48",
          priceTL: 150_000,
          note: "Yeni + garantili + 48GB; 50K TL bulut fonu ile → güvenli hibrit. Hız/kalite dengesi için sağlam ikinci seçim.",
        },
        {
          hwId: "framework-desktop-amd-395-128",
          priceTL: 140_000,
          note: "128GB unified pool → GPT-OSS 120B (MoE) YEREL çalışır. Türkiye'de ithalat + gümrük + ROCm olgunluğu riski.",
          warning: true,
        },
        {
          hwId: "cluster-2x-mac-mini-m4-pro-64",
          priceTL: 286_000,
          note: "Ciddi bütçe üstü (2× 142K + TB5 kablo): 128GB TB5 cluster · upgrade modüler. 4-5 yıl ufkun varsa Tier 350'de değerlendir.",
          warning: true,
        },
      ]}
      avoid={{
        hwId: "ws-dual-4090",
        priceTL: 270_000,
        reason:
          "Hız kralı (70B Q4 ~40 tok/s) ama yaşanabilirlik kırmızı: 58 dB yük (sunucu), 950W TDP (800+ TL/ay), %28 yaz kaybı. 200K'lık kademede zaten bütçe dışı; eklemenin mantığı yok.",
      }}
      takeaway="**Yerel AI'ın kör noktası burası.** Donanıma 200K gömmek duygusal tatmin verir ama Q6 acımasız: bulut+yerel hibrit aynı kaliteyi ~3'te bir maliyete verir. Para farkını bulut fonuna veya fine-tune/GPU kiralama bütçesine koy."
    />
  );
}

/* ───────────────────────── 350.000 TL ───────────────────────── */

function Tier350() {
  return (
    <TierCard
      budget="350.000 TL"
      nickname="Workstation kulvarı · 192GB unified"
      headline="Tek cihazda Qwen3 30B-A3B + GPT-OSS 120B + 70B Q8 aynı anda yüklü"
      primaryHwId="mac-studio-m3-ultra-192"
      primaryPriceTL={320_000}
      primaryReasons={[
        "819 GB/s bandwidth · 134GB kullanılabilir — 120B MoE ve 70B Q8 birlikte rahat",
        "38 dB yük · 170W max → ev sahibi için yaşanabilir (oturma odasında fark edilmez)",
        "Yaz kaybı %5 — Türkiye iklimi için en güvenli 192GB çözümü",
        "Tek kasa + tek fiş + tek güncelleme → cluster koordinasyon ağrısı yok",
      ]}
      primaryCapabilities={[
        "Llama 3.3 70B Q8 · ~15 tok/s (kalite tavanı)",
        "GPT-OSS 120B (MoE) · ~16 tok/s (frontier kalite yerel)",
        "Qwen3 30B-A3B (MoE) · 52 tok/s",
        "Multi-model: 70B + embed + rerank + kod modeli birlikte",
      ]}
      alternatives={[
        {
          hwId: "cluster-2x-mac-mini-m4-pro-64",
          priceTL: 286_000,
          note: "128GB TB5 pool (2× 142K mini + kablo), 64K ₺ yedek. Modüler upgrade + ikinci cihaz ileride. Ama 70B Q4 sadece ~6 tok/s (cluster overhead) — M3 Ultra'nın üçte biri.",
        },
        {
          hwId: "asus-ascent-gx10",
          priceTL: 250_000,
          note: "NVIDIA Grace Blackwell · 128GB · CUDA + NVFP4 tam ekosistem. CUDA/fine-tune işleri için çekici. 70B Q4 ~4.4 tok/s (yavaş). Gümrük + garanti riski.",
          warning: true,
        },
      ]}
      avoid={{
        hwId: "ws-dual-4090",
        priceTL: 270_000,
        reason:
          "Tekil task hızında kral (70B Q4 ~40 tok/s). Ama: 58 dB, 950W (700+ TL/ay), %28 yaz kaybı, ayrı oda zorunlu. Fine-tune/CUDA ihtiyacın gerçekten yoksa M3 Ultra hayat kalitesi bakımından her yönden kazanır.",
      }}
      takeaway="**Tek bir net kazanan.** Mac Studio M3 Ultra 192GB tek başına 128GB MoE + 70B Q8 + 32B ajan gibi 'birden fazla model aynı anda yüklü' senaryoları mümkün kılar. Cluster alternatifleri havuzu büyütür ama hız ve hayat kalitesi düşer."
    />
  );
}

/* ───────────────────────── 500.000 TL ───────────────────────── */

function Tier500() {
  return (
    <TierCard
      budget="500.000 TL"
      nickname="Tavan · 'her şey' bütçesi"
      headline="Mac Studio M3 Ultra 192GB + 180K TL 3 yıllık hibrit bulut fonu"
      primaryHwId="mac-studio-m3-ultra-192"
      primaryPriceTL={320_000}
      primaryPriceNote="+ ~180.000 TL 3 yıllık bulut + fine-tune GPU kiralama fonu"
      primaryReasons={[
        "Yerel: 192GB unified → günlük %95 iş örüntüsü cihaz üstünde kalır",
        "Bulut fonu: DeepSeek V3.1 671B, GPT-5, Claude 4.5 — frontier kalite lazım olduğunda hazır",
        "Fine-tune: AWS p4d veya Lambda Labs 8xA100 saatlik kiralama (7-13B LoRA için yeterli) — yerelde mümkün değil",
        "180K TL fon 3 yılda aylık 5.000 TL → günde ~1.6M token bulut + 30 saat H100 kiralama",
      ]}
      primaryCapabilities={[
        "Yerelde: frontier-yakın (70B Q8, 120B MoE, 30B ajan)",
        "Bulutta: gerçek frontier (671B MoE, Opus 4.5, Gemini 2.5 Pro)",
        "Fine-tune: 7-13B LoRA/QLoRA saatlik H100 ile",
        "Tek 500K sınırlı; hibrit kullanımda kalıcı esneklik",
      ]}
      alternatives={[
        {
          hwId: "cluster-4x-mac-mini-m4-pro-64",
          priceTL: 572_000,
          note: "256GB unified pool (152GB usable, 4× 142K mini + TB5 kablo). DeepSeek V3 671B Q4 sınırda sığar. 72K ₺ bütçe aşımı + TB5 cluster overhead 70B'yi ~4 tok/s yapar. Modüler upgrade avantajı cazip ama 500K sınırını ihlal eder.",
          warning: true,
        },
        {
          hwId: "mac-studio-m3-ultra-192",
          priceTL: 320_000,
          note: "Saf yerel odaklıysan: M3 Ultra 192GB + DGX Spark (290K) hibrit kümesi → Exo prefill/decode ayırma ile 4x hız. Toplam 610K bütçe aşımı ama yerelde frontier-yakın deneyim.",
        },
        {
          hwId: "nvidia-dgx-spark",
          priceTL: 290_000,
          note: "Saf NVIDIA yolu + DGX OS. CUDA + NVFP4 tam destek. Tek başına Mac Studio M3 Ultra kadar bellek bant genişliği yok; gümrük + TR'de yaygın satış yok.",
          warning: true,
        },
      ]}
      avoid={{
        hwId: "ws-dual-4090",
        priceTL: 270_000,
        reason:
          "500K bütçede 270K'ya Dual 4090 + 230K yan donanım cazip görünür. Ama: hâlâ 48GB VRAM (70B Q8 sığmaz), 950W, ayrı oda şart. M3 Ultra 192GB'ın bellek avantajını karşılayamaz. Bu bütçede 'büyük VRAM' değil 'büyük bellek + yaşanabilirlik' kazanır.",
      }}
      takeaway="**Tek Mac Studio + bulut fonu hibriti, 4-node cluster'dan pragmatik açıdan üstün.** Cluster çekici görünür ama TB5 overhead'i 70B hızını üçte birine düşürür. Bulut fonu hem frontier kaliteye hem fine-tune GPU kiralamasına erişim verir — yerel kasalar veremez."
    />
  );
}

/* ───────────────────────── TierCard ───────────────────────── */

interface TierOption {
  hwId: string;
  priceTL: number;
  note: string;
  warning?: boolean;
}

interface TierAvoid {
  hwId: string;
  priceTL: number;
  reason: string;
}

interface TierCardProps {
  budget: string;
  nickname: string;
  headline: string;
  primaryHwId: string;
  primaryPriceTL: number;
  primaryPriceNote?: string;
  primaryReasons: string[];
  primaryCapabilities: string[];
  alternatives: TierOption[];
  avoid: TierAvoid;
  takeaway: string;
}

function TierCard(props: TierCardProps) {
  const hw = getHardwareById(props.primaryHwId);
  return (
    <Card className="border-primary/40 bg-primary/[0.03]">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <CardTitle className="text-2xl">
              <span className="section-gradient-text">{props.budget}</span>
            </CardTitle>
            <div className="mt-0.5 text-sm font-medium text-muted-foreground">
              {props.nickname}
            </div>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            {props.headline}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <WinnerBlock
          hw={hw}
          priceTL={props.primaryPriceTL}
          priceNote={props.primaryPriceNote}
          reasons={props.primaryReasons}
          capabilities={props.primaryCapabilities}
        />

        <div>
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <ArrowUpRight className="h-3.5 w-3.5" />
            Alternatifler
          </div>
          <div className="space-y-2">
            {props.alternatives.map((alt) => (
              <AltRow key={alt.hwId} opt={alt} />
            ))}
          </div>
        </div>

        <AvoidBlock opt={props.avoid} />

        <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 px-4 py-3 text-sm text-foreground/90">
          <span className="mr-1 font-semibold text-amber-400">Sonuç:</span>
          <RichText text={props.takeaway} />
        </div>
      </CardContent>
    </Card>
  );
}

/* ───────────────────────── WinnerBlock ───────────────────────── */

function WinnerBlock({
  hw,
  priceTL,
  priceNote,
  reasons,
  capabilities,
}: {
  hw: Hardware | undefined;
  priceTL: number;
  priceNote?: string;
  reasons: string[];
  capabilities: string[];
}) {
  if (!hw) return null;
  const elec = hardwareMonthlyElectricityTR(hw, 4);
  const usable = usableLLMMemoryGB(hw);

  return (
    <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
            <Trophy className="h-3.5 w-3.5" />
            Kazanan
          </div>
          <div className="flex flex-wrap items-center gap-2 text-base font-semibold">
            <ProductLink name={hw.name} url={hw.url} />
            {hw.market === "used" && (
              <Badge variant="warning" className="px-1.5 py-0 text-[9px]">
                2. El
              </Badge>
            )}
          </div>
          {priceNote && (
            <div className="mt-1 text-xs text-muted-foreground">
              {priceNote}
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="font-mono text-lg font-bold text-emerald-400">
            {formatTRY(priceTL)}
          </div>
          <div className="text-[10px] text-muted-foreground">donanım</div>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <MetricChip
          icon={<Cpu className="h-3 w-3" />}
          label="Usable"
          value={`${usable} GB`}
          tone="primary"
        />
        <MetricChip
          icon={<Zap className="h-3 w-3" />}
          label="Elektrik/ay"
          value={`${Math.round(elec.monthlyTL)} TL`}
          tone="sky"
        />
        <MetricChip
          icon={<Volume2 className="h-3 w-3" />}
          label="Yük dB"
          value={hw.noiseDbLoad != null ? `${hw.noiseDbLoad} dB` : "—"}
          tone={
            (hw.noiseDbLoad ?? 0) <= 35
              ? "emerald"
              : (hw.noiseDbLoad ?? 0) <= 45
                ? "amber"
                : "rose"
          }
        />
        <MetricChip
          icon={<Sun className="h-3 w-3" />}
          label="Yaz kaybı"
          value={
            hw.summerThermalPenalty != null
              ? `%${Math.round(hw.summerThermalPenalty * 100)}`
              : "—"
          }
          tone={
            (hw.summerThermalPenalty ?? 0) <= 0.07
              ? "emerald"
              : (hw.summerThermalPenalty ?? 0) <= 0.15
                ? "amber"
                : "rose"
          }
        />
      </div>

      <div className="mb-3">
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Neden kazanıyor
        </div>
        <ul className="space-y-1 text-sm">
          {reasons.map((r, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
              <span>
                <RichText text={r} />
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Çalıştırabildikleri
        </div>
        <div className="flex flex-wrap gap-1.5">
          {capabilities.map((c, i) => (
            <Badge
              key={i}
              variant="outline"
              className="border-emerald-500/30 font-mono text-[10px] text-emerald-400"
            >
              {c}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── AltRow & AvoidBlock ───────────────────────── */

function AltRow({ opt }: { opt: TierOption }) {
  const hw = getHardwareById(opt.hwId);
  if (!hw) return null;
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-start",
        opt.warning
          ? "border-amber-500/25 bg-amber-500/5"
          : "border-border/50 bg-card/40",
      )}
    >
      <div className="flex w-full items-center justify-between sm:w-auto sm:min-w-[220px] sm:flex-col sm:items-start sm:gap-1">
        <ProductLink name={hw.name} url={hw.url} className="text-sm font-medium" />
        <div className="font-mono text-sm text-muted-foreground sm:text-xs">
          {formatTRY(opt.priceTL)}
        </div>
      </div>
      <div className="flex-1 text-xs text-muted-foreground">{opt.note}</div>
    </div>
  );
}

function AvoidBlock({ opt }: { opt: TierAvoid }) {
  const hw = getHardwareById(opt.hwId);
  if (!hw) return null;
  return (
    <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-rose-400">
          <XCircle className="h-3.5 w-3.5" />
          Kaçın
        </div>
        <div className="flex items-center gap-2 text-sm">
          <ProductLink name={hw.name} url={hw.url} className="font-medium" />
          <span className="font-mono text-xs text-muted-foreground">
            ({formatTRY(opt.priceTL)})
          </span>
        </div>
      </div>
      <div className="text-xs leading-relaxed text-foreground/80">
        {opt.reason}
      </div>
    </div>
  );
}

/* ───────────────────────── MetricChip ───────────────────────── */

type ChipTone = "primary" | "sky" | "emerald" | "amber" | "rose";

function MetricChip({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: ChipTone;
}) {
  const toneCls: Record<ChipTone, string> = {
    primary: "border-primary/30 bg-primary/5 text-primary",
    sky: "border-sky-500/30 bg-sky-500/5 text-sky-400",
    emerald: "border-emerald-500/30 bg-emerald-500/5 text-emerald-400",
    amber: "border-amber-500/30 bg-amber-500/5 text-amber-400",
    rose: "border-rose-500/30 bg-rose-500/5 text-rose-400",
  };
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 rounded-md border px-2.5 py-1.5",
        toneCls[tone],
      )}
    >
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider opacity-80">
        {icon}
        {label}
      </div>
      <div className="font-mono text-sm font-semibold">{value}</div>
    </div>
  );
}

/* ───────────────────────── RichText (minimal bold) ───────────────────────── */

/**
 * **bold** kullanımını destekler — ReactMarkdown ağırdır, bu minimal
 * süsleyici takeaway/ bullet metinleri için yeterli.
 */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-foreground">
              {p.slice(2, -2)}
            </strong>
          );
        }
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

/* ───────────────────────── Final karşılaştırma tablosu ───────────────────────── */

interface FinalRow {
  tier: string;
  winner: string;
  hwId: string;
  donanimTL: number;
  extra?: string;
  usable: number;
  tps70B: number;
  monthlyTL: number;
  loadDb: number;
  summer: number;
}

function FinalComparisonTable() {
  const rows: FinalRow[] = [
    buildRow("90K", "Mac mini M4 Pro 12/16 24GB", "mac-mini-m4-pro-24", 78_000, 0),
    buildRow(
      "150K",
      "Mac Studio M2 Ultra 64GB (2. el)",
      "mac-studio-m2-ultra-64-used",
      115_000,
      13,
    ),
    buildRow(
      "200K",
      "M2 Ultra 64GB + bulut fonu",
      "mac-studio-m2-ultra-64-used",
      115_000,
      13,
      "+85K TL bulut",
    ),
    buildRow(
      "350K",
      "Mac Studio M3 Ultra 192GB",
      "mac-studio-m3-ultra-192",
      320_000,
      18,
    ),
    buildRow(
      "500K",
      "M3 Ultra 192GB + hibrit fon",
      "mac-studio-m3-ultra-192",
      320_000,
      18,
      "+180K TL bulut",
    ),
  ];

  return (
    <div className="my-10">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        5 kademe — tek sayfada özet
      </h3>
      <ComparisonTable<FinalRow>
        caption="Bütçe kademeleri karşılaştırma matrisi"
        getRowKey={(r) => r.tier}
        dense
        columns={[
          {
            key: "tier",
            label: "Bütçe",
            render: (r) => (
              <span className="font-mono text-sm font-semibold text-primary">
                {r.tier}
              </span>
            ),
          },
          {
            key: "winner",
            label: "Kazanan",
            render: (r) => (
              <div>
                <div className="text-sm font-medium">{r.winner}</div>
                <div className="font-mono text-[11px] text-muted-foreground">
                  {formatTRY(r.donanimTL)}
                  {r.extra ? ` · ${r.extra}` : ""}
                </div>
              </div>
            ),
          },
          {
            key: "usable",
            label: "Usable",
            align: "right",
            render: (r) => (
              <span className="font-mono text-xs">{r.usable} GB</span>
            ),
          },
          {
            key: "tps70B",
            label: "70B tok/s",
            align: "right",
            render: (r) => (
              <span className="font-mono text-xs text-foreground">
                {r.tps70B}
              </span>
            ),
          },
          {
            key: "monthlyTL",
            label: "Elektrik/ay",
            align: "right",
            render: (r) => (
              <span
                className={cn(
                  "font-mono text-xs",
                  r.monthlyTL <= 100
                    ? "text-emerald-400"
                    : r.monthlyTL <= 300
                      ? "text-amber-400"
                      : "text-rose-400",
                )}
              >
                {Math.round(r.monthlyTL)} TL
              </span>
            ),
          },
          {
            key: "loadDb",
            label: "Yük dB",
            align: "right",
            render: (r) => (
              <span
                className={cn(
                  "font-mono text-xs",
                  r.loadDb <= 35
                    ? "text-emerald-400"
                    : r.loadDb <= 45
                      ? "text-amber-400"
                      : "text-rose-400",
                )}
              >
                {r.loadDb}
              </span>
            ),
          },
          {
            key: "summer",
            label: "Yaz ↓",
            align: "right",
            render: (r) => (
              <span
                className={cn(
                  "font-mono text-xs",
                  r.summer <= 7
                    ? "text-emerald-400"
                    : r.summer <= 15
                      ? "text-amber-400"
                      : "text-rose-400",
                )}
              >
                −%{r.summer}
              </span>
            ),
          },
        ]}
        data={rows}
      />
    </div>
  );
}

function buildRow(
  tier: string,
  winner: string,
  hwId: string,
  donanimTL: number,
  tps70B: number,
  extra?: string,
): FinalRow {
  const hw = getHardwareById(hwId);
  const elec = hw ? hardwareMonthlyElectricityTR(hw, 4) : null;
  return {
    tier,
    winner,
    hwId,
    donanimTL,
    extra,
    usable: hw ? usableLLMMemoryGB(hw) : 0,
    tps70B,
    monthlyTL: elec ? elec.monthlyTL : 0,
    loadDb: hw?.noiseDbLoad ?? 0,
    summer: Math.round((hw?.summerThermalPenalty ?? 0) * 100),
  };
}
