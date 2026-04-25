import type { ReactNode } from "react";
import { MessageCircleQuestion, Sparkles } from "lucide-react";
import { Section } from "./Section";
import { SectionHeader } from "../SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarkdownNote } from "../MarkdownNote";
import {
  TryPerGBBarChart,
  PriceTierCompact,
} from "../charts/TryPerGBBarChart";
import { BudgetPathChart } from "../charts/BudgetPathChart";
import { HeadToHead } from "../charts/HeadToHead";
import { LivabilityChart } from "../charts/LivabilityChart";
import { ProductLink } from "../ProductLink";
import { getHardwareById } from "@/data/hardware";
import { tryElectricityMonthlyTL } from "@/lib/calc";

/**
 * Araştırma günlüğü: Bu bölüm canlı bir konuşma arşivi gibi büyür.
 * Her yeni soru için yeni bir <ResearchEntry /> eklenir.
 */
export function ArastirmaNotlari() {
  return (
    <Section id="arastirma">
      <SectionHeader
        eyebrow="09 · Araştırma Notları"
        title="Canlı soru-cevap günlüğü"
        description="Bu bölüm, dashboard üzerinde yapılan kişisel araştırmanın konuşma kayıtlarını tutar. Her yeni soru verilerle birlikte yanıtlanır."
      />

      <ResearchEntry
        index="Q0"
        tags={["Temel", "Kullanım Profili", "Persona", "Metodoloji"]}
        question={`Hangi donanımı almalıyım sorusunun cevabı için önce ne sormalıyım? Karar çerçevesi tek bir metriğe ("70B tokens/sec") indirgenemez — kullanım profilimi nasıl tanımlayayım?`}
        summary={`4 metrik + 4 persona çerçevesi: hedef model boyutu · günlük token · eşzamanlı kullanıcı · context uzunluğu. Dashboard'daki tüm sonraki sorular bu profile göre yeniden yorumlanır. Profil yoksa cevap da yok — ilk adım budur.`}
      >
        <div className="space-y-6">
          <Subtitle>Karar öncesi kendine sormanı istediğim 4 soru</Subtitle>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            <QuestionCard
              icon="🧠"
              title="Hedef model boyutu"
              options={["≤ 13B", "32B (kod)", "70B (dense)", "120B+ (MoE)"]}
              why="Bellek tavanını belirler. 70B dense ≠ 120B MoE — ikisi farklı donanım sınıfı."
            />
            <QuestionCard
              icon="📈"
              title="Günlük token"
              options={["< 50K (hobi)", "50-250K (günlük asistan)", "250K-1M (ağır kod)", "> 1M (ekip)"]}
              why="Cloud API vs yerel break-even'ın eksenidir. Maliyet bölümündeki eğri bu sayıya göre okunur."
            />
            <QuestionCard
              icon="👥"
              title="Eşzamanlı kullanıcı"
              options={["1 (tek ben)", "2-5 (aile/ev)", "5-20 (küçük ekip)", "20+ (servis)"]}
              why="Concurrency olmayan tek kullanıcıda Apple Silicon iyi; 5+'da NVIDIA + vLLM batching zorunlu."
            />
            <QuestionCard
              icon="📏"
              title="Ortalama context"
              options={["< 2K (chat)", "4-8K (özet)", "16-32K (RAG)", "64K+ (kod tabanı)"]}
              why="Uzun context → prompt-eval darboğazı. Apple'da TTFT 4090'ın 1/6'sı. Donanım tablosunda yeni 'Prompt TPS' kolonu."
            />
          </div>

          <Subtitle>4 persona · bu dashboard için gerçekçi profiller</Subtitle>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <PersonaCard
              title="🎓 Öğrenen / Hobi"
              target="13B dense, 30B-A3B MoE"
              tokensDay="< 50K"
              concurrency="1"
              context="< 4K"
              verdict="Mac mini M4 Pro 48GB (92K TL) veya tek RTX 4070 (45K TL)"
              fit="success"
              reasoning="Sessiz + yeni + garanti. Amaç bir şey çalıştırmak, çalıştırmaya devam ettirmek değil."
            />
            <PersonaCard
              title="💻 Kod Asistanı · Bireysel"
              target="32B Coder → 70B Q4"
              tokensDay="100-500K"
              concurrency="1"
              context="16-32K (repo)"
              verdict="Dual RTX 3090 (~150K ₺ DIY) 🥇"
              fit="primary"
              reasoning="Yüksek TTFT zorunlu (prompt-eval 4200 tok/s). Long-context + batch decode. Apple burada %40 kaybeder."
            />
            <PersonaCard
              title="🗂️ RAG / Agent · Ekip"
              target="70B Q4 veya GPT-OSS 120B"
              tokensDay="1M+"
              concurrency="5-20"
              context="32K+"
              verdict="Dual 3090 + vLLM, ya da kiralık A100 (cloud)"
              fit="warning"
              reasoning="vLLM continuous batching zorunlu. Apple ekosistemi concurrency'de çöker. 1M+ token/gün ise DeepSeek V3.1 API (~12 ₺/M in, ~50 ₺/M out) çoğu zaman daha ucuz."
            />
            <PersonaCard
              title="🔒 Mahremiyet Birincil"
              target="Esnek · kalite > hız"
              tokensDay="Değişken"
              concurrency="1-3"
              context="Değişken"
              verdict="Mac Studio M2 Ultra 64GB ikinci el (~115K ₺)"
              fit="accent"
              reasoning="Amaç internete çıkmamak. Sessiz, düşük güç, air-gapped çalışabilir. Token/dolar ikincil; veriyi kendin tutmak birincil."
            />
          </div>

          <MarkdownNote tone="insight" title="Bu bölümü neden ekledim">
{`Dashboard'daki Q2 ve Q3 "TL/GB" ve "70B tok/s" üzerine kuruluydu. Ama bu metrikler sadece **kod asistanı bireysel** persona'sı için geçerli. Hobi kullanıcısı için 150K ₺ Dual 3090 saçma, RAG ekibi için 115K ₺ M2 Ultra saçma. Karar çerçevesi tek bir "kullanıcı" varsayar — **hangi kullanıcı?** sorusu burada belgelenir.

Benim (bu dashboard sahibi) aktif profilim: **Kod Asistanı + RAG deneyi + mahremiyet önemli → hibrit**. Q2'nin "Dual 3090" kararı buna uygun.`}
          </MarkdownNote>

          <MarkdownNote tone="warning" title="Dürüst itiraf">
{`Dashboard interaktif bir profil seçici **değil** (frontend-only, state kalıcılığı yok). Bu bölüm bir *rehber*: kendini bir persona'ya yerleştir, dashboard'ın geri kalanını o filtreyle oku. Q5 (MoE) ve Q7 (fine-tune) özellikle farklı persona'lara hitap eder.`}
          </MarkdownNote>
        </div>
      </ResearchEntry>

      <ResearchEntry
        index="Q1"
        tags={["Apple Silicon", "PC Kasa", "Mac mini vs Mac Studio", "Türkiye"]}
        question={`Bu iş için bir kasa toplamak mı mantıklı, yoksa Apple Silicon mı? Mac mini M4 (256GB, 30K TL) ile Mac Studio M4 Max 36GB/512GB (120K TL, 4x) karşılaştırması?`}
        summary={`Ham fiyat/performans → PC kasa (CUDA + ikinci el GPU). Sessiz + düşük güç + MacOS ekosistemi → Apple. Mac mini vs Mac Studio: TL başına tok/s'de Mac mini %40 daha ucuz, ama yetenek spektrumu dar (32B+ çalışmaz).`}
      >
        <div className="space-y-6">
          <Subtitle>3 eksen karşılaştırması</Subtitle>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <AxisCard
              title="Ham hız (tok/s)"
              winner="PC kasa"
              detail="CUDA ekosistemi hâlâ zirvede. RTX 4090 aynı bütçede M4 Max'tan ~2x hızlı."
            />
            <AxisCard
              title="Bellek esnekliği"
              winner="Apple Silicon"
              detail="Unified memory 36-192GB arası. 4090 sadece 24GB VRAM ile tavan."
            />
            <AxisCard
              title="Gerçek maliyet (TR)"
              winner="Apple Silicon"
              detail="3 saat/gün yükte elektrik farkı: ~250 TL/ay Mac lehine."
            />
          </div>

          <Subtitle>Mac mini M4 (30K) vs Mac Studio M4 Max 36GB (120K)</Subtitle>
          <PriceTierCompact />

          <MarkdownNote tone="insight" title="Tek cümle karar">
{`**7-8B modeller iş görüyorsa Mac mini 30K'da şok derecede iyi değer.** 4x fiyat farkına girmenin anlamı ancak 32B Coder / multimodal / büyük model ihtiyacında ortaya çıkar.`}
          </MarkdownNote>

          <Subtitle>Gizli maliyet kontrolü</Subtitle>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <StatRow
              label="Mac Studio M4 Max · aylık elektrik"
              value="~42 TL"
              sub="90W yük · 3 saat/gün · 3 TL/kWh"
              tone="success"
            />
            <StatRow
              label="PC RTX 4090 · aylık elektrik"
              value="~300 TL"
              sub="500W yük · 3 saat/gün · 3 TL/kWh"
              tone="danger"
            />
          </div>
        </div>
      </ResearchEntry>

      <ResearchEntry
        index="Q2"
        tags={[
          "Büyük Model",
          "70B",
          "Uygun Fiyat",
          "Dual 3090",
          "M2 Ultra",
          "Kullanıcı Hedefi",
        ]}
        question={`Hız ikincil, kullanılabilir olsun yeter — büyük modelleri uygun fiyata çalıştırmak. Bu durumda hangisi mantıklı?`}
        summary={`Karar ekseni: "Kullanılabilir bellek / TL". Dual RTX 3090 (ikinci el DIY, ~150K ₺, 48GB VRAM) ve Mac Studio M2 Ultra 64GB (ikinci el, ~115K ₺) iki kazanan. Not: 2026-Q2'de 2. el 3090 fiyatları 25-30K ₺'ye yükseldi; 120K ₺ bütçe Dual 3090 için artık yetmiyor. Mac mini/M4 Max 36GB "büyük model" hedefi için yetersiz.`}
        primary
      >
        <div className="space-y-6">
          <Subtitle>Ana metrik: TL başına kullanılabilir bellek</Subtitle>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Donanım × TL/GB (düşük = iyi)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TryPerGBBarChart />
            </CardContent>
          </Card>

          <Subtitle>Büyük model için 3 kazanan</Subtitle>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            <WinnerCard
              rank="🥇"
              title="Mac Studio M2 Ultra 64GB (ikinci el)"
              price="~115K ₺"
              vram="~45GB kullanılabilir"
              speed="70B Q4: 12-15 tok/s"
              url={getHardwareById("mac-studio-m2-ultra-64-used")?.url}
              pros={[
                "Bu bütçede tek sessiz seçenek",
                "800 GB/s bant (M4 Max'in 2x'i)",
                "MLX ekosistemi olgun · 130W yük",
              ]}
              cons={[
                "İkinci el garanti riski",
                "CUDA yok (fine-tune zor)",
                "Upgrade yok",
              ]}
              tone="accent"
            />
            <WinnerCard
              rank="🥈"
              title="Dual RTX 3090 PC (DIY)"
              price="~150K ₺"
              vram="48GB VRAM"
              speed="70B Q4: 18-25 tok/s"
              url={getHardwareById("pc-dual-3090")?.url}
              pros={[
                "Hız zirvesi (20 tok/s)",
                "CUDA + vLLM + fine-tune",
                "Upgrade yolu açık",
              ]}
              cons={[
                "2026-Q2: 2× 3090 2. el 55-60K ₺",
                "DIY 135-160K ₺, hazır 180-220K ₺",
                "1500W PSU · gürültü · ısı",
              ]}
              tone="primary"
            />
            <WinnerCard
              rank="🥉"
              title="Tek RTX 3090 + 64GB RAM"
              price="~85K ₺"
              vram="24GB VRAM + offload"
              speed="70B Q4: 5-8 tok/s"
              url={getHardwareById("pc-single-3090")?.url}
              pros={[
                "En ucuz 24GB VRAM yolu",
                "32B modeller çok rahat",
                "Sonra 2. GPU ekleme yolu",
              ]}
              cons={[
                "70B'de yavaş (partial offload)",
                "Hala 420W yük",
                "Gerçek 'büyük model' için sınırda",
              ]}
              tone="success"
            />
          </div>

          <MarkdownNote tone="insight" title="Tek cümle karar (2026-Q2 güncellemesi)">
{`**Bütçe 115-120K ₺ ve büyük model hedefiyse**: 2026-Q2'de bu bütçede tek gerçekçi kazanan **Mac Studio M2 Ultra 64GB ikinci el**. Dual 3090 DIY artık ~150K ₺'ya dayanıyor (2. el kart fiyatları yükseldi) — hız + fine-tune kapısı birincil ise bütçeyi 150K ₺'ya çıkarmak gerek.`}
          </MarkdownNote>

          <Subtitle>Elendi: bu hedef için uygun değil</Subtitle>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <EliminatedCard
              name="Mac mini M4 16GB"
              reason="11GB kullanılabilir bellek → 30B bile sığmaz."
            />
            <EliminatedCard
              name="Mac Studio M4 Max 36GB"
              reason="120K ₺'ye rağmen 25GB kullanılabilir; 70B ancak Q3 (~5 tok/s, sınırda)."
            />
            <EliminatedCard
              name="Tek RTX 4090"
              reason="24GB VRAM ile 70B tam sığmaz; aynı fiyata Dual 3090 DIY 48GB daha iyi (bütçe 150K'ya dayanacaksa)."
            />
          </div>

          <MarkdownNote tone="warning" title="Büyük model alımında dikkat">
{`- **3090 ikinci el**: madencilik kartı olabilir. Termal pad / termal macun yenilenmiş mi sor, stres testi iste.
- **Dual GPU PSU**: en az 1000W (tepe 750W). Ucuz PSU sistemi tuğlalar.
- **Mac Studio ikinci el**: Apple serisi doğrulaması, gerçek yaşam MacOS sürümü uyumluluğu.
- **Qwen 2.5 72B / Llama 3.3 70B**: günümüzde ikisi de 70B civarı; Qwen genelde benchmarkta daha iyi.`}
          </MarkdownNote>
        </div>
      </ResearchEntry>

      <ResearchEntry
        index="Q3"
        tags={[
          "120K TL",
          "Bütçe Optimizasyonu",
          "Cluster",
          "Mac mini M4 Pro",
          "Exo Labs",
        ]}
        question={`Aynı bütçe ile (~120K ₺) en büyük modelleri çalıştırabilmek için en iyi yol nedir? M4 Mac mini'leri birleştirmek (cluster) mi mantıklı, yoksa tek kasa mı? Güncel Türkiye fiyatlarıyla tüm seçenekleri karşılaştır.`}
        summary={`120K ₺ bütçesinde 70B Q4 hedefi için 6 gerçekçi yol var. 2026-Q2 güncellemesi: Dual 3090 DIY artık ~150K ₺ (2. el GPU fiyatları yükseldi), bütçe dışına çıktı. 120K'da kazanan: Mac Studio M2 Ultra 64GB ikinci el (~115K ₺, 13 tok/s, en yüksek bant) veya Mac mini M4 Pro 14/20 48GB 1TB (~125K ₺, yeni + sessiz + 70B Q4 sığar). Clustering sadece 256GB+ pool istiyorsan (DeepSeek V3 671B) anlamlı — o da 572K ₺. **2026-Q2 sıfır fiyat güncellemesi:** Mac Studio M2 Ultra 64GB sıfır 160K ₺, Mac mini M4 Pro 24GB sıfır 78K ₺. Eşit bütçeli 160-172K senaryosunun detaylı kıyası için Sayfa 12'ye bak.`}
        primary
      >
        <div className="space-y-6">
          <Subtitle>Güncel TL fiyatlarla — 70B Q4 pratik hızı</Subtitle>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Llama 3.3 70B Q4 · 120K TL bütçe karşılaştırması
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BudgetPathChart />
            </CardContent>
          </Card>

          <Subtitle>120K ₺ bütçesinde gerçek seçenekler — 2026-Q2 güncel fiyat</Subtitle>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
            <BudgetCard
              rank="A"
              title="Mac Studio M2 Ultra 64GB (2. el)"
              price="~115K ₺"
              usable="~45 GB unified"
              speed="70B Q4: 13 tok/s"
              url={getHardwareById("mac-studio-m2-ultra-64-used")?.url}
              verdict="🥇 Bütçede kalan tek sessiz seçenek"
              pros={[
                "800 GB/s bant genişliği",
                "130W max · fansız gibi",
                "MLX ekosistem olgun",
              ]}
              cons={[
                "İkinci el garanti riski",
                "CUDA yok (fine-tune zor)",
                "Upgrade yok",
              ]}
              tone="accent"
            />
            <BudgetCard
              rank="B"
              title="Mac mini M4 Pro 14/20 · 48GB · 1TB"
              price="~125K ₺"
              usable="~34 GB unified"
              speed="70B Q4: 7-8 tok/s"
              url={getHardwareById("mac-mini-m4-pro-48")?.url}
              verdict="🥇 Yeni + garanti, bütçeye yakın"
              pros={[
                "Apple TR yeni · 3 yıl garanti opsiyonu",
                "70W max · tamamen sessiz",
                "TB5 · 1TB SSD tam hızlı",
              ]}
              cons={[
                "273 GB/s bant (M2 Ultra'nın ⅓'ü)",
                "70B Q4 tight, Q5 sığmaz",
                "Fine-tune ekosistemi zayıf",
              ]}
              tone="success"
            />
            <BudgetCard
              rank="C"
              title="Tek RTX 3090 + 64GB RAM"
              price="~85K ₺"
              usable="22 GB VRAM + offload"
              speed="70B Q4: 6 tok/s"
              url={getHardwareById("pc-single-3090")?.url}
              verdict="💰 En ucuz yol · 35K ₺ boşluk"
              pros={[
                "32B modeller tam VRAM'de",
                "2. el 3090 25-30K ₺",
                "Sonra 2. GPU → Dual 3090 yolu",
              ]}
              cons={[
                "70B partial offload (yavaş)",
                "Gerçek 'büyük model' için sınırda",
              ]}
              tone="muted"
            />
            <BudgetCard
              rank="D"
              title="4× Mac mini M4 16GB/512GB (Exo cluster)"
              price="~172K ₺"
              usable="~44 GB pool"
              speed="70B Q4: 2-3 tok/s"
              url={getHardwareById("cluster-4x-mac-mini-m4-16")?.url}
              verdict="⚠️ Demo · niş kullanıcı"
              pros={[
                "İncremental alım (önce 2, sonra 4)",
                "Node bağımsız kullanılabilir",
                "Eğitici — clustering öğrenilir",
              ]}
              cons={[
                "512GB sıfır fiyatıyla bütçe +52K → 120K bütçesini aşar",
                "TB4 interconnect darboğazı · TP overhead",
                "Mac Studio 4× daha hızlı (aynı bütçe)",
                "Detaylı: sayfa 11",
              ]}
              tone="warning"
            />
            <BudgetCard
              rank="E"
              title="Mac mini M4 Pro 14/20 · 64GB · 1TB"
              price="~142K ₺ (bütçe aşar)"
              usable="~45 GB unified"
              speed="70B Q4: 8-10 tok/s"
              url={getHardwareById("mac-mini-m4-pro-64")?.url}
              verdict="⚡ 22K ₺ daha → %40 daha iyi"
              pros={[
                "Yeni + Apple garanti",
                "75W · sessiz · 1TB · TB5",
                "70B Q4 konforlu + context rahat",
              ]}
              cons={[
                "120K bütçeyi 22K ₺ aşar",
                "M2 Ultra 2. el daha hızlı",
              ]}
              tone="neutral"
            />
            <BudgetCard
              rank="F"
              title="Dual RTX 3090 PC DIY (2. el)"
              price="~150K ₺ (bütçe aşar)"
              usable="~43 GB VRAM"
              speed="70B Q4: 20 tok/s"
              url={getHardwareById("pc-dual-3090")?.url}
              verdict="🥇 Hız kralı · 30K ₺ aşırma"
              pros={[
                "Ham hızda rakipsiz",
                "CUDA + vLLM + fine-tune",
                "Büyük modellere ölçeklenir",
              ]}
              cons={[
                "2026-Q2: 2. el 3090 25-30K ₺ × 2 + sistem",
                "DIY 135-160K ₺ · hazır 180-220K",
                "1500W PSU, gürültü, ısı, ~685 ₺/ay elektrik",
              ]}
              tone="primary"
            />
          </div>

          <Subtitle>Cluster: ne zaman anlamlı?</Subtitle>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="border-emerald-500/30 bg-emerald-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-emerald-400">
                  ✅ Cluster değer katar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-xs text-muted-foreground">
                <p>
                  <strong className="text-foreground">120B+ modeller için:</strong>{" "}
                  70B+ pool (128GB+) tek kasada pahalıya patlar; 2x M4 Pro 64GB
                  TB5 cluster aynı bütçe + daha esnek.
                </p>
                <p>
                  <strong className="text-foreground">DeepSeek V3 671B / Kimi K2:</strong>{" "}
                  Tek kasada sadece M3 Ultra 192GB (320K TL) veya 4x cluster (480K).
                </p>
                <p>
                  <strong className="text-foreground">İncremental büyüme:</strong>{" "}
                  Önce 1 node al, modeller büyüdükçe ikincisini ekle.
                </p>
              </CardContent>
            </Card>
            <Card className="border-rose-500/30 bg-rose-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-rose-400">
                  ❌ Cluster tuzak olur
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-xs text-muted-foreground">
                <p>
                  <strong className="text-foreground">70B hedef + 120K ₺ bütçe:</strong>{" "}
                  Mac mini M4 Pro 48GB (125K) 7-8 tok/s; 4x M4 16 cluster (124K) 3 tok/s.
                  Karmaşıklık kârı yok.
                </p>
                <p>
                  <strong className="text-foreground">TB4 interconnect:</strong>{" "}
                  TB5 RDMA bulamazsan overhead tensor parallel'i yer.
                </p>
                <p>
                  <strong className="text-foreground">Fine-tune / LoRA:</strong>{" "}
                  Cluster MLX dağıtımı var ama CUDA ekosistemi hâlâ çok ileride.
                </p>
              </CardContent>
            </Card>
          </div>

          <MarkdownNote tone="insight" title="120K ₺ için tek cümle karar ağacı (2026-Q2)">
{`- **Ham hız + fine-tune + 30K ₺ ek bütçe tamamsa** → **Dual RTX 3090 DIY** (~150K ₺, 20 tok/s, CUDA bonus)
- **Sessiz, düşük güç, yüksek bant · bütçede kal** → **Mac Studio M2 Ultra 64GB ikinci el** (~115K ₺, 13 tok/s)
- **Yeni + garanti · bütçe esnekse 5K ₺ aş** → **Mac mini M4 Pro 14/20 48GB 1TB** (~125K ₺, 7-8 tok/s)
- **22K ₺ daha varsa daha dengeli** → **Mac mini M4 Pro 14/20 64GB 1TB** (~142K ₺, 8-10 tok/s)
- **En ucuz yol, sonra büyüt** → **Tek RTX 3090 + 64GB RAM** (~85K ₺, 35-65K ₺ boşluk)`}
          </MarkdownNote>

          <MarkdownNote tone="warning" title="Exo cluster gerçekleri (doğrulama kaynakları)">
{`- **Llama 3.3 70B Q4 · 8x M4 Pro 64GB Mac mini cluster (512GB pool)**: ~3.89 tok/s (Exo Labs Day-2).
- **Nemotron 70B · 4x M4 Pro 64GB + TB5**: ~8 tok/s (heise.de, 2026 Q1).
- **DeepSeek V3 671B Q4 · aynı 8x cluster**: 5.37 tok/s (pratik sınır).
- **Tensor parallel ölçeklenme**: 2 cihaz 1.8x, 4 cihaz 3.2x (tam 4x değil — interconnect overhead).
- **M4 Pro bant/compute oranı**: 8.02 (RTX 4090: 1.52). LLM inference memory-bound olduğu için Apple mimarisi 5x daha uygun, ama clock-speed farkı açığı kapatıyor.`}
          </MarkdownNote>

          <Subtitle>Head-to-Head: 4x Mac mini vs Dual RTX 3090</Subtitle>
          <p className="-mt-2 text-xs text-muted-foreground">
            Q3'ün iki "büyük model" favorisi aynı spec-matrisinde. Sekmeyle
            bütçe-eşit ve yetenek-referansı senaryolarını değiştir.
          </p>
          <HeadToHead />

          <Subtitle>Fiyat kaynakları (2026 Q2, Türkiye)</Subtitle>
          <div className="rounded-lg border border-border/60 bg-secondary/30 p-3 text-xs text-muted-foreground">
            <ul className="grid grid-cols-1 gap-1 md:grid-cols-2">
              <li>Mac mini M4 Pro 12/16 · 24GB · 512GB: <span className="font-mono text-foreground">~80-85K ₺</span> (Troyestore, Teknosa, Trendyol)</li>
              <li>Mac mini M4 Pro 12/16 · 48GB · 1TB: <span className="font-mono text-foreground">~92K ₺</span> (Troyestore)</li>
              <li>Mac mini M4 Pro 14/20 · 48GB · 1TB: <span className="font-mono text-foreground">~120-128K ₺</span> (Apple TR BTO · kullanıcı gözlemi: 125K)</li>
              <li>Mac mini M4 Pro 14/20 · 64GB · 1TB: <span className="font-mono text-foreground">~135-145K ₺</span> (Apple TR BTO)</li>
              <li>Mac Studio M2 Ultra 64GB 2. el: <span className="font-mono text-foreground">~115K ₺</span> (TR pazarı; ABD eBay ~72-103K ₺ + gümrük)</li>
              <li>RTX 3090 2. el: <span className="font-mono text-foreground">~25-30K ₺/kart</span> (Technopat 2026-Q2, Sahibinden)</li>
              <li>Dual 3090 DIY toplam: <span className="font-mono text-foreground">~135-160K ₺</span> (2× GPU 55-60K + yeni sistem 80-100K)</li>
              <li>Dual 3090 pre-built: <span className="font-mono text-foreground">~180-220K ₺</span> (Greenbeast $3.499 / Custom Lux $4.999 ithalat)</li>
              <li>Exo Labs benchmark: <span className="font-mono text-foreground">blog.exolabs.net/day-2</span></li>
            </ul>
          </div>
        </div>
      </ResearchEntry>

      <ResearchEntry
        index="Q4"
        tags={[
          "2026 Yeni Sınıf",
          "NVIDIA GB10",
          "AMD Strix Halo",
          "Ascent GX10",
          "DGX Spark",
          "M5 Ultra",
        ]}
        question={`Bu konudaki en güncel haberler ve teknolojiler neler? ASUS Ascent GX10, NVIDIA DGX Spark, AMD Strix Halo gibi yeni "AI-özel mini workstation" sınıfı dashboard'ın kararını değiştirir mi?`}
        summary={`2025 Ekim ile "AI-özel mini workstation" sınıfı doğdu: NVIDIA GB10 (Ascent GX10 / DGX Spark) 128GB unified + CUDA, AMD Strix Halo 128GB + x86. Sayısal gerçek: 70B Q4 ham hızda Dual 3090 hâlâ kazanıyor. YENİ sınıfın değeri 70B'de değil, 120B-200B modellerde. Yaz 2026'da Apple M5 Ultra Mac Studio oyunu yeniden kurabilir.`}
      >
        <div className="space-y-6">
          <Subtitle>Sınıfın karakteri: 128GB unified + düşük güç</Subtitle>
          <p className="text-sm text-muted-foreground">
            Ortak DNA: 128GB unified memory, ~170-180W yük, mini kasa, ≥200B
            parametre modele kadar. Trade-off: bant genişliği düşük (~212-273 GB/s)
            → 70B Q4 sadece ~4-12 tok/s. Mesaj: <strong className="text-foreground">bu sınıf
            hız değil, belleğe odaklı</strong>.
          </p>

          <Subtitle>3 büyük oyuncu</Subtitle>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            <NewClassCard
              badge="NVIDIA CUDA"
              title="ASUS Ascent GX10"
              subtitle="NVIDIA GB10 Grace Blackwell"
              priceTR="~250.000 ₺"
              tone="primary"
              url={getHardwareById("asus-ascent-gx10")?.url}
              specs={[
                { label: "Unified memory", value: "128GB LPDDR5X" },
                { label: "AI compute", value: "1 PFLOPS (FP4)" },
                { label: "CPU", value: "20-core ARM Grace" },
                { label: "Bant genişliği", value: "273 GB/s" },
                { label: "Llama 70B Q4", value: "4.4 tok/s" },
                { label: "GPT-OSS 120B", value: "41 tok/s" },
                { label: "Güç (max)", value: "170 W" },
                { label: "OS", value: "Ubuntu + DGX OS" },
                { label: "TR satış", value: "Tebilon (stokta)" },
              ]}
              verdict="200B hedefli kullanıcılar için en 'resmi' yol. CUDA + NVFP4 tam destek. 70B için aşırı pahalı."
            />
            <NewClassCard
              badge="AMD x86"
              title="Framework Desktop"
              subtitle="Ryzen AI Max+ 395 (Strix Halo)"
              priceTR="~140.000 ₺ (128GB · ithalat)"
              tone="success"
              url={getHardwareById("framework-desktop-amd-395-128")?.url}
              specs={[
                { label: "Unified memory", value: "128GB LPDDR5X-8000" },
                { label: "VRAM allocatable", value: "96 GB" },
                { label: "iGPU", value: "Radeon 8060S · 40 CU" },
                { label: "NPU", value: "50 TOPS" },
                { label: "Bant genişliği", value: "~212 GB/s" },
                { label: "Llama 70B Q4", value: "5-12 tok/s" },
                { label: "Güç (max)", value: "180 W" },
                { label: "OS", value: "Linux + Windows" },
                { label: "TR satış", value: "Doğrudan yok (ithalat)" },
              ]}
              verdict="x86 + Windows tutkunu kullanıcılar için GX10'un rakibi. ROCm olgunsuz, CUDA ekosistemi eksik."
            />
            <NewClassCard
              badge="Apple — yakında"
              title="Mac Studio M5 Ultra (beklenen)"
              subtitle="Söylenti: 2026 Q2-Q3"
              priceTR="beklenen ~180.000-270.000 ₺"
              tone="accent"
              url="https://www.apple.com/tr/shop/buy-mac/mac-studio"
              specs={[
                { label: "Unified memory", value: "256GB+ (beklenen)" },
                { label: "Konfig", value: "32 CPU + 80 GPU core" },
                { label: "Mimari", value: "UltraFusion 2x M5 Max" },
                { label: "Bant genişliği", value: "~1 TB/s tahmini" },
                { label: "Çıkış", value: "Mart-Haziran 2026 (WWDC?)" },
                { label: "Not", value: "M4 Ultra atlandı" },
                { label: "OS", value: "macOS Tahoe+" },
                { label: "Durum", value: "Resmi duyuru yok" },
                { label: "TR satış", value: "Apple TR (çıktığında)" },
              ]}
              verdict="Çıkarsa oyunu değiştirebilir: 70B'de yüksek bant + 200B+ sığma avantajını tek sistemde birleştirir."
            />
          </div>

          <Subtitle>Büyük resim: aynı bütçede ne kazanıyor?</Subtitle>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Güncel 70B Q4 karşılaştırması — yeni sınıf dahil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-sm">
                  <thead>
                    <tr className="border-b border-border/60 bg-secondary/30 text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="px-3 py-2 text-left">Sistem</th>
                      <th className="px-3 py-2 text-right">TL</th>
                      <th className="px-3 py-2 text-right">Bellek</th>
                      <th className="px-3 py-2 text-right">70B Q4 tok/s</th>
                      <th className="px-3 py-2 text-right">200B sığar?</th>
                      <th className="px-3 py-2 text-right">TL/tok·s</th>
                    </tr>
                  </thead>
                  <tbody>
                    <ComparisonRow
                      name="PC + 2x RTX 3090 DIY (2. el)"
                      tl="~150K"
                      mem="48GB VRAM"
                      tps="20"
                      big="❌"
                      ratio="7.500"
                      highlight="primary"
                    />
                    <ComparisonRow
                      name="Mac Studio M2 Ultra 64GB (2. el)"
                      tl="~115K"
                      mem="64GB unified"
                      tps="13"
                      big="❌"
                      ratio="8.850"
                      highlight="accent"
                    />
                    <ComparisonRow
                      name="Mac mini M4 Pro 14/20 · 64GB · 1TB"
                      tl="~142K"
                      mem="64GB unified"
                      tps="8"
                      big="❌"
                      ratio="17.750"
                    />
                    <ComparisonRow
                      name="Framework Desktop 128GB (ithalat)"
                      tl="~140K"
                      mem="128GB unified"
                      tps="8"
                      big="✅"
                      ratio="17.500"
                    />
                    <ComparisonRow
                      name="ASUS Ascent GX10 (GB10)"
                      tl="~250K"
                      mem="128GB unified"
                      tps="4.4"
                      big="✅"
                      ratio="56.800"
                      highlight="warning"
                    />
                    <ComparisonRow
                      name="NVIDIA DGX Spark"
                      tl="~290K"
                      mem="128GB unified"
                      tps="4.4"
                      big="✅"
                      ratio="65.900"
                      highlight="warning"
                    />
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <MarkdownNote tone="insight" title="Bu güncellemenin 3 büyük mesajı">
{`1. **70B hızı odakta ise yeni sınıf PARA KAYBI**: GX10/DGX Spark 250K+ ₺, Dual 3090'ın ~150K ₺'de verdiği 20 tok/s hıza karşı 4.4 tok/s veriyor. 1.6-2× pahalı, 4.5× yavaş.
2. **200B+ model hedefi varsa yeni sınıf tek yol**: 128GB unified + CUDA (GX10) veya x86 (Strix Halo). Dual 3090 + 128GB RAM DeepSeek V3 671B çalıştıramaz.
3. **Bekleyebiliyorsan M5 Ultra 2026 Q2-Q3 oyunu değiştirebilir**: 256GB+ unified + Apple'ın bant avantajı (1 TB/s beklenen) 70B'de hız + 200B'de sığma birleşir. Apple M4 Ultra'yı atlayarak bunu hazırlıyor.`}
          </MarkdownNote>

          <Subtitle>Ustaca bir yol: Exo hibrit (DGX Spark + Mac Studio)</Subtitle>
          <div className="rounded-xl border border-chart-4/30 bg-chart-4/5 p-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Exo Labs'ın 2026-Q1 keşfi: <strong className="text-foreground">DGX Spark
              prefill güçlü, Mac Studio decode güçlü</strong>. İstekleri iki fazlara
              bölüp iki cihaza dağıtmak <strong className="text-chart-4">4x daha hızlı
              çıktı</strong> veriyor. Toplam maliyet ~400K TL ama 70B'de ~30-40
              tok/s ve 200B+ sığma birleşiyor. Kısıtlı bütçe için değil, mühendislik
              merakı için cazip.
            </p>
            <p className="mt-2 font-mono text-[11px] text-muted-foreground">
              Kaynak: blog.exolabs.net/nvidia-dgx-spark
            </p>
          </div>

          <MarkdownNote tone="warning" title="120K TL bütçesi için ne değişti?">
{`**Hiçbir şey değişmedi.** Q3'ün kazananları hâlâ geçerli:

- **Dual 3090 ikinci el** — 70B'de hızı geçilemez.
- **Mac Studio M2 Ultra 64GB ikinci el** — sessizlik + yüksek bant.
- **Mac mini M4 Pro 64GB** — yeni + garanti.

Yeni sınıf bu bütçede ulaşılabilir **değil**. Eğer bütçe 250K+ TL'ye çıkarsa **ve hedef 70B değil 120B-200B** ise, o zaman GX10 / Strix Halo / (beklenen) M5 Ultra masaya geliyor. Sırf "yeni ve pırıltılı" diye 2x bütçe harcama tuzağına düşme.`}
          </MarkdownNote>

          <Subtitle>Kaynaklar (2025 Ekim – 2026 Nisan)</Subtitle>
          <div className="rounded-lg border border-border/60 bg-secondary/30 p-3 text-xs text-muted-foreground">
            <ul className="grid grid-cols-1 gap-1 md:grid-cols-2">
              <li>ASUS Pressroom: "Ascent GX10 availability" (15 Ekim 2025)</li>
              <li>NVIDIA Marketplace · DGX Spark resmi sayfası</li>
              <li>Ollama blog: "NVIDIA DGX Spark performance"</li>
              <li>LMSYS: "DGX Spark In-Depth Review" (13 Ekim 2025)</li>
              <li>Tom's Hardware: DGX Spark vs Ryzen AI Max+ 395 review</li>
              <li>llm-tracker.info: Strix Halo GPU performance</li>
              <li>Framework: Desktop Mainboard resmi sayfa</li>
              <li>Exo Labs blog: hybrid DGX + Mac Studio (2026-Q1)</li>
              <li>TechTimes / MacObserver: M5 Ultra söylenti</li>
              <li>Tebilon.com: Ascent GX10 TR satış (249.957 TL)</li>
            </ul>
          </div>
        </div>
      </ResearchEntry>

      <ResearchEntry
        index="Q5"
        tags={["MoE", "DeepSeek V3", "Qwen3", "GPT-OSS 120B", "Sparse"]}
        question={`Her şey "70B dense tokens/sec" üzerine kurulu. MoE (Mixture of Experts) modelleri — GPT-OSS 120B, Qwen3 30B-A3B, DeepSeek V3.1 671B — bu paradigmayı değiştirir mi? Yerel AI için MoE ne anlama geliyor?`}
        summary={`MoE, "70B dense çalıştırmak için dual 3090 şart" teorisini boşa çıkarıyor. 2025 yılında 3 kilit model geldi: Qwen3 30B-A3B (3B aktif) Mac mini 16GB'da çalışır, GPT-OSS 120B (5B aktif) Framework 128GB'da yeni sınıfı haklı kılar, DeepSeek V3.1 671B (37B aktif) M3 Ultra 192GB'ta sığabilir. Karar çerçevesi yeniden yazılmalı.`}
      >
        <div className="space-y-6">
          <Subtitle>MoE'nin yerel AI için üç kırılımı</Subtitle>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            <MoEBreakCard
              tone="success"
              tier="Alt sınıf kurtarma"
              model="Qwen3 30B-A3B"
              stats={{
                total: "30B",
                active: "3B",
                vram: "~18 GB (Q4)",
                tps: "Mac mini 16GB'da 38 tok/s",
              }}
              insight="Mac mini M4 16GB (30K TL) ilk kez '70B sınıfı kalite' çalıştırabiliyor. Q2'de elenen donanım buraya geri dönüyor."
            />
            <MoEBreakCard
              tone="primary"
              tier="Yeni sınıfı haklı çıkarma"
              model="GPT-OSS 120B"
              stats={{
                total: "120B",
                active: "5B",
                vram: "~65 GB (Q4)",
                tps: "Framework 128GB'da 28, DGX Spark'ta 41",
              }}
              insight="Q4'te 'para kaybı' dediğimiz yeni sınıf donanımın TEK anlamlı görevi. Dense 70B Q4 sığıyor ama yavaş — 120B MoE bu donanımın neden alındığını anlatıyor."
            />
            <MoEBreakCard
              tone="accent"
              tier="Üst sınıf açma"
              model="DeepSeek V3.1 671B"
              stats={{
                total: "671B",
                active: "37B",
                vram: "~380 GB (Q4)",
                tps: "M3 Ultra 192GB'ta 12 tok/s (Q3)",
              }}
              insight="Claude Sonnet rakibi bir model tek makinede. M3 Ultra 192GB (~300K TL) ya da 4x Mac mini M4 Pro 64GB cluster — artık bu hedef gerçek."
            />
          </div>

          <Subtitle>MoE mantığı 30 saniyede</Subtitle>
          <div className="rounded-xl border border-border/60 bg-secondary/30 p-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              Dense model her token için <strong className="text-foreground">tüm</strong> parametreleri
              hesaba katar. MoE ise her token için sadece{" "}
              <strong className="text-chart-4">birkaç uzman (expert)</strong> aktif olur.
              Sonuç:
            </p>
            <ul className="mt-2 space-y-1">
              <li>
                <span className="text-primary">Bellek ihtiyacı</span>: toplam
                parametreye göre (hepsi RAM'de durmalı → 120B = 65GB Q4)
              </li>
              <li>
                <span className="text-accent">Hız</span>: aktif parametreye göre
                (5B aktif = 5B dense gibi hızlı)
              </li>
            </ul>
            <p className="mt-2">
              Yani <strong className="text-foreground">yeterli belleğin varsa</strong>,
              120B MoE sende 7B dense hızında çalışır. Apple Silicon'un unified memory
              avantajı burada özellikle değerli: LPDDR5X, GPU VRAM gibi pahalı değil.
            </p>
          </div>

          <Subtitle>MoE'nin karar çerçevesine etkisi</Subtitle>
          <MarkdownNote tone="insight" title="Üç kararın yeniden yazımı">
{`1. **Q1 (Mac mini vs Mac Studio)** — Mac mini 16GB "sadece hobi" değerlendirmesi yanlış. Qwen3 30B-A3B sayesinde **gerçek LLM** çalıştırıyor. Değeri ikiye katlandı.
2. **Q3 (120K TL bütçe)** — Bütçe ayarı "Mac mini M4 Pro 48GB" için artık anlamlı: 34GB unified'a 30B MoE çok iyi oturur, eski değerlendirmeden daha güçlü.
3. **Q4 (yeni sınıf)** — Framework 128GB + Strix Halo tek başına 70B dense için yavaş ama **120B MoE için doğru boy**. Yeni sınıfı savunulabilir kılan model kategorisi bu.`}
          </MarkdownNote>

          <MarkdownNote tone="warning" title="MoE'nin zayıf yönleri">
{`- **Fine-tune zorlaşır**: Expert routing'e dokunmak hassas, QLoRA desteği dense modeller kadar olgun değil.
- **vLLM serving**: Expert paralelizmi hâlâ gelişiyor, düşük concurrency'de sparse GPU kullanımı görülebilir.
- **Kalite eşit değil**: 120B MoE ≠ 120B dense. GPT-OSS 120B, Llama 3.3 70B dense'le benchmarklarda yaklaşık eşit, bazı alanlarda geride.
- **Disk alanı**: Q4 bile 18-65GB. Birden çok MoE indirmek 500GB SSD'yi hızla doldurur.`}
          </MarkdownNote>

          <MarkdownNote tone="insight" title="Karar: MoE + dense birlikte">
{`En akıllı yerel AI kurulumu **hibrit model stack**:

- **Günlük chat + RAG**: Qwen3 30B-A3B (hızlı, küçük VRAM)
- **Kod + long context**: Llama 3.3 70B veya Qwen 2.5 Coder 32B dense (daha tutarlı)
- **Zor görevler**: GPT-OSS 120B veya DeepSeek V3.1 (varsa donanım)

Ollama ile model switch saniyede olur. "Tek doğru model" yok — **görev başına model**.`}
          </MarkdownNote>

          <Subtitle>Kaynaklar</Subtitle>
          <div className="rounded-lg border border-border/60 bg-secondary/30 p-3 text-xs text-muted-foreground">
            <ul className="grid grid-cols-1 gap-1 md:grid-cols-2">
              <li>
                <a
                  href="https://qwenlm.github.io/blog/qwen3/"
                  target="_blank"
                  rel="noopener"
                  className="hover:text-primary"
                >
                  Qwen blog: Qwen3 model kartı
                </a>
              </li>
              <li>
                <a
                  href="https://openai.com/index/introducing-gpt-oss/"
                  target="_blank"
                  rel="noopener"
                  className="hover:text-primary"
                >
                  OpenAI: Introducing gpt-oss (Ağu 2025)
                </a>
              </li>
              <li>
                <a
                  href="https://api-docs.deepseek.com/news/news1226"
                  target="_blank"
                  rel="noopener"
                  className="hover:text-primary"
                >
                  DeepSeek V3 technical report
                </a>
              </li>
              <li>
                <a
                  href="https://huggingface.co/blog/moe"
                  target="_blank"
                  rel="noopener"
                  className="hover:text-primary"
                >
                  HF blog: Mixture of Experts explained
                </a>
              </li>
            </ul>
          </div>
        </div>
      </ResearchEntry>

      <ResearchEntry
        index="Q6"
        tags={["Cloud API", "Break-even", "2026", "Hibrit", "DeepSeek V3.1"]}
        question={`2026-Q1 cloud API fiyatları yerel AI kararını nasıl değiştiriyor? GPT-5, Claude 4.5, Gemini 2.5, DeepSeek V3.1 geldi; fiyatlar eski dashboard'un varsaydığından çok farklı. Yerel donanım hâlâ ekonomik olarak savunulabilir mi?`}
        summary={`Saf ekonomi açısından artık HAYIR. DeepSeek V3.1 (~12 ₺/M in, ~50 ₺/M out) yerel 70B'den daha yüksek kaliteli ve 99% senaryoda daha ucuz. Yerel AI kararının 2026'daki gerçekçi gerekçeleri: (1) mahremiyet, (2) offline, (3) öğrenme, (4) 24/7 sabit maliyet, (5) kuruluş uyumluluğu. "Ucuz" gerekçesi öldü.`}
      >
        <div className="space-y-6">
          <Subtitle>2026-Q1 fiyat tablosu (₺ / 1M token · kur 45 ₺/USD)</Subtitle>
          <Card>
            <CardContent className="overflow-x-auto p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-3 py-2">Model</th>
                    <th className="px-3 py-2 text-right">Input</th>
                    <th className="px-3 py-2 text-right">Output</th>
                    <th className="px-3 py-2 text-right">Kalite ~</th>
                    <th className="px-3 py-2 text-right">Context</th>
                  </tr>
                </thead>
                <tbody>
                  <CloudRow
                    name="GPT-5 (frontier)"
                    inp="56 ₺"
                    out="450 ₺"
                    quality="🏆 En üst"
                    ctx="400K"
                  />
                  <CloudRow
                    name="Claude Sonnet 4.5"
                    inp="135 ₺"
                    out="675 ₺"
                    quality="🏆 En üst (kod)"
                    ctx="1M"
                  />
                  <CloudRow
                    name="Gemini 2.5 Pro"
                    inp="56 ₺"
                    out="450 ₺"
                    quality="🏆 Üst"
                    ctx="2M"
                  />
                  <CloudRow
                    name="GPT-5 mini"
                    inp="11 ₺"
                    out="90 ₺"
                    quality="💎 Yerel 70B üstü"
                    ctx="400K"
                    highlight="primary"
                  />
                  <CloudRow
                    name="Gemini 2.5 Flash"
                    inp="14 ₺"
                    out="113 ₺"
                    quality="💎 Yerel 70B seviyesi"
                    ctx="1M"
                    highlight="primary"
                  />
                  <CloudRow
                    name="DeepSeek V3.1"
                    inp="12 ₺"
                    out="50 ₺"
                    quality="💎 Yerel 70B üstü (671B MoE)"
                    ctx="128K"
                    highlight="accent"
                  />
                  <CloudRow
                    name="DeepSeek V3.1 (cache)"
                    inp="3 ₺"
                    out="50 ₺"
                    quality="💎 Aynı — cache hit"
                    ctx="128K"
                    highlight="accent"
                  />
                  <CloudRow
                    name="Gemini 2.5 Flash-Lite"
                    inp="4.5 ₺"
                    out="18 ₺"
                    quality="⚡ Hızlı + ucuz"
                    ctx="1M"
                  />
                  <CloudRow
                    name="Groq GPT-OSS 120B"
                    inp="7 ₺"
                    out="34 ₺"
                    quality="⚡ Ultra hız (600+ tok/s)"
                    ctx="128K"
                  />
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Subtitle>Günlük 500K token için aylık fatura (ağır RAG / kod asistanı)</Subtitle>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            <PricePillCard
              label="GPT-5"
              monthly="~2.600 ₺"
              sub="Frontier · her iş"
              tone="danger"
            />
            <PricePillCard
              label="Gemini 2.5 Flash"
              monthly="~650 ₺"
              sub="Dashboard sweet spot"
              tone="primary"
            />
            <PricePillCard
              label="DeepSeek V3.1"
              monthly="~350 ₺"
              sub="70B yerel eşdeğeri"
              tone="success"
            />
            <PricePillCard
              label="Yerel (Dual 3090)"
              monthly="~4.850 ₺"
              sub="36ay amort · 5 ₺/kWh · 3 sa/gün · 150K ₺ DIY"
              tone="warning"
            />
          </div>

          <MarkdownNote tone="warning" title="Acı gerçek (2026-Q2 güncelleme)">
{`Dual 3090 DIY yerel (~150.000 ₺, 2026-Q2 gerçekçi fiyat) 36 aya **aylık ~4.850 ₺ sabit** (≈₺4.167 HW + ₺685 elektrik, marjinal 5 ₺/kWh).
DeepSeek V3.1 ile günlük 500K token (ağır kullanım) → **aylık ~350 ₺**.

Yerel AI'nın 36 ayda kendini amorti edebilmesi için günlük token kullanımının **~7 milyon token**'ı aşması gerekir — tek kişinin pratikte hiç ulaşamayacağı bir hacim. 2. el 3090 fiyatlarının %40 yükselmesiyle ekonomik uçurum daha da açıldı: yerel AI 2026'da **14× daha pahalı**.`}
          </MarkdownNote>

          <Subtitle>Peki neden hâlâ yerel AI?</Subtitle>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            <ReasonCard
              title="🔒 Mahremiyet"
              desc="Avukatlık, sağlık, müşteri verisi, kod tabanı → API'ye gönderilemez. Yerel AI'nın #1 gerçek gerekçesi."
            />
            <ReasonCard
              title="🌐 Offline + Bağımsızlık"
              desc="Internet yok, fiyat değişti, provider banladı — umurunda değil. Teknoloji bağımlılığı sıfır."
            />
            <ReasonCard
              title="🎓 Öğrenme"
              desc="Quantization, prompt-eval, context caching, batching — cloud'da soyut, yerel'de somut. Bir mühendis için paha biçilmez."
            />
            <ReasonCard
              title="📊 Sabit maliyet"
              desc="API'da kötü prompt = fatura patlar. Yerel'de hiç önemli değil. 24/7 agent workload için anlamlı."
            />
            <ReasonCard
              title="⚖️ Uyumluluk"
              desc="KVKK, GDPR, HIPAA gereksinimleri 'veri bizde kalır' şartı koyarsa cloud API imkansız."
            />
            <ReasonCard
              title="🧪 Deney"
              desc="Farklı modeller, fine-tune, LoRA eklemeler, custom quantization — API'da yapamazsın."
            />
          </div>

          <MarkdownNote tone="insight" title="Dashboard'ın yeniden konumlandırılması">
{`Bu dashboard başta şunu sorudu: **"Yerel AI mantıklı mı?"**. 2026-Q1 itibariyle sorunun cevabı **bağlama bağlı**:

- **Saf ekonomi** → Cloud kazanır (yerel ~3.600 ₺/ay, DeepSeek V3.1 ~350 ₺/ay aynı kalite · 10x fark).
- **Mahremiyet + bağımsızlık + öğrenme** → Yerel vazgeçilmez.
- **En iyisi**: %80 yerel (chat, RAG, kod), %20 cloud (frontier görevler için GPT-5 / Claude Opus). Zaten Maliyet bölümünde savunulan "hibrit" strateji bu.

Yerel AI 2024'te "ucuz"du. 2026'da **özgür**. İkisi aynı şey değil.`}
          </MarkdownNote>
        </div>
      </ResearchEntry>

      <ResearchEntry
        index="Q7"
        tags={["Fine-tune", "QLoRA", "Unsloth", "CUDA", "MLX"]}
        question={`Dashboard'ın odağı "model çalıştırma" ama gerçek değer genelde "kendi verine özelleştirme". QLoRA 70B eğitmek istersem hangi donanım gerekli? Apple Silicon bu iş için uygun mu? Cloud fine-tune ne kadar?`}
        summary={`QLoRA 70B: tek RTX 4090 (24GB) bile QLoRA ile sığar, dual 3090 (48GB) rahat bölge. Apple Silicon pratikte fine-tune için hâlâ kapalı kapı — MLX-LM 2025'te başladı ama ekosistem geride. Cloud alternatif: RunPod A100 saatlik ~85 ₺, 70B QLoRA ~8-16 saat (tek run 680-1.360 ₺). Yerel fine-tune için tek seçenek CUDA. Bu Q2/Q3 kararında Apple tarafının görünmez kaybı.`}
      >
        <div className="space-y-6">
          <Subtitle>QLoRA 70B — donanım eşikleri</Subtitle>
          <Card>
            <CardContent className="overflow-x-auto p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-3 py-2">Donanım</th>
                    <th className="px-3 py-2 text-right">VRAM</th>
                    <th className="px-3 py-2 text-right">QLoRA 70B</th>
                    <th className="px-3 py-2 text-right">Süre (50K örnek)</th>
                    <th className="px-3 py-2">Not</th>
                  </tr>
                </thead>
                <tbody>
                  <FineTuneRow
                    hw="RTX 4070 12GB"
                    vram="12 GB"
                    verdict="❌ 70B yok"
                    duration="—"
                    note="En fazla 7B QLoRA"
                    tone="danger"
                  />
                  <FineTuneRow
                    hw="Tek RTX 3090 24GB"
                    vram="24 GB"
                    verdict="⚠️ Sınırda"
                    duration="~24 saat"
                    note="4-bit + gradient checkpointing + rank 16"
                    tone="warning"
                  />
                  <FineTuneRow
                    hw="Tek RTX 4090 24GB"
                    vram="24 GB"
                    verdict="✅ QLoRA 70B"
                    duration="~12 saat"
                    note="Unsloth ile 2x daha hızlı; FA2 destekli"
                    tone="success"
                    highlight
                  />
                  <FineTuneRow
                    hw="Dual RTX 3090 48GB"
                    vram="48 GB"
                    verdict="✅ Rahat"
                    duration="~8 saat"
                    note="FSDP + QLoRA; rank 64 mümkün"
                    tone="primary"
                    highlight
                  />
                  <FineTuneRow
                    hw="Mac Studio M2 Ultra 64GB"
                    vram="~45 GB"
                    verdict="⚠️ Deneysel"
                    duration="~30-50 saat"
                    note="MLX-LM LoRA var; QLoRA hâlâ yetersiz; ekosistem zayıf"
                    tone="warning"
                  />
                  <FineTuneRow
                    hw="Mac Studio M3 Ultra 192GB"
                    vram="~135 GB"
                    verdict="⚠️ Teoride var"
                    duration="?"
                    note="Bandwidth yüksek ama compute optimizasyon eksik"
                    tone="warning"
                  />
                  <FineTuneRow
                    hw="ASUS Ascent GX10 128GB"
                    vram="128 GB unified"
                    verdict="✅ Yeni umut"
                    duration="~6-10 saat (tahmini)"
                    note="NVFP4 native, NVIDIA stack tam destek"
                    tone="primary"
                  />
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Subtitle>Cloud fine-tune alternatifleri (2026)</Subtitle>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <CloudFinetuneCard
              name="RunPod"
              gpu="A100 80GB"
              priceHr="~85 ₺/saat"
              total="~1.350 ₺ / 70B QLoRA run"
              url="https://www.runpod.io/pricing"
            />
            <CloudFinetuneCard
              name="Vast.ai"
              gpu="A100 80GB (spot)"
              priceHr="~36-54 ₺/saat"
              total="~675 ₺ / 70B QLoRA run"
              url="https://vast.ai"
            />
            <CloudFinetuneCard
              name="Together AI"
              gpu="Managed (H100)"
              priceHr="per-token fiyatlandırma"
              total="~1.800-2.700 ₺ / 70B eğitim"
              url="https://www.together.ai/pricing"
            />
          </div>

          <MarkdownNote tone="warning" title="Apple Silicon'un fine-tune gerçeği">
{`Dashboard'da Q2 "Mac Studio M2 Ultra ikinci el" kararı fine-tune istersen **yanlış** olur. Sebep:

- **MLX-LM** Apple'ın cevabı. 2025'te çıktı, LoRA destekliyor, ama PyTorch/Unsloth ekosisteminin yanında çocukça kalıyor.
- **Bitsandbytes** yok → gerçek 4-bit QLoRA yok, sadece 16-bit LoRA (~140GB VRAM için 70B'de = 192GB Ultra zorunlu).
- **Flash Attention 2** yok → batch size çökük.

Pratikte **Apple üzerinde kimse 70B fine-tune etmiyor**. İstatistiksel olarak da doğru: HuggingFace Hub'da MLX 70B LoRA adapter sayısı bir elin parmakları kadar.`}
          </MarkdownNote>

          <MarkdownNote tone="insight" title="Fine-tune karar matrisi">
{`- **Ayda 1-2 fine-tune** → RunPod A100 spot, ~675-1.350 ₺ × run. Donanım almaya gerek yok.
- **Haftada 1+ fine-tune** → Dual RTX 3090 ikinci el yerel kurulum kendini amortize eder.
- **Hiç fine-tune etmem, sadece çalıştıracağım** → Apple Silicon açık; kararını Q2'deki gibi yap.
- **Mahremiyet + fine-tune** → Dual 3090 tek seçenek. Apple + yerel fine-tune + büyük model = üçgen imkansızı.`}
          </MarkdownNote>

          <Subtitle>Kaynaklar</Subtitle>
          <div className="rounded-lg border border-border/60 bg-secondary/30 p-3 text-xs text-muted-foreground">
            <ul className="grid grid-cols-1 gap-1 md:grid-cols-2">
              <li>
                <a
                  href="https://github.com/unslothai/unsloth"
                  target="_blank"
                  rel="noopener"
                  className="hover:text-primary"
                >
                  Unsloth: 2x daha hızlı QLoRA
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/huggingface/trl"
                  target="_blank"
                  rel="noopener"
                  className="hover:text-primary"
                >
                  HuggingFace TRL: QLoRA pipeline
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/ml-explore/mlx-examples"
                  target="_blank"
                  rel="noopener"
                  className="hover:text-primary"
                >
                  Apple MLX examples (LoRA)
                </a>
              </li>
              <li>
                <a
                  href="https://www.runpod.io/pricing"
                  target="_blank"
                  rel="noopener"
                  className="hover:text-primary"
                >
                  RunPod GPU fiyatlandırma
                </a>
              </li>
            </ul>
          </div>
        </div>
      </ResearchEntry>

      <ResearchEntry
        index="Q8"
        tags={[
          "Yaşanabilirlik",
          "Elektrik TL",
          "Gürültü (dBA)",
          "Yaz Sıcağı",
          "Türkiye",
        ]}
        question={`Benim için elektrik tüketimi, gürültü seviyesi ve yaz sıcağında nasıl çalışacağı kritik. 2. kat bir dairede klimasız ortam 35°C'yi bulabiliyor — Dual 3090 oturma odasında yaşanabilir mi? Mac Studio ile aylık elektrik farkı Türkiye fiyatlarıyla gerçekten ne kadar?`}
        summary={`Dashboard'ın görünmez maliyetleri: (1) Türkiye kademeli tarifede dual 3090 aylık ~600 TL AI elektriği; Mac Studio ~85 TL — 3 yılda ~18K TL fark. (2) Dual 3090 yük altında 60 dBA = sunucu sınıfı, oturma odasında yaşanamaz. (3) Yaz 35°C ambient'te NVIDIA tüketici kartları %20-30 throttle; Apple Silicon %4-6. Karar çerçevesi bu üç eksen olmadan eksik.`}
        primary
      >
        <div className="space-y-6">
          <Subtitle>Üç eksen: Ses · Termal · Elektrik</Subtitle>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Yaşanabilirlik haritası (sol-alt köşe = ideal)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LivabilityChart />
            </CardContent>
          </Card>

          <Subtitle>Türkiye elektrik tarifesi — gerçek fatura hesabı</Subtitle>
          <MarkdownNote tone="info" title="Varsayımlar">
{`- Mesken tarifesi kademeli: **1-150 kWh ≈ 3.20 TL**, **150-300 ≈ 4.80 TL**, **300+ ≈ 6.20 TL** (2026-Q1, dağıtım + KDV + TRT dahil yaklaşık).
- AI dışı baz ev tüketimi **~250 kWh/ay** varsayıldı. AI yükü bu bazın üzerine ekleniyor, çoğu senaryoda yüksek kademeye geçiriyor.
- Kullanım profili: **günde 3 saat tam yük**, kalanı idle (7/24 açık makine).
- Marjinal kWh maliyeti bu durumda **~5.5-6.2 TL** — dashboard'daki Maliyet bölümü slider'ının varsayılanı olan 5 TL/kWh değerine yakın, tutarlı.`}
          </MarkdownNote>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <ElectricityCard
              title="Dual RTX 3090 PC"
              idleW={110}
              loadW={750}
              tone="danger"
              verdict="⚠️ En pahalı + en gürültülü"
            />
            <ElectricityCard
              title="Mac Studio M2 Ultra 64GB"
              idleW={10}
              loadW={130}
              tone="success"
              verdict="🥇 Sessiz + ucuz + serin"
            />
            <ElectricityCard
              title="Mac mini M4 Pro 64GB"
              idleW={5}
              loadW={75}
              tone="success"
              verdict="🥇 Pratikte bedava"
            />
            <ElectricityCard
              title="Framework Desktop 128GB"
              idleW={25}
              loadW={180}
              tone="warning"
              verdict="Ortalama"
            />
            <ElectricityCard
              title="Tek RTX 3090 + 128GB RAM"
              idleW={75}
              loadW={420}
              tone="warning"
              verdict="Orta-gürültülü"
            />
            <ElectricityCard
              title="ASUS Ascent GX10"
              idleW={30}
              loadW={170}
              tone="primary"
              verdict="GPU sınıfına göre ucuz"
            />
          </div>

          <MarkdownNote tone="warning" title="3 yıllık elektrik bedeli — dashboard'un görünmez sütunu">
{`Aynı 36 ay amortisman varsayımıyla sadece **AI elektriği**:

- **Dual 3090**: ~600 TL/ay × 36 = **~21.600 TL** (yeni bir Mac mini kadar!)
- **Tek RTX 3090**: ~340 TL/ay × 36 = **~12.200 TL**
- **Mac Studio M2 Ultra**: ~85 TL/ay × 36 = **~3.100 TL**
- **Mac mini M4 Pro**: ~42 TL/ay × 36 = **~1.500 TL**

Yani 150K ₺ Dual 3090'a "donanım" derken aslında **~171K ₺** ödüyorsun; 115K ₺ M2 Ultra'ya ise **~118K ₺**. Gerçek fiyat delta **53K ₺** — Mac Studio sessiz + ucuz + 36 ayda ~%31 daha az toplam maliyet.`}
          </MarkdownNote>

          <Subtitle>Gürültü eşikleri — hangi oda için hangi donanım?</Subtitle>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
            <NoiseRoomCard
              room="🛏️ Yatak odası"
              maxDb="25"
              ok={["Mac mini (tüm)", "MacBook Air", "M2 Ultra Studio"]}
              notOk={["Tüm NVIDIA PC", "Cluster"]}
              tone="primary"
            />
            <NoiseRoomCard
              room="🛋️ Oturma odası"
              maxDb="35"
              ok={["Mac mini Pro", "Studio M2/M4 Max", "Framework Desktop (sınırda)"]}
              notOk={["Tüm Dual GPU", "Tek 3090 yük altında"]}
              tone="success"
            />
            <NoiseRoomCard
              room="💼 Çalışma odası"
              maxDb="45"
              ok={["Tek RTX 4070/4090", "M3 Max laptop", "Studio M3 Ultra"]}
              notOk={["Dual 3090", "Dual 4090 ws"]}
              tone="accent"
            />
            <NoiseRoomCard
              room="🔧 Depo / garaj"
              maxDb="55"
              ok={["Dual 3090 PC", "Dual 4090 ws"]}
              notOk={["—"]}
              tone="warning"
            />
            <NoiseRoomCard
              room="🏢 Ayrı oda / rack"
              maxDb="65+"
              ok={["Her şey"]}
              notOk={["—"]}
              tone="muted"
            />
          </div>

          <MarkdownNote tone="insight" title="Senin durumun">
{`Türkiye daire ortamında (2. kat, tek mutfak/salon/yatak) **oturma odası 35 dB eşiği** karar veren sınırdır. Bu eşik:

- **Geçer**: tüm Mac ürünleri, tek RTX 4070 (dikkatli case seçimi), Framework Desktop Strix Halo.
- **Sınırda**: tek RTX 3090 (yük altında 52 dB — akşamları film izlerken rahatsız eder).
- **Geçmez**: Dual 3090 (60 dB). Oturma odasında bir saat sonra ailenden şikayet gelir. **Ayrı bir odaya koymak veya su soğutma + sessiz case** gerekir — her ikisi de +10-15K TL ek maliyet.

Dashboard'ın Q2/Q3 "Dual 3090 🥇" kararı bu kısıtı görmezden geliyordu. Yatak/oturma odasında kullanacaksan **Dual 3090 pratik olarak elenir**.`}
          </MarkdownNote>

          <Subtitle>Yaz sıcağı: klimasız Türkiye dairesi = ne yapar?</Subtitle>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <ThermalScenarioCard
              season="Kış (18-22°C)"
              scenario="İdeal ortam"
              perf="Nominal hız · tüm donanım tam güç"
              tone="success"
            />
            <ThermalScenarioCard
              season="Bahar/Sonbahar (22-28°C)"
              scenario="Tipik ofis"
              perf="Apple −%2, NVIDIA −%5 — fark edilmez"
              tone="primary"
            />
            <ThermalScenarioCard
              season="Yaz (32-38°C, klimasız)"
              scenario="Kritik dönem"
              perf="Apple −%4-6, NVIDIA tüketici −%18-30, Dual GPU −%30 + sürekli fan"
              tone="danger"
            />
          </div>

          <MarkdownNote tone="warning" title="Yaz senaryosu — gerçek saha notu">
{`Dual 3090 750W yük üretiyor; bu ısı kapalı oda havasına salınıyor. 25m² bir odayı **2 saatte 5-7°C ısıtır**. Klimasız bir dairede Temmuz-Ağustos boyunca:

- Oda sıcaklığı 38-40°C'ye çıkar
- GPU junction sıcaklığı 85-95°C olur → thermal throttle
- Bellek (GDDR6X) 100°C+ → ömür kısalır (madencilik kartı sendromu)
- Kullanıcı konforu: **çalışılamaz**

**Pratik çözüm**: yaz aylarında saat 10-18 arası donanımı kapatmak. Ama AI'ın güzelliği "her zaman hazır" olması — bu sınırlama **Dual 3090 için %40 kullanım zamanı kaybı** demektir. Apple Silicon aynı durumda sadece %5 yavaşlar ve ısı yaymaz.

**Hibrit öneri**: Yaz aylarında cloud API (DeepSeek V3.1 ~12 ₺/M in), kış aylarında yerel. Donanım amortismanı bu durumda 3 yerine 4-5 yıla yayılır.`}
          </MarkdownNote>

          <Subtitle>Genel karar matrisi — "yaşanabilirlik" eklendi</Subtitle>
          <Card>
            <CardContent className="overflow-x-auto p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-3 py-2">Donanım</th>
                    <th className="px-3 py-2 text-right">Elektrik/ay</th>
                    <th className="px-3 py-2 text-right">Ses (yük)</th>
                    <th className="px-3 py-2 text-right">Yaz kaybı</th>
                    <th className="px-3 py-2 text-right">Oturma odası?</th>
                    <th className="px-3 py-2 text-right">Toplam sınıf</th>
                  </tr>
                </thead>
                <tbody>
                  <LivRow
                    hw="Mac mini M4 Pro 64GB"
                    elec="~42 TL"
                    db="32 dB"
                    summer="−%6"
                    livingRoom="✅"
                    grade="🥇 İdeal"
                    tone="success"
                  />
                  <LivRow
                    hw="Mac Studio M2 Ultra 64GB"
                    elec="~85 TL"
                    db="32 dB"
                    summer="−%4"
                    livingRoom="✅"
                    grade="🥇 İdeal"
                    tone="success"
                  />
                  <LivRow
                    hw="Mac Studio M3 Ultra 192GB"
                    elec="~110 TL"
                    db="38 dB"
                    summer="−%5"
                    livingRoom="✅"
                    grade="🥈 Çok iyi"
                    tone="primary"
                  />
                  <LivRow
                    hw="ASUS Ascent GX10"
                    elec="~130 TL"
                    db="42 dB"
                    summer="−%10"
                    livingRoom="⚠️"
                    grade="🥉 Orta"
                    tone="accent"
                  />
                  <LivRow
                    hw="Framework Desktop 128GB"
                    elec="~140 TL"
                    db="40 dB"
                    summer="−%12"
                    livingRoom="⚠️"
                    grade="Orta"
                    tone="accent"
                  />
                  <LivRow
                    hw="Tek RTX 3090 PC"
                    elec="~340 TL"
                    db="52 dB"
                    summer="−%22"
                    livingRoom="❌"
                    grade="Zayıf"
                    tone="warning"
                  />
                  <LivRow
                    hw="Dual RTX 3090 PC"
                    elec="~600 TL"
                    db="60 dB"
                    summer="−%30"
                    livingRoom="❌"
                    grade="Ayrı oda şart"
                    tone="danger"
                    highlight
                  />
                </tbody>
              </table>
            </CardContent>
          </Card>

          <MarkdownNote tone="insight" title="Bu bölümün üç büyük mesajı">
{`1. **Dashboard'ın "TL başına tok/s" metrikleri yaşanabilirliği dışlıyordu.** Gerçek seçim şu üçlü için yapılır: ses + yaz + elektrik. Bu filtreden geçtiğinde Dual 3090'ın rolü **"bodrumda / ayrı odada çalışan headless sunucu"** olur, kişisel asistan değil.

2. **Apple Silicon'un görünmez primi**: 3 yıllık elektrik farkı tek başına 18.000 TL. Mac Studio'nun "pahalı" algısı bu tarafta telafi oluyor.

3. **Yaz aylarında hibrit zorunluluk**: NVIDIA tüketici tarafında sahibi olanlar zaten yapıyor — yaz aylarında cloud API, kış aylarında yerel. Apple tarafında bu zorunluluk yok.`}
          </MarkdownNote>

          <Subtitle>Kaynaklar ve ölçüm metodolojisi</Subtitle>
          <div className="rounded-lg border border-border/60 bg-secondary/30 p-3 text-xs text-muted-foreground">
            <ul className="grid grid-cols-1 gap-1 md:grid-cols-2">
              <li>
                EPDK 2026-Q1 mesken tarife kararı (kademeli)
              </li>
              <li>Apple support: Studio / mini thermal envelope</li>
              <li>Gamers Nexus: RTX 3090 / 4090 acoustic reviews</li>
              <li>Tom's Hardware: Strix Halo thermal testing</li>
              <li>/r/LocalLLaMA: "summer throttle reports" (Haziran-Ağustos 2025)</li>
              <li>LTT: dB ölçümleri (1m mesafe, 22°C ambient)</li>
              <li>
                <a
                  href="https://www.epdk.gov.tr/Detay/Icerik/3-0-22/elektrik-tarifeleri"
                  target="_blank"
                  rel="noopener"
                  className="hover:text-primary"
                >
                  EPDK Elektrik Tarifeleri (resmi)
                </a>
              </li>
              <li>
                <a
                  href="https://www.energy.gov/eere/femp/estimating-appliance-and-home-electronic-energy-use"
                  target="_blank"
                  rel="noopener"
                  className="hover:text-primary"
                >
                  US DOE: elektronik güç tüketimi metodolojisi
                </a>
              </li>
            </ul>
          </div>
        </div>
      </ResearchEntry>

      <div className="mt-12 rounded-2xl border border-dashed border-border/70 bg-secondary/20 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Yeni bir soru geldikçe bu bölüm büyüyecek. Her girdi kendi chart ve
          verisini taşır; hardware / model / feasibility data'ları ortak katmanda
          birikir.
        </p>
      </div>
    </Section>
  );
}

// ----------------------------------------------------------------------------
// Yardımcı bileşenler
// ----------------------------------------------------------------------------

interface ResearchEntryProps {
  index: string;
  question: string;
  summary: string;
  tags: string[];
  children: ReactNode;
  primary?: boolean;
}

function ResearchEntry({
  index,
  question,
  summary,
  tags,
  children,
  primary = false,
}: ResearchEntryProps) {
  return (
    <article
      className={`mb-10 overflow-hidden rounded-2xl border ${
        primary
          ? "border-primary/40 bg-primary/[0.03]"
          : "border-border/60 bg-card/40"
      }`}
    >
      <header className="flex flex-col gap-3 border-b border-border/60 bg-secondary/30 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex h-7 items-center rounded-full px-3 font-mono text-xs font-semibold ${
              primary
                ? "bg-primary/20 text-primary"
                : "bg-accent/20 text-accent-foreground"
            }`}
          >
            {index}
          </span>
          {tags.map((t) => (
            <Badge key={t} variant="outline" className="text-[10px]">
              {t}
            </Badge>
          ))}
          {primary && (
            <Badge variant="warning" className="gap-1 text-[10px]">
              <Sparkles className="h-3 w-3" />
              Aktif kullanıcı hedefi
            </Badge>
          )}
        </div>
        <div className="flex items-start gap-3">
          <MessageCircleQuestion className="mt-1 h-5 w-5 shrink-0 text-primary" />
          <p className="text-base font-medium leading-relaxed text-foreground">
            {question}
          </p>
        </div>
        <p className="text-sm italic text-muted-foreground">→ {summary}</p>
      </header>
      <div className="p-5 md:p-6">{children}</div>
    </article>
  );
}

function Subtitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
      {children}
    </h3>
  );
}

function AxisCard({
  title,
  winner,
  detail,
}: {
  title: string;
  winner: string;
  detail: string;
}) {
  return (
    <Card className="card-hover">
      <CardContent className="space-y-2 p-4 text-sm">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </div>
        <div className="text-base font-bold text-primary">{winner}</div>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}

function StatRow({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone: "success" | "danger";
}) {
  const toneClass = tone === "success" ? "text-emerald-400" : "text-rose-400";
  return (
    <div className="rounded-lg border border-border/50 bg-secondary/30 p-3">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={`font-mono text-lg font-semibold ${toneClass}`}>
          {value}
        </span>
      </div>
      <div className="text-[11px] text-muted-foreground">{sub}</div>
    </div>
  );
}

function WinnerCard({
  rank,
  title,
  price,
  vram,
  speed,
  pros,
  cons,
  tone,
  url,
}: {
  rank: string;
  title: string;
  price: string;
  vram: string;
  speed: string;
  pros: string[];
  cons: string[];
  tone: "primary" | "accent" | "success";
  url?: string;
}) {
  const headerTone = {
    primary: "border-primary/40 bg-primary/5",
    accent: "border-accent/40 bg-accent/5",
    success: "border-emerald-500/40 bg-emerald-500/5",
  }[tone];
  const titleTone = {
    primary: "text-primary",
    accent: "text-accent",
    success: "text-emerald-400",
  }[tone];
  return (
    <Card className={`card-hover flex flex-col ${headerTone}`}>
      <CardHeader className="pb-2">
        <div className="mb-1 flex items-center gap-2 text-2xl">{rank}</div>
        <CardTitle className={`text-base ${titleTone}`}>
          <ProductLink name={title} url={url} />
        </CardTitle>
        <div className="flex flex-wrap gap-1 pt-1">
          <Badge variant="outline" className="font-mono text-[10px]">
            {price}
          </Badge>
          <Badge variant="muted" className="font-mono text-[10px]">
            {vram}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 text-xs">
        <div className="rounded-lg border border-border/50 bg-secondary/30 p-2 font-mono text-xs text-primary">
          {speed}
        </div>
        <div>
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
            Artı
          </div>
          <ul className="space-y-0.5 text-muted-foreground">
            {pros.map((p) => (
              <li key={p} className="flex gap-1.5">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-rose-400">
            Eksi
          </div>
          <ul className="space-y-0.5 text-muted-foreground">
            {cons.map((c) => (
              <li key={c} className="flex gap-1.5">
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

function BudgetCard({
  rank,
  title,
  price,
  usable,
  speed,
  verdict,
  pros,
  cons,
  tone,
  url,
}: {
  rank: string;
  title: string;
  price: string;
  usable: string;
  speed: string;
  verdict: string;
  pros: string[];
  cons: string[];
  tone: "primary" | "accent" | "success" | "neutral" | "warning" | "muted";
  url?: string;
}) {
  const borderTone = {
    primary: "border-primary/40 bg-primary/5",
    accent: "border-accent/40 bg-accent/5",
    success: "border-emerald-500/40 bg-emerald-500/5",
    neutral: "border-sky-500/30 bg-sky-500/5",
    warning: "border-amber-500/30 bg-amber-500/5",
    muted: "border-border/70 bg-secondary/20",
  }[tone];
  const rankTone = {
    primary: "bg-primary/20 text-primary",
    accent: "bg-accent/20 text-accent-foreground",
    success: "bg-emerald-500/20 text-emerald-400",
    neutral: "bg-sky-500/20 text-sky-400",
    warning: "bg-amber-500/20 text-amber-400",
    muted: "bg-muted text-muted-foreground",
  }[tone];
  return (
    <Card className={`card-hover flex flex-col ${borderTone}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex h-6 w-6 items-center justify-center rounded-md font-mono text-xs font-bold ${rankTone}`}
          >
            {rank}
          </span>
          <CardTitle className="text-sm leading-tight">
            <ProductLink name={title} url={url} />
          </CardTitle>
        </div>
        <div className="mt-1 flex flex-wrap gap-1">
          <Badge variant="outline" className="font-mono text-[10px]">
            {price}
          </Badge>
          <Badge variant="muted" className="font-mono text-[10px]">
            {usable}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-2 text-xs">
        <div className="rounded-md border border-border/50 bg-secondary/30 p-2 font-mono text-[11px] text-primary">
          {speed}
        </div>
        <div className="text-[11px] font-semibold text-foreground">{verdict}</div>
        <ul className="space-y-0.5">
          {pros.map((p) => (
            <li key={p} className="flex gap-1.5 text-muted-foreground">
              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
              <span>{p}</span>
            </li>
          ))}
          {cons.map((c) => (
            <li key={c} className="flex gap-1.5 text-muted-foreground">
              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-rose-400" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function EliminatedCard({ name, reason }: { name: string; reason: string }) {
  return (
    <div className="rounded-lg border border-rose-500/25 bg-rose-500/5 p-3">
      <div className="mb-1 text-sm font-semibold text-rose-300">{name}</div>
      <p className="text-xs text-muted-foreground">{reason}</p>
    </div>
  );
}

function NewClassCard({
  badge,
  title,
  subtitle,
  priceTR,
  specs,
  verdict,
  tone,
  url,
}: {
  badge: string;
  title: string;
  subtitle: string;
  priceTR: string;
  specs: Array<{ label: string; value: string }>;
  verdict: string;
  tone: "primary" | "accent" | "success";
  url?: string;
}) {
  const headerTone = {
    primary: "border-primary/40 bg-primary/5",
    accent: "border-accent/40 bg-accent/5",
    success: "border-emerald-500/40 bg-emerald-500/5",
  }[tone];
  const badgeTone = {
    primary: "bg-primary/20 text-primary",
    accent: "bg-accent/20 text-accent-foreground",
    success: "bg-emerald-500/20 text-emerald-400",
  }[tone];
  return (
    <Card className={`card-hover flex flex-col ${headerTone}`}>
      <CardHeader className="pb-2">
        <span
          className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${badgeTone}`}
        >
          {badge}
        </span>
        <CardTitle className="pt-1 text-base leading-tight">
          <ProductLink name={title} url={url} />
        </CardTitle>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
        <div className="pt-1">
          <span className="font-mono text-sm font-semibold text-primary">
            {priceTR}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <dl className="space-y-1 text-xs">
          {specs.map((s) => (
            <div
              key={s.label}
              className="flex items-baseline justify-between gap-2 border-b border-border/30 pb-1 last:border-0"
            >
              <dt className="text-muted-foreground">{s.label}</dt>
              <dd className="font-mono text-foreground">{s.value}</dd>
            </div>
          ))}
        </dl>
        <div className="rounded-md border border-border/50 bg-secondary/30 p-2 text-[11px] italic leading-relaxed text-muted-foreground">
          {verdict}
        </div>
      </CardContent>
    </Card>
  );
}

function ComparisonRow({
  name,
  tl,
  mem,
  tps,
  big,
  ratio,
  highlight,
}: {
  name: string;
  tl: string;
  mem: string;
  tps: string;
  big: string;
  ratio: string;
  highlight?: "primary" | "accent" | "warning";
}) {
  const rowTone = highlight
    ? {
        primary: "bg-primary/5",
        accent: "bg-accent/5",
        warning: "bg-amber-500/5",
      }[highlight]
    : "";
  const badge = highlight
    ? {
        primary: "text-primary",
        accent: "text-accent",
        warning: "text-amber-400",
      }[highlight]
    : "text-foreground";
  return (
    <tr className={`border-b border-border/40 last:border-0 ${rowTone}`}>
      <td className={`px-3 py-2 font-medium ${badge}`}>{name}</td>
      <td className="px-3 py-2 text-right font-mono text-xs">{tl} TL</td>
      <td className="px-3 py-2 text-right font-mono text-xs text-muted-foreground">
        {mem}
      </td>
      <td className="px-3 py-2 text-right font-mono text-sm">{tps}</td>
      <td className="px-3 py-2 text-right">{big}</td>
      <td className="px-3 py-2 text-right font-mono text-xs text-muted-foreground">
        {ratio}
      </td>
    </tr>
  );
}

function QuestionCard({
  icon,
  title,
  options,
  why,
}: {
  icon: string;
  title: string;
  options: string[];
  why: string;
}) {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-2">
        <div className="text-xl">{icon}</div>
        <CardTitle className="text-sm leading-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-xs">
        <ul className="space-y-1">
          {options.map((o) => (
            <li
              key={o}
              className="rounded border border-border/40 bg-secondary/30 px-2 py-1 font-mono text-[11px] text-muted-foreground"
            >
              {o}
            </li>
          ))}
        </ul>
        <p className="text-[11px] italic text-muted-foreground">{why}</p>
      </CardContent>
    </Card>
  );
}

function PersonaCard({
  title,
  target,
  tokensDay,
  concurrency,
  context,
  verdict,
  reasoning,
  fit,
}: {
  title: string;
  target: string;
  tokensDay: string;
  concurrency: string;
  context: string;
  verdict: string;
  reasoning: string;
  fit: "primary" | "accent" | "success" | "warning";
}) {
  const tones = {
    primary: { border: "border-primary/40 bg-primary/5", accent: "text-primary" },
    accent: { border: "border-accent/40 bg-accent/5", accent: "text-accent" },
    success: {
      border: "border-emerald-500/40 bg-emerald-500/5",
      accent: "text-emerald-400",
    },
    warning: {
      border: "border-amber-500/40 bg-amber-500/5",
      accent: "text-amber-400",
    },
  }[fit];
  return (
    <Card className={`card-hover ${tones.border}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base leading-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        <dl className="space-y-1">
          <PersonaRow label="Hedef model" value={target} />
          <PersonaRow label="Token/gün" value={tokensDay} />
          <PersonaRow label="Eşzamanlı" value={concurrency} />
          <PersonaRow label="Context" value={context} />
        </dl>
        <div
          className={`rounded-md border border-border/50 bg-secondary/40 p-2 font-semibold ${tones.accent}`}
        >
          → {verdict}
        </div>
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          {reasoning}
        </p>
      </CardContent>
    </Card>
  );
}

function PersonaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-b border-border/30 pb-1 last:border-0">
      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="text-right font-mono text-[11px] text-foreground">
        {value}
      </dd>
    </div>
  );
}

function MoEBreakCard({
  tier,
  model,
  stats,
  insight,
  tone,
}: {
  tier: string;
  model: string;
  stats: { total: string; active: string; vram: string; tps: string };
  insight: string;
  tone: "primary" | "accent" | "success";
}) {
  const toneMap = {
    primary: "border-primary/40 bg-primary/5",
    accent: "border-accent/40 bg-accent/5",
    success: "border-emerald-500/40 bg-emerald-500/5",
  }[tone];
  const labelMap = {
    primary: "text-primary",
    accent: "text-accent",
    success: "text-emerald-400",
  }[tone];
  return (
    <Card className={`card-hover flex flex-col ${toneMap}`}>
      <CardHeader className="pb-2">
        <div
          className={`text-[10px] font-semibold uppercase tracking-wider ${labelMap}`}
        >
          {tier}
        </div>
        <CardTitle className="text-base leading-tight">{model}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-2 text-xs">
        <dl className="space-y-1">
          <PersonaRow label="Toplam" value={stats.total} />
          <PersonaRow label="Aktif" value={stats.active} />
          <PersonaRow label="VRAM" value={stats.vram} />
          <PersonaRow label="Hız" value={stats.tps} />
        </dl>
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          {insight}
        </p>
      </CardContent>
    </Card>
  );
}

function CloudRow({
  name,
  inp,
  out,
  quality,
  ctx,
  highlight,
}: {
  name: string;
  inp: string;
  out: string;
  quality: string;
  ctx: string;
  highlight?: "primary" | "accent";
}) {
  const rowTone = highlight
    ? { primary: "bg-primary/5", accent: "bg-accent/5" }[highlight]
    : "";
  return (
    <tr className={`border-b border-border/40 last:border-0 ${rowTone}`}>
      <td className="px-3 py-2 font-medium">{name}</td>
      <td className="px-3 py-2 text-right font-mono text-xs">{inp}</td>
      <td className="px-3 py-2 text-right font-mono text-xs">{out}</td>
      <td className="px-3 py-2 text-right text-[11px] text-muted-foreground">
        {quality}
      </td>
      <td className="px-3 py-2 text-right font-mono text-[11px] text-muted-foreground">
        {ctx}
      </td>
    </tr>
  );
}

function PricePillCard({
  label,
  monthly,
  sub,
  tone,
}: {
  label: string;
  monthly: string;
  sub: string;
  tone: "primary" | "success" | "warning" | "danger";
}) {
  const toneMap = {
    primary: "border-primary/40 bg-primary/5 text-primary",
    success: "border-emerald-500/40 bg-emerald-500/5 text-emerald-400",
    warning: "border-amber-500/40 bg-amber-500/5 text-amber-400",
    danger: "border-rose-500/40 bg-rose-500/5 text-rose-400",
  }[tone];
  return (
    <div className={`rounded-xl border p-4 ${toneMap}`}>
      <div className="text-[11px] uppercase tracking-wider opacity-80">
        {label}
      </div>
      <div className="mt-1 font-mono text-2xl font-bold">{monthly}</div>
      <div className="mt-1 text-[11px] text-muted-foreground">{sub}</div>
    </div>
  );
}

function ReasonCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-secondary/30 p-3">
      <div className="text-sm font-semibold text-foreground">{title}</div>
      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
        {desc}
      </p>
    </div>
  );
}

function FineTuneRow({
  hw,
  vram,
  verdict,
  duration,
  note,
  tone,
  highlight,
}: {
  hw: string;
  vram: string;
  verdict: string;
  duration: string;
  note: string;
  tone: "primary" | "success" | "warning" | "danger";
  highlight?: boolean;
}) {
  const verdictTone = {
    primary: "text-primary",
    success: "text-emerald-400",
    warning: "text-amber-400",
    danger: "text-rose-400",
  }[tone];
  return (
    <tr
      className={`border-b border-border/40 last:border-0 ${
        highlight ? "bg-primary/5" : ""
      }`}
    >
      <td className="px-3 py-2 font-medium">{hw}</td>
      <td className="px-3 py-2 text-right font-mono text-xs text-muted-foreground">
        {vram}
      </td>
      <td className={`px-3 py-2 text-right text-sm font-semibold ${verdictTone}`}>
        {verdict}
      </td>
      <td className="px-3 py-2 text-right font-mono text-xs text-muted-foreground">
        {duration}
      </td>
      <td className="px-3 py-2 text-[11px] text-muted-foreground">{note}</td>
    </tr>
  );
}

function ElectricityCard({
  title,
  idleW,
  loadW,
  tone,
  verdict,
}: {
  title: string;
  idleW: number;
  loadW: number;
  tone: "primary" | "success" | "warning" | "danger";
  verdict: string;
}) {
  // Günde 3 saat yük, kalan 21 saat idle — dashboard standart varsayımı
  const monthlyKwh = +(((loadW * 3 + idleW * 21) / 1000) * 30).toFixed(2);
  const { aiDeltaTL, effectiveAiTLPerKwh } = tryElectricityMonthlyTL(monthlyKwh);
  const tones = {
    primary: "border-primary/40 bg-primary/5",
    success: "border-emerald-500/40 bg-emerald-500/5",
    warning: "border-amber-500/40 bg-amber-500/5",
    danger: "border-rose-500/40 bg-rose-500/5",
  }[tone];
  const accentText = {
    primary: "text-primary",
    success: "text-emerald-400",
    warning: "text-amber-400",
    danger: "text-rose-400",
  }[tone];
  return (
    <Card className={`card-hover ${tones}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm leading-tight">{title}</CardTitle>
        <div className="font-mono text-[11px] text-muted-foreground">
          idle {idleW} W · yük {loadW} W · günde 3 saat yük
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-muted-foreground">Aylık kWh (AI)</span>
          <span className="font-mono text-foreground">{monthlyKwh} kWh</span>
        </div>
        <div className="flex items-baseline justify-between gap-2 border-b border-border/40 pb-2">
          <span className="text-muted-foreground">Marjinal TL/kWh</span>
          <span className="font-mono text-foreground">
            {effectiveAiTLPerKwh} TL
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-muted-foreground">Aylık ek fatura</span>
          <span className={`font-mono text-base font-bold ${accentText}`}>
            {aiDeltaTL.toLocaleString("tr-TR")} TL
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-muted-foreground">3 yıl toplam</span>
          <span className="font-mono text-muted-foreground">
            ~{Math.round((aiDeltaTL * 36) / 1000)}K TL
          </span>
        </div>
        <div
          className={`mt-1 rounded-md border border-border/40 bg-secondary/30 px-2 py-1 text-center text-[11px] font-semibold ${accentText}`}
        >
          {verdict}
        </div>
      </CardContent>
    </Card>
  );
}

function NoiseRoomCard({
  room,
  maxDb,
  ok,
  notOk,
  tone,
}: {
  room: string;
  maxDb: string;
  ok: string[];
  notOk: string[];
  tone: "primary" | "success" | "accent" | "warning" | "muted";
}) {
  const toneMap = {
    primary: "border-primary/40 bg-primary/5",
    success: "border-emerald-500/40 bg-emerald-500/5",
    accent: "border-accent/40 bg-accent/5",
    warning: "border-amber-500/40 bg-amber-500/5",
    muted: "border-border/60 bg-secondary/30",
  }[tone];
  return (
    <Card className={`card-hover flex flex-col ${toneMap}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm leading-tight">{room}</CardTitle>
        <div className="font-mono text-[11px] text-muted-foreground">
          ≤ {maxDb} dB
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-2 text-[11px]">
        <div>
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
            ✔ Uygun
          </div>
          <ul className="space-y-0.5 text-muted-foreground">
            {ok.map((o) => (
              <li key={o}>· {o}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-rose-400">
            ✘ Uygun değil
          </div>
          <ul className="space-y-0.5 text-muted-foreground">
            {notOk.map((n) => (
              <li key={n}>· {n}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function ThermalScenarioCard({
  season,
  scenario,
  perf,
  tone,
}: {
  season: string;
  scenario: string;
  perf: string;
  tone: "primary" | "success" | "danger";
}) {
  const toneMap = {
    primary: "border-primary/40 bg-primary/5",
    success: "border-emerald-500/40 bg-emerald-500/5",
    danger: "border-rose-500/40 bg-rose-500/5",
  }[tone];
  return (
    <div className={`rounded-xl border p-4 ${toneMap}`}>
      <div className="text-sm font-semibold text-foreground">{season}</div>
      <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
        {scenario}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {perf}
      </p>
    </div>
  );
}

function LivRow({
  hw,
  elec,
  db,
  summer,
  livingRoom,
  grade,
  tone,
  highlight,
}: {
  hw: string;
  elec: string;
  db: string;
  summer: string;
  livingRoom: string;
  grade: string;
  tone: "primary" | "success" | "accent" | "warning" | "danger";
  highlight?: boolean;
}) {
  const toneClass = {
    primary: "text-primary",
    success: "text-emerald-400",
    accent: "text-accent",
    warning: "text-amber-400",
    danger: "text-rose-400",
  }[tone];
  return (
    <tr
      className={`border-b border-border/40 last:border-0 ${
        highlight ? "bg-rose-500/5" : ""
      }`}
    >
      <td className="px-3 py-2 font-medium">{hw}</td>
      <td className="px-3 py-2 text-right font-mono text-xs">{elec}</td>
      <td className="px-3 py-2 text-right font-mono text-xs">{db}</td>
      <td className="px-3 py-2 text-right font-mono text-xs">{summer}</td>
      <td className="px-3 py-2 text-right text-sm">{livingRoom}</td>
      <td className={`px-3 py-2 text-right text-xs font-semibold ${toneClass}`}>
        {grade}
      </td>
    </tr>
  );
}

function CloudFinetuneCard({
  name,
  gpu,
  priceHr,
  total,
  url,
}: {
  name: string;
  gpu: string;
  priceHr: string;
  total: string;
  url: string;
}) {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          <ProductLink name={name} url={url} />
        </CardTitle>
        <div className="text-xs text-muted-foreground">{gpu}</div>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div className="flex justify-between border-b border-border/30 pb-1">
          <span className="text-muted-foreground">Saatlik</span>
          <span className="font-mono text-primary">{priceHr}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">70B QLoRA toplam</span>
          <span className="font-mono text-accent">{total}</span>
        </div>
      </CardContent>
    </Card>
  );
}
