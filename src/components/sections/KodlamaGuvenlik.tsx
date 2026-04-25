import { Section } from "./Section";
import { SectionHeader } from "../SectionHeader";
import { MarkdownNote } from "../MarkdownNote";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Code2,
  Shield,
  Rabbit,
  Lock,
  Unlock,
  Swords,
  Gavel,
  Terminal,
  GitBranch,
  Boxes,
  ArrowDownUp,
  CheckCircle2,
  XCircle,
  TriangleAlert,
  FlaskConical,
  Crown,
} from "lucide-react";

/**
 * 14 · Kodlama ve Güvenlik odaklı model stack'i.
 *
 * Ayrı bir sayfa olmasının sebebi: genel model evreninden (13) farklı olarak
 * bu sayfa offensive security + red team + pentest + CTF senaryolarını da
 * açık konuşuyor. Kullanıcının sorusu buna özeldi.
 *
 * İçerik:
 *   - Kodlama şampiyonları (Qwen 3.6, Codestral, Qwen 2.5 Coder, DeepSeek, GLM)
 *   - Security-focused modeller (WhiteRabbitNeo/Deep Hat v2, R1 attack chain,
 *     Lily-Cybersecurity-7B)
 *   - Abliteration: ne, nasıl, hangi araç (Heretic/Abliterix, huihui-ai)
 *   - Kısıtlama tier'ları — 4 adımlık bypass escalation'ı
 *   - Hukuki / etik çerçeve (TCK 243-245 Türkiye, CFAA US, lisans durumu)
 *   - M2 Ultra 64GB için "günlük security+coding" stack'i
 *
 * Kaynaklar: Maxime Labonne's abliteration blog (2024-06), Heretic/Abliterix
 * GitHub (2026), WhiteRabbitNeo/Deep Hat v2 Kindo docs, huihui-ai HF repo.
 */
export function KodlamaGuvenlik() {
  return (
    <Section id="kodlama-guvenlik">
      <SectionHeader
        eyebrow="14 · Kodlama + Güvenlik Stack"
        title="Coding, pentesting ve red-team için açık ağırlık modelleri"
        description="Meşru güvenlik araştırması (bug bounty, CTF, authorized pentest, security research) için hangi modelleri seçmek mantıklı? Kısıtlamalara (refusal) takılırsan ne yaparsın? Abliteration gerçekte ne demek? M2 Ultra 64GB'ı bu iki iş için nasıl optimize edersin?"
      />

      <DisclaimerCard />

      <SectionHeader
        className="mt-14"
        eyebrow="Kodlama şampiyonları"
        title="Saf coding + agentic dev için en iddialı 5 açık model"
      />
      <CodingChampions />

      <SectionHeader
        className="mt-14"
        eyebrow="Güvenlik şampiyonları"
        title="Offensive security'ye özel eğitilmiş açık modeller"
        description="Normal modellerin aksine bu modeller refusal eğitiminden geçmemiş veya direkt red/blue team için fine-tune edilmiş."
      />
      <SecurityChampions />

      <SectionHeader
        className="mt-14"
        eyebrow="Kısıtlama gerçeği"
        title="Stock model vs uncensored vs abliterated — ne fark eder?"
      />
      <CensorshipTiers />

      <SectionHeader
        className="mt-14"
        eyebrow="Bypass escalation"
        title="Kısıtlamaya takılırsan 4 basamaklı çözüm"
        description="En yumuşaktan en agresife — genelde 1. veya 2. basamak yeter."
      />
      <BypassLadder />

      <SectionHeader
        className="mt-14"
        eyebrow="Abliteration"
        title="Refusal direction'ı nasıl sıfırlanır?"
        description="Weight orthogonalization tekniği — modelin matematiksel olarak 'hayır' deme yönünü ayıklamak."
      />
      <AbliterationExplained />

      <SectionHeader
        className="mt-14"
        eyebrow="Hukuki çerçeve"
        title="Lokal model + hangi sınır nerede biter?"
      />
      <LegalFramework />

      <SectionHeader
        className="mt-14"
        eyebrow="Somut tavsiye"
        title="M2 Ultra 64GB · günlük coding + security stack'i"
      />
      <M2UltraSecurityStack />

      <FinalNote />
    </Section>
  );
}

/* =========================================================================
 * Disclaimer
 * ======================================================================= */

function DisclaimerCard() {
  return (
    <Card className="border-amber-500/30 bg-amber-500/5">
      <CardContent className="p-6">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-500">
          <Shield className="h-4 w-4" />
          Scope · Sayfa kapsamı
        </div>
        <p className="text-sm leading-relaxed">
          Bu sayfa <strong>authorized pentest, bug bounty, CTF, kendi lab'ın, akademik güvenlik
          araştırması, yazılı yetkilendirilmiş red-team engagement</strong> senaryolarını hedefliyor.
          Metasploit, Burp Suite, nmap gibi araçlarla aynı hukuki zeminde durur: araç/çıktı suç değildir;
          yetkisiz bir sisteme karşı kullanılması suçtur (TCK 243-245, CFAA, CMA 1990). "Saldırıyı
          başkasına yap" kılavuzu değildir — <em>defansif anlayışı, saldırganın mantığını bilerek</em>
          geliştirmenin aracıdır.
        </p>
      </CardContent>
    </Card>
  );
}

/* =========================================================================
 * Coding champions
 * ======================================================================= */

function CodingChampions() {
  const models: CodingRow[] = [
    {
      name: "Qwen 3.6 27B",
      license: "Apache 2.0",
      params: "27B dense",
      humanEval: "91.2",
      swebench: "58.3",
      livecodeBench: "72.6",
      vram: "~17 GB (Q4) / ~22 GB (Q5)",
      bestFor: "Agentic coding, tool-use, refactor, mimari — 2026-Q2 sweet spot",
      gold: true,
    },
    {
      name: "Qwen 2.5 Coder 32B",
      license: "Apache 2.0",
      params: "32B dense",
      humanEval: "88.4",
      swebench: "48.2",
      livecodeBench: "74.2",
      vram: "~20 GB (Q4)",
      bestFor: "Pure code generation — 92 dil, GPT-4'ü HumanEval'de geçer",
      gold: false,
    },
    {
      name: "Codestral 25.01",
      license: "Mistral NPL · ticari kısıtlı",
      params: "22B dense",
      humanEval: "86.6",
      swebench: "—",
      livecodeBench: "58.4",
      vram: "~14 GB (Q4)",
      bestFor: "IDE FIM autocomplete · 95.3% FIM pass@1 · 256K context",
      gold: false,
    },
    {
      name: "DeepSeek-Coder V2.5",
      license: "MIT",
      params: "236B MoE (21B active)",
      humanEval: "90.2",
      swebench: "56.1",
      livecodeBench: "68.9",
      vram: "~14 GB aktif / ~130 GB full",
      bestFor: "338 dil · repo-level context · API en ucuz ($0.14/1M input)",
      gold: false,
    },
    {
      name: "GLM-4.6 Code",
      license: "MIT",
      params: "32B dense",
      humanEval: "89.4",
      swebench: "51.2",
      livecodeBench: "71.4",
      vram: "~20 GB (Q4)",
      bestFor: "Claude Sonnet 3.5 seviyesi tool-use · agentic workflows",
      gold: false,
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
            <th className="p-3 text-left font-semibold">HumanEval</th>
            <th className="p-3 text-left font-semibold">SWE-bench V</th>
            <th className="p-3 text-left font-semibold">LiveCodeBench</th>
            <th className="p-3 text-left font-semibold">VRAM</th>
            <th className="p-3 text-left font-semibold">En iyi kullanım</th>
          </tr>
        </thead>
        <tbody>
          {models.map((m, i) => (
            <tr
              key={m.name}
              className={`${m.gold ? "bg-amber-500/10" : i % 2 === 0 ? "bg-background" : "bg-muted/20"}`}
            >
              <td className="p-3 font-medium">
                {m.gold && <Crown className="mr-1 inline h-3.5 w-3.5 text-amber-500" />}
                {m.name}
              </td>
              <td className="p-3 text-xs text-muted-foreground">{m.license}</td>
              <td className="p-3 text-xs">{m.params}</td>
              <td className="p-3">{m.humanEval}</td>
              <td className="p-3">{m.swebench}</td>
              <td className="p-3">{m.livecodeBench}</td>
              <td className="p-3 text-xs">{m.vram}</td>
              <td className="p-3 text-xs">{m.bestFor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface CodingRow {
  name: string;
  license: string;
  params: string;
  humanEval: string;
  swebench: string;
  livecodeBench: string;
  vram: string;
  bestFor: string;
  gold: boolean;
}

/* =========================================================================
 * Security champions
 * ======================================================================= */

function SecurityChampions() {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-3">
        <SecCard
          icon={<Rabbit className="h-5 w-5" />}
          tone="amber"
          name="WhiteRabbitNeo / Deep Hat v2"
          maker="Kindo"
          sizes="8B · 33B (dense) · 30B MoE"
          license="Apache 2.0 (v1), Deep Hat v2 community"
          strengths={[
            "Sıfırdan red/blue team için eğitildi — refusal yok",
            "CTF benchmark'larında 4× büyüklükte modelleri yeniyor",
            "Exploit reasoning, payload crafting, multi-step attack path",
            "Ollama + LM Studio'da GGUF olarak hazır",
          ]}
          weaknesses={[
            "Kodlamada generalist modellerin gerisinde — sadece security için kullan",
            "Son model Deep Hat v2, kısmen proprietary",
          ]}
          install="ollama pull whiterabbitneo/whiterabbitneo:33b"
        />
        <SecCard
          icon={<FlaskConical className="h-5 w-5" />}
          tone="sky"
          name="DeepSeek R1-Distill 32B"
          maker="DeepSeek · huihui-ai"
          sizes="32B dense (Qwen distill)"
          license="MIT"
          strengths={[
            "Attack chain analysis: 5-6 adımlık sömürü zincirini açık kurar",
            "Reasoning traces — neden-sonuç şeffaf, CTF writeup tarzında",
            "32B'e sığar, M2 Ultra'da 40 tok/s",
            "huihui-ai abliterated sürümü refusal'ı tamamen kaldırır",
          ]}
          weaknesses={[
            "Reasoning uzun — basit sorgular için israf",
            "Saf exploit code yazmaz, açıklar ve pseudo-code verir",
          ]}
          install="ollama pull huihui_ai/deepseek-r1-abliterated:32b-qwen-distill"
        />
        <SecCard
          icon={<Swords className="h-5 w-5" />}
          tone="emerald"
          name="Lily-Cybersecurity-7B"
          maker="segolilylabs"
          sizes="7B dense (Mistral base)"
          license="Apache 2.0"
          strengths={[
            "OWASP Top 10, MITRE ATT&CK, CVE database'ine fine-tune",
            "Junior analyst asistanı — log analiz, TTP mapping",
            "Küçük — 4.5 GB, her yerde çalışır",
          ]}
          weaknesses={[
            "Reasoning zayıf, exploit kurgusu değil tanımlama odaklı",
            "Kod üretimi için uygun değil",
          ]}
          install="ollama pull lily-cybersecurity:7b"
        />
      </div>
      <MarkdownNote tone="info" title="Seçim kılavuzu">
        {`- **Gerçek pentest, exploit geliştirme, CTF** → WhiteRabbitNeo 33B. Başka seçenek yok, refusal'sız zaten eğitilmiş.
- **Attack chain planlama, "nasıl bu zafiyet sömürülür" reasoning** → DeepSeek R1-Distill-Qwen 32B abliterated. Reasoning görünür olduğu için öğretici de.
- **SOC, log analizi, CVE araştırması, blue team** → Lily veya doğrudan Qwen 3.6 27B + security system prompt.`}
      </MarkdownNote>
    </div>
  );
}

function SecCard({
  icon,
  tone,
  name,
  maker,
  sizes,
  license,
  strengths,
  weaknesses,
  install,
}: {
  icon: React.ReactNode;
  tone: "amber" | "sky" | "emerald";
  name: string;
  maker: string;
  sizes: string;
  license: string;
  strengths: string[];
  weaknesses: string[];
  install: string;
}) {
  const toneCfg = {
    amber: "border-amber-500/30 bg-amber-500/5",
    sky: "border-sky-500/30 bg-sky-500/5",
    emerald: "border-emerald-500/30 bg-emerald-500/5",
  }[tone];
  return (
    <Card className={toneCfg}>
      <CardHeader className="pb-3">
        <div className="mb-2 flex items-center justify-between">
          {icon}
          <Badge variant="outline" className="text-xs">
            {sizes.split(" · ")[0]}
          </Badge>
        </div>
        <CardTitle className="text-lg">{name}</CardTitle>
        <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>{maker}</span>
          <span>·</span>
          <span>{license}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-emerald-500">
            Güçlü yanlar
          </div>
          <ul className="space-y-1">
            {strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-1.5 text-sm leading-snug">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-rose-500">
            Zayıflıklar
          </div>
          <ul className="space-y-1">
            {weaknesses.map((s, i) => (
              <li key={i} className="flex items-start gap-1.5 text-sm leading-snug">
                <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg bg-background/60 p-2 font-mono text-xs text-muted-foreground">
          <Terminal className="mr-1 inline h-3 w-3" />
          {install}
        </div>
      </CardContent>
    </Card>
  );
}

/* =========================================================================
 * Censorship tiers
 * ======================================================================= */

function CensorshipTiers() {
  const tiers: Array<{
    label: string;
    icon: React.ReactNode;
    tone: "rose" | "amber" | "emerald";
    tag: string;
    explain: string;
    behavior: string;
  }> = [
    {
      label: "Stock aligned",
      icon: <Lock className="h-5 w-5" />,
      tone: "rose",
      tag: "Llama 3 Instruct, Gemma 3 IT, Phi-4",
      explain:
        "RLHF + constitutional AI ile hard-refuse eğitilmiş. 'Nasıl saldırı yapılır?' sorularına 'Bunu yapamam' cevabı.",
      behavior: "%80-95 sert red · 'etik değil' şablonu ağır basar",
    },
    {
      label: "Light aligned",
      icon: <Unlock className="h-5 w-5" />,
      tone: "amber",
      tag: "Qwen 2.5/3.6, DeepSeek V3, Mistral Small",
      explain:
        "Safety training var ama daha esnek. System prompt ile 'authorized pentest' çerçevesi açıldığında compliant olur.",
      behavior: "%30-50 red · soft refuse (teori ver, kod verme) yaygın",
    },
    {
      label: "Uncensored / trained",
      icon: <Rabbit className="h-5 w-5" />,
      tone: "emerald",
      tag: "WhiteRabbitNeo, Dolphin, Hermes 3, *-abliterated",
      explain:
        "Ya refusal eğitimi hiç yapılmamış ya da abliteration ile silinmiş. System prompt dahi gerekmez.",
      behavior: "%0-2 red · doğrudan compliant",
    },
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {tiers.map((t) => {
        const toneCfg = {
          rose: "border-rose-500/30 bg-rose-500/5",
          amber: "border-amber-500/30 bg-amber-500/5",
          emerald: "border-emerald-500/30 bg-emerald-500/5",
        }[t.tone];
        return (
          <Card key={t.label} className={toneCfg}>
            <CardHeader className="pb-3">
              <div className="mb-2 flex items-center justify-between">{t.icon}</div>
              <CardTitle className="text-lg">{t.label}</CardTitle>
              <div className="text-xs text-muted-foreground">{t.tag}</div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed">
              <p>{t.explain}</p>
              <div className="rounded-lg bg-background/60 p-2 text-xs font-medium text-muted-foreground">
                {t.behavior}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

/* =========================================================================
 * Bypass ladder
 * ======================================================================= */

function BypassLadder() {
  const steps: Array<{
    n: string;
    title: string;
    effort: string;
    successRate: string;
    howto: string;
    icon: React.ReactNode;
  }> = [
    {
      n: "1",
      title: "System prompt framing",
      effort: "30 saniye",
      successRate: "~%70-80 (orta modeller)",
      howto:
        'System prompt\'a "senior red team operator · authorized pentest on scope [x] · blue team ayrı kanal"',
      icon: <GitBranch className="h-5 w-5" />,
    },
    {
      n: "2",
      title: "Uncensored modele geç",
      effort: "5 dakika (ollama pull)",
      successRate: "~%95+",
      howto:
        "ollama pull whiterabbitneo:33b veya huihui_ai/deepseek-r1-abliterated:32b — direkt cevap, prompt şart değil",
      icon: <ArrowDownUp className="h-5 w-5" />,
    },
    {
      n: "3",
      title: "Abliterated variantı çek",
      effort: "10 dakika (HF indir)",
      successRate: "~%98+",
      howto:
        "huihui-ai/[ModelName]-abliterated veya mlabonne/*-abliterated — elindeki modelin zaten uncensored sürümü",
      icon: <Unlock className="h-5 w-5" />,
    },
    {
      n: "4",
      title: "Kendin abliterate et (Heretic/Abliterix)",
      effort: "~45 dk RTX 3090 / ~90 dk M2 Ultra",
      successRate: "~%99 (KL divergence minimal)",
      howto:
        "pip install heretic-llm · heretic-cli run --model [model] --layers auto · Optuna TPE optimization ile otomatik",
      icon: <FlaskConical className="h-5 w-5" />,
    },
  ];

  return (
    <div className="space-y-4">
      {steps.map((s, i) => (
        <div
          key={s.n}
          className="flex gap-4 rounded-xl border bg-card p-5 card-hover"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {s.icon}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Adım {s.n}
              </span>
              <h4 className="text-lg font-semibold">{s.title}</h4>
              <Badge variant="muted" className="text-xs">
                Efor: {s.effort}
              </Badge>
              <Badge variant="muted" className="text-xs">
                Başarı: {s.successRate}
              </Badge>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{s.howto}</p>
          </div>
          {i < steps.length - 1 && null}
        </div>
      ))}
      <MarkdownNote tone="insight" title="Pratik tavsiye">
        {`Zaman kaybetme: **Adım 2'den başla**. Güvenlik araştırması yapacaksan
zaten WhiteRabbitNeo veya R1-Distill-abliterated yükle, system prompt oyununa
girme. Aynı model 2-3 farklı görev için kullanılıyorsa o zaman Qwen 3.6 27B +
abliterated varyantı yan yana tut.`}
      </MarkdownNote>
    </div>
  );
}

/* =========================================================================
 * Abliteration explained
 * ======================================================================= */

function AbliterationExplained() {
  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="p-6">
          <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <FlaskConical className="h-5 w-5 text-primary" />
            Weight orthogonalization — teknik ne?
          </h4>
          <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
            Her transformer layer'ın residual stream'inde, model "red" kararı
            aldığında aktive olan belirli bir vektör yönü vardır — buna{" "}
            <strong className="text-foreground">refusal direction</strong> deniyor.
            Maxime Labonne 2024'te bu yönü açığa çıkarmanın formülünü yayınladı:
          </p>
          <ol className="ml-5 list-decimal space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Harmful vs harmless instruction set</strong> hazırla (500-1000 örnek her biri).
            </li>
            <li>
              Her örnek için model aktivasyonlarını topla, her layer'da ortalama al.
            </li>
            <li>
              İki ortalamanın farkı → refusal direction vektörü.
            </li>
            <li>
              Her weight matrix'i bu vektöre <strong className="text-foreground">orthogonal project</strong> et (matematiksel olarak o yönü sıfırla).
            </li>
            <li>
              Sonuç: model "red" diyemiyor çünkü o yön artık yok. Diğer yetenekler korunuyor (KL divergence {"<"} %2).
            </li>
          </ol>
        </CardContent>
      </Card>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Heretic / Abliterix (2026)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm leading-relaxed">
            <p>
              <strong>Optuna TPE optimization</strong> ile hangi layer'ları
              ablate edeceğini otomatik buluyor. Manuel tuning gitti.
            </p>
            <ul className="ml-5 list-disc space-y-1 text-muted-foreground">
              <li>135+ model konfigürasyonu destekli (Llama, Gemma, Qwen, Mistral, DeepSeek, Phi)</li>
              <li>Refusal rate %0-1.5'a iniyor</li>
              <li>KL divergence minimal (orijinal zekâ korunuyor)</li>
              <li>RTX 3090'da ~45 dk, M2 Ultra'da MLX backend ile ~90 dk</li>
              <li>9 peer-reviewed paper'dan teknikler entegre (NeurIPS, ACL, ICLR)</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="border-sky-500/30 bg-sky-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Hazır abliterated modeller (huihui-ai, mlabonne)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm leading-relaxed">
            <p>
              Kendi modelini ablate etmek istemezsen, HuggingFace'te hazır abliterated sürümler var:
            </p>
            <ul className="ml-5 list-disc space-y-1 text-muted-foreground">
              <li><code className="rounded bg-muted px-1 py-0.5 text-xs">huihui-ai/Qwen2.5-Coder-32B-Instruct-abliterated</code></li>
              <li><code className="rounded bg-muted px-1 py-0.5 text-xs">huihui-ai/DeepSeek-R1-Distill-Qwen-32B-abliterated</code></li>
              <li><code className="rounded bg-muted px-1 py-0.5 text-xs">huihui-ai/Qwen3-32B-abliterated</code></li>
              <li><code className="rounded bg-muted px-1 py-0.5 text-xs">mlabonne/Meta-Llama-3-70B-Instruct-abliterated-v3.5</code></li>
              <li>Ollama registry'de de aynılar: <code className="rounded bg-muted px-1 py-0.5 text-xs">huihui_ai/*</code></li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* =========================================================================
 * Legal framework
 * ======================================================================= */

function LegalFramework() {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-3">
        <LegalCard
          icon={<Gavel className="h-5 w-5" />}
          title="Model çıktısı"
          tone="emerald"
          body="Lokal, open-weight bir modelin ürettiği çıktı **kendi başına suç değil**. OpenAI/Anthropic ToS'u yok; weight indirdiğinde aralarında sözleşme ilişkisi yok. Apache 2.0/MIT lisanslarında 'no harmful use' klozu bulunsa bile genelde enforceable değil (kimin enforce edeceği, nasıl tespit edileceği belirsiz)."
        />
        <LegalCard
          icon={<Boxes className="h-5 w-5" />}
          title="Araç statüsü"
          tone="sky"
          body="Metasploit, nmap, Burp Suite, Cobalt Strike, sqlmap — hepsi dual-use. Sahip olmak + kullanmak yasal. Yetkisiz bir sisteme karşı kullanmak suç. **LLM tam olarak aynı sınıfta.** Fark: LLM esnek, tek bir aracın sabit davranışı yok; bu hukuki zeminde fark yaratmaz."
        />
        <LegalCard
          icon={<TriangleAlert className="h-5 w-5" />}
          title="Suç eşiği"
          tone="rose"
          body="TCK 243 (bilişim sistemine girme), 244 (verileri engelleme/yok etme), 245 (banka/kredi kartı kötüye kullanım). CFAA §1030 (US). CMA 1990 (UK). Hepsi **yetkisiz erişim** veya zarar verme eylemi üzerinden tanımlı. Model çıktısına bakmaz, eylemin hedefine bakar."
        />
      </div>
      <MarkdownNote tone="info" title="Temiz zemin (açık yeşil)">
        {`- **Bug bounty programları** (HackerOne, Bugcrowd, Intigriti) — yazılı yetki var.
- **CTF, wargames** (Hack The Box, TryHackMe, picoCTF) — platformu kabul ederek yetkilendirilmiş.
- **Kendi lab'ın** (VM, home network, VPS'in) — sahip sensin.
- **Authorized pentest engagement** — yazılı SOW + rules of engagement.
- **Akademik güvenlik araştırması** — IRB onayı + responsible disclosure.
- **CVE araştırması / reverse engineering** (Ghidra, IDA, radare2 ile) — public binary analizi yasal.`}
      </MarkdownNote>
      <MarkdownNote tone="warning" title="Gri / tehlikeli zemin">
        {`- **Responsible disclosure'suz 0-day satışı** — birçok yargı alanında bilişim suçuna destek.
- **Yetkisiz tarama** (kendi ağın olmayan networkleri tarama) — TCK 243 sınırında.
- **Ransomware / destructive tooling development** — niyet kanıtlanırsa hazırlık suçu.
- **Kişisel veri sızdıran exploit dokümantasyonu** — KVKK + GDPR + TCK 136.
Bu sayfa bu zeminlere yardım etmek için değil; karışıklık olmasın diye yazdım.`}
      </MarkdownNote>
    </div>
  );
}

function LegalCard({
  icon,
  title,
  tone,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  tone: "emerald" | "sky" | "rose";
  body: string;
}) {
  const toneCfg = {
    emerald: "border-emerald-500/30 bg-emerald-500/5",
    sky: "border-sky-500/30 bg-sky-500/5",
    rose: "border-rose-500/30 bg-rose-500/5",
  }[tone];
  return (
    <Card className={toneCfg}>
      <CardHeader className="pb-3">
        <div className="mb-2 flex items-center gap-2">{icon}</div>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm leading-relaxed text-muted-foreground">{body}</CardContent>
    </Card>
  );
}

/* =========================================================================
 * M2 Ultra security+coding stack
 * ======================================================================= */

function M2UltraSecurityStack() {
  return (
    <div className="space-y-5">
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-6">
          <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <Code2 className="h-5 w-5 text-primary" />
            Günlük stack (paralel yüklü · ~56 GB / 64 GB)
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
                  <th className="py-2 text-left font-semibold">Notu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                <StackRow
                  role="Kodlama + agent"
                  model="Qwen 3.6 27B"
                  quant="Q5_K_M"
                  ram="~22 GB"
                  speed="~50 tok/s"
                  note="Ana günlük çalışma modeli, tool-use şampiyonu"
                />
                <StackRow
                  role="IDE autocomplete"
                  model="Codestral 25.01"
                  quant="Q4_K_M"
                  ram="~14 GB"
                  speed="~60 tok/s"
                  note="FIM 95.3 · continue.dev / cursor tab için"
                />
                <StackRow
                  role="Security / reasoning"
                  model="huihui_ai/DeepSeek-R1-abliterated-32b"
                  quant="Q4_K_M"
                  ram="~20 GB"
                  speed="~40 tok/s"
                  note="Attack chain, CTF, exploit reasoning, refusal yok"
                />
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            <strong>Gerçek çalışma pattern'i:</strong> Qwen 3.6 + Codestral sürekli RAM'de (~36 GB).
            Security iş gerektiğinde Codestral unload, R1-abliterated load (Ollama 10 sn). Open WebUI
            üstünden system prompt'a göre otomatik routing yapılabilir.
          </p>
        </CardContent>
      </Card>

      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="p-6">
          <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <Shield className="h-5 w-5 text-amber-500" />
            Yalnız güvenlik odaklı alternatif stack
          </h4>
          <p className="mb-3 text-sm leading-relaxed">
            Hedef sadece pentest/red team/CTF ise tek model tercih:
          </p>
          <div className="rounded-lg bg-background/80 p-4 font-mono text-xs">
            <div className="mb-2 text-muted-foreground"># WhiteRabbitNeo 33B — security-tuned</div>
            <div>ollama pull whiterabbitneo/whiterabbitneo:33b</div>
            <div className="mt-2 text-muted-foreground"># veya — R1 reasoning tadı için abliterated</div>
            <div>ollama pull huihui_ai/deepseek-r1-abliterated:32b-qwen-distill</div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            İkisini yan yana tut: WhiteRabbitNeo "bu zafiyet nasıl sömürülür" için, R1-abliterated
            "karmaşık multi-step reasoning" için. Toplam ~40 GB.
          </p>
        </CardContent>
      </Card>

      <MarkdownNote tone="insight" title="Fine-tune opsiyonu">
        {`M2 Ultra 64GB'ın özel avantajı: **kendi security corpus'unla fine-tune** edebilirsin.
MLX-LM + LoRA ile Qwen 3.6 27B'yi örneğin:
- Kendi CVE analizlerin + writeup'ların → domain-uzman asistan
- Firmanın internal pentest raporları + redaction → offline SOC analisti
- CTF writeup corpus → CTF-odaklı hızlı çözüm asistanı

QLoRA 4-bit, 24GB'a sığar, bir gecede biter (~8 saat). Bu 170K ₺'lik kasayı tamamen özel bir AI'ya dönüştürür.`}
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
  note,
}: {
  role: string;
  model: string;
  quant: string;
  ram: string;
  speed: string;
  note: string;
}) {
  return (
    <tr>
      <td className="py-2 pr-3 text-xs uppercase tracking-wider text-muted-foreground">{role}</td>
      <td className="py-2 pr-3 font-medium">{model}</td>
      <td className="py-2 pr-3">
        <Badge variant="outline" className="text-xs">
          {quant}
        </Badge>
      </td>
      <td className="py-2 pr-3">{ram}</td>
      <td className="py-2 pr-3">{speed}</td>
      <td className="py-2 pr-3 text-xs text-muted-foreground">{note}</td>
    </tr>
  );
}

/* =========================================================================
 * Final note
 * ======================================================================= */

function FinalNote() {
  return (
    <div className="mt-14">
      <Card className="border-primary/40 bg-gradient-to-br from-primary/10 to-accent/5">
        <CardContent className="p-6">
          <h4 className="mb-2 text-lg font-semibold">Özet: kapalı modelin "hayır"ını aşmak için lokale gel</h4>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Açık ağırlık modellerin en büyük değeri benchmark skoru değil —{" "}
            <strong className="text-foreground">sana ait olmaları</strong>. Veriyi göndermiyor, ToS
            kısıtlaması yok, abliterate edilebiliyor, fine-tune edilebiliyor, 7/24 rate limit yok.
            2026-Q2 itibarıyla 64GB M2 Ultra'ya 3 ciddi model aynı anda sığıyor ve frontier'ın %90'ına
            yetişiyor. "Bu etik değil" engeline takıldığında WhiteRabbitNeo veya abliterated variant
            bir <code className="rounded bg-muted px-1 py-0.5 text-xs">ollama pull</code> uzakta.
            Meşru güvenlik işinde bu engele takılmak mesleki zamanı yakmaktan başka bir şey değil.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
