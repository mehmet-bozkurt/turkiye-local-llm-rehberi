export type OS = "macos" | "windows" | "linux";
export type License = "open" | "research" | "proprietary";
export type HardwareType =
  | "laptop"
  | "desktop"
  | "workstation"
  | "edge"
  | "cluster";
export type Verdict = "excellent" | "good" | "marginal" | "not_recommended";

export type QuantLevel =
  | "FP16"
  | "Q8_0"
  | "Q6_K"
  | "Q5_K_M"
  | "Q4_K_M"
  | "Q3_K_M";

export interface Quantization {
  level: QuantLevel;
  bytesPerParam: number;
  vramGB: number;
  qualityRetention: number;
}

export interface ModelBenchmark {
  hardwareId: string;
  tokensPerSec: number;
  quant: QuantLevel;
  source?: string;
}

export interface Model {
  id: string;
  name: string;
  family: string;
  vendor: string;
  /** Toplam parametre sayısı (MoE için total; dense'de aktif ile aynı). */
  params: number;
  /** MoE modeli mi? Seyrek aktivasyon → belleğe sığması önemli, hız aktif params'a yakın. */
  isMoE?: boolean;
  /** MoE'de token başına aktif parametre sayısı (B). Dense modellerde undefined. */
  activeParams?: number;
  releaseYear: number;
  contextLength: number;
  license: License;
  quantizations: Quantization[];
  strengths: string[];
  useCases: string[];
  benchmarks?: ModelBenchmark[];
  notes?: string;
}

export interface Hardware {
  id: string;
  name: string;
  type: HardwareType;
  vendor: string;
  gpu?: { model: string; vramGB: number };
  unifiedMemoryGB?: number;
  ramGB: number;
  approxPriceUSD: number;
  /** Türkiye yaklaşık pazar fiyatı (TL). İkinci el için `used: true` işaretlenir. */
  approxPriceTRY?: number;
  /** Piyasa etiketi: yeni / ikinci el */
  market?: "new" | "used";
  /** Bellek bant genişliği (GB/s) — LLM inference için kritik */
  memoryBandwidthGBs?: number;
  /** Cluster için node sayısı (tekil makinelerde 1). */
  nodeCount?: number;
  /** Cluster interconnect protokolü. */
  interconnect?:
    | "thunderbolt-4"
    | "thunderbolt-5"
    | "10gbe"
    | "infiniband"
    | "pcie";
  idlePowerW: number;
  loadPowerW: number;
  /** Idle durumda ölçülen ortam gürültüsü (dBA, 1m mesafe). */
  noiseDbIdle?: number;
  /** 70B Q4 sürekli load altında ortam gürültüsü (dBA, 1m mesafe). */
  noiseDbLoad?: number;
  /**
   * Akustik sınıflandırma — kullanıcı için kolay okuma.
   * - `silent`: Fansız, 0 dB (Pi 5, fansız MacBook Air)
   * - `quiet`: < 30 dB (Mac mini, Studio — oda dışından duyulmaz)
   * - `audible`: 30-45 dB (sakin ofis, kütüphane düzeyi)
   * - `loud`: 45-55 dB (oturma odasında rahatsız eder)
   * - `server`: > 55 dB (ayrı oda gerekir)
   */
  acousticClass?: "silent" | "quiet" | "audible" | "loud" | "server";
  /**
   * Yaz sıcağı (Türkiye, 32-38°C ortam) altında beklenen performans düşüşü.
   * 0 = hiç düşmez, 0.30 = %30 hız kaybı.
   * NVIDIA kartlar ve CPU'lar genelde yüksek; Apple Silicon çok düşük.
   */
  summerThermalPenalty?: number;
  osSupport: OS[];
  strengths: string[];
  weaknesses: string[];
  /**
   * 70B Q4 modelinde **prompt-evaluation** hızı (token/s).
   * Uzun bağlamda (RAG/kod) asıl darboğaz bu metriktir, generation hızı değildir.
   * Tahminler topluluk benchmark'ları (llama.cpp, Ollama issues, /r/LocalLLaMA) ortalaması.
   */
  promptEvalTPS70BQ4?: number;
  /**
   * Türkiye pazarı için tedarik riski.
   * - `none`: Resmi kanaldan kolay temin + Türkiye garantisi
   * - `warranty-risk`: İkinci el, madencilik kartı riski, garanti yok
   * - `customs-high`: İthalat zorunlu, ~%60 gümrük, garanti Türkiye'de geçersiz
   * - `unavailable`: Türkiye'de satılmıyor, yurt dışı sipariş gerekiyor
   */
  importRisk?: "none" | "warranty-risk" | "customs-high" | "unavailable";
  /** Üreticinin resmi/referans sayfası. Mümkünse Türkiye mağazası, yoksa genel. */
  url?: string;
}

export interface Runtime {
  id: string;
  name: string;
  category: "desktop_app" | "cli" | "server" | "library";
  ease: 1 | 2 | 3 | 4 | 5;
  performance: 1 | 2 | 3 | 4 | 5;
  flexibility: 1 | 2 | 3 | 4 | 5;
  ecosystem: 1 | 2 | 3 | 4 | 5;
  gpuAcceleration: 1 | 2 | 3 | 4 | 5;
  osSupport: OS[];
  backends: string[];
  licenseType: "MIT" | "Apache-2.0" | "GPL" | "Proprietary" | "Mixed";
  bestFor: string;
  url: string;
}

export interface UseCase {
  id: string;
  name: string;
  description: string;
  minParams: number;
  recommendedParams: number;
  latencySensitivity: 1 | 2 | 3 | 4 | 5;
  qualitySensitivity: 1 | 2 | 3 | 4 | 5;
  avgTokensPerDay: number;
  notes: string;
}

export interface CloudProvider {
  id: string;
  name: string;
  models: Array<{
    name: string;
    tier: "flagship" | "mid" | "mini";
    pricePerMillionIn: number;
    pricePerMillionOut: number;
    contextLength: number;
  }>;
  url: string;
}

export interface FeasibilityCell {
  useCaseId: string;
  hardwareId: string;
  score: number;
  verdict: Verdict;
  recommendedModel?: string;
  recommendedRuntime?: string;
  notes?: string;
}
