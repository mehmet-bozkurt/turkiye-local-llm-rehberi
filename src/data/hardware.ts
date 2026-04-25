import type { Hardware } from "@/types";

/**
 * 70B Q4 modelinde **prompt evaluation** (prompt işleme) hızı — token/s.
 * Generation hızından ayrı tutulur çünkü uzun context (RAG / kod / agent)
 * senaryolarında asıl darboğaz burasıdır. Apple Silicon burada CUDA'ya ciddi
 * kaybeder (memory bandwidth yüksek ama compute düşük).
 *
 * Kaynaklar: llama.cpp GitHub benchmarks, /r/LocalLLaMA saha raporları,
 * Ollama benchmark sayfaları, Exo Labs hibrit makalesi (2026-Q1).
 */
const HARDWARE_PROMPT_EVAL_TPS: Record<string, number> = {
  "cpu-ryzen-7": 20,
  "m2-air-16": 45,
  "mac-mini-m4-16": 80,
  "mac-mini-m4-24": 90,
  "mac-mini-m4-pro-24": 140,
  "mac-mini-m4-pro-48": 150,
  "mac-mini-m4-pro-64": 155,
  "m3-max-36": 320,
  "mac-studio-m2-max-32": 300,
  "mac-studio-m4-max-36": 340,
  "mac-studio-m4-max-48": 355,
  "mac-studio-m2-ultra-64": 420,
  "mac-studio-m2-ultra-64-used": 420,
  "mac-studio-m3-ultra-192": 640,
  "cluster-4x-mac-mini-m4-16": 180,
  "cluster-2x-mac-mini-m4-pro-24": 200,
  "cluster-2x-mac-mini-m4-pro-64": 240,
  "cluster-4x-mac-mini-m4-pro-64": 380,
  "asus-ascent-gx10": 260,
  "nvidia-dgx-spark": 270,
  "framework-desktop-amd-395-128": 210,
  "framework-desktop-amd-395-64": 210,
  "rtx-4070": 900,
  "pc-single-3090": 2500,
  "pc-dual-3090": 4200,
  "rtx-4090": 3100,
  "ws-dual-4090": 5500,
  "raspberry-pi-5": 2,
};

/**
 * Türkiye pazarı için tedarik / garanti riski.
 * Dashboard kararını etkileyen gizli maliyet kategorilerinden biri.
 */
const HARDWARE_IMPORT_RISK: Record<
  string,
  "none" | "warranty-risk" | "customs-high" | "unavailable"
> = {
  "cpu-ryzen-7": "none",
  "m2-air-16": "none",
  "mac-mini-m4-16": "none",
  "mac-mini-m4-24": "none",
  "mac-mini-m4-pro-24": "none",
  "mac-mini-m4-pro-48": "none",
  "mac-mini-m4-pro-64": "none",
  "m3-max-36": "none",
  "mac-studio-m2-max-32": "none",
  "mac-studio-m4-max-36": "none",
  "mac-studio-m4-max-48": "none",
  "mac-studio-m2-ultra-64": "none",
  "mac-studio-m2-ultra-64-used": "warranty-risk",
  "mac-studio-m3-ultra-192": "none",
  "cluster-4x-mac-mini-m4-16": "none",
  "cluster-2x-mac-mini-m4-pro-24": "none",
  "cluster-2x-mac-mini-m4-pro-64": "none",
  "cluster-4x-mac-mini-m4-pro-64": "none",
  "asus-ascent-gx10": "none",
  "nvidia-dgx-spark": "customs-high",
  "framework-desktop-amd-395-128": "customs-high",
  "framework-desktop-amd-395-64": "customs-high",
  "rtx-4070": "none",
  "pc-single-3090": "warranty-risk",
  "pc-dual-3090": "warranty-risk",
  "rtx-4090": "none",
  "ws-dual-4090": "none",
  "raspberry-pi-5": "none",
};

/**
 * Akustik profil: [idle dB, load dB, sınıf].
 * Değerler 1m mesafe, kapalı oda normu ile topluluk raporlarından derlendi
 * (Apple support notları, Gamers Nexus review'leri, Tom's Hardware, LTT, Reddit
 * /r/LocalLLaMA saha deneyimleri). Dual 3090 değeri **blower-fan** modelleri
 * için verildi; triple-fan open-air modelleri +2-3 dB daha sessiz olabilir.
 */
const HARDWARE_ACOUSTICS: Record<
  string,
  {
    idle: number;
    load: number;
    cls: "silent" | "quiet" | "audible" | "loud" | "server";
  }
> = {
  "cpu-ryzen-7": { idle: 28, load: 42, cls: "audible" },
  "m2-air-16": { idle: 0, load: 0, cls: "silent" },
  "mac-mini-m4-16": { idle: 22, load: 28, cls: "quiet" },
  "mac-mini-m4-24": { idle: 22, load: 30, cls: "quiet" },
  "mac-mini-m4-pro-24": { idle: 22, load: 32, cls: "quiet" },
  "mac-mini-m4-pro-48": { idle: 22, load: 32, cls: "quiet" },
  "mac-mini-m4-pro-64": { idle: 22, load: 32, cls: "quiet" },
  "m3-max-36": { idle: 22, load: 42, cls: "audible" },
  "mac-studio-m2-max-32": { idle: 23, load: 32, cls: "quiet" },
  "mac-studio-m4-max-36": { idle: 23, load: 32, cls: "quiet" },
  "mac-studio-m4-max-48": { idle: 23, load: 33, cls: "quiet" },
  "mac-studio-m2-ultra-64": { idle: 24, load: 32, cls: "quiet" },
  "mac-studio-m2-ultra-64-used": { idle: 24, load: 32, cls: "quiet" },
  "mac-studio-m3-ultra-192": { idle: 24, load: 38, cls: "audible" },
  "cluster-4x-mac-mini-m4-16": { idle: 26, load: 34, cls: "quiet" },
  "cluster-2x-mac-mini-m4-pro-24": { idle: 23, load: 34, cls: "quiet" },
  "cluster-2x-mac-mini-m4-pro-64": { idle: 25, load: 36, cls: "audible" },
  "cluster-4x-mac-mini-m4-pro-64": { idle: 28, load: 40, cls: "audible" },
  "asus-ascent-gx10": { idle: 30, load: 42, cls: "audible" },
  "nvidia-dgx-spark": { idle: 32, load: 45, cls: "audible" },
  "framework-desktop-amd-395-128": { idle: 28, load: 40, cls: "audible" },
  "framework-desktop-amd-395-64": { idle: 28, load: 40, cls: "audible" },
  "rtx-4070": { idle: 30, load: 44, cls: "audible" },
  "pc-single-3090": { idle: 32, load: 52, cls: "loud" },
  "pc-dual-3090": { idle: 36, load: 60, cls: "server" },
  "rtx-4090": { idle: 30, load: 48, cls: "loud" },
  "ws-dual-4090": { idle: 36, load: 58, cls: "server" },
  "raspberry-pi-5": { idle: 0, load: 0, cls: "silent" },
};

/**
 * Yaz sıcağında (Türkiye klimasız oda, 32-38°C ortam) beklenen performans
 * düşüşü katsayısı. 0 = hiç düşmez, 0.30 = %30 hız kaybı.
 * NVIDIA tüketici kartları thermal throttle'a hassas; Apple Silicon tasarımı
 * konservatif olduğu için minimal etkilenir.
 */
const HARDWARE_SUMMER_PENALTY: Record<string, number> = {
  "cpu-ryzen-7": 0.15,
  "m2-air-16": 0.18,
  "mac-mini-m4-16": 0.05,
  "mac-mini-m4-24": 0.05,
  "mac-mini-m4-pro-24": 0.06,
  "mac-mini-m4-pro-48": 0.06,
  "mac-mini-m4-pro-64": 0.06,
  "m3-max-36": 0.12,
  "mac-studio-m2-max-32": 0.04,
  "mac-studio-m4-max-36": 0.04,
  "mac-studio-m4-max-48": 0.04,
  "mac-studio-m2-ultra-64": 0.04,
  "mac-studio-m2-ultra-64-used": 0.04,
  "mac-studio-m3-ultra-192": 0.05,
  "cluster-4x-mac-mini-m4-16": 0.05,
  "cluster-2x-mac-mini-m4-pro-24": 0.06,
  "cluster-2x-mac-mini-m4-pro-64": 0.07,
  "cluster-4x-mac-mini-m4-pro-64": 0.08,
  "asus-ascent-gx10": 0.1,
  "nvidia-dgx-spark": 0.1,
  "framework-desktop-amd-395-128": 0.12,
  "framework-desktop-amd-395-64": 0.12,
  "rtx-4070": 0.18,
  "pc-single-3090": 0.22,
  "pc-dual-3090": 0.3,
  "rtx-4090": 0.2,
  "ws-dual-4090": 0.28,
  "raspberry-pi-5": 0.08,
};

/**
 * Her donanımın üretici/referans resmi linki. Mümkünse Türkiye mağazası,
 * ithalat/niş ürünlerde uluslararası kaynak. Cluster'lar için Exo Labs.
 */
const HARDWARE_URLS: Record<string, string> = {
  "cpu-ryzen-7":
    "https://www.amd.com/en/products/processors/desktops/ryzen.html",
  "m2-air-16": "https://www.apple.com/tr/shop/buy-mac/macbook-air",
  "mac-mini-m4-16": "https://www.apple.com/tr/shop/buy-mac/mac-mini",
  "mac-mini-m4-24": "https://www.apple.com/tr/shop/buy-mac/mac-mini",
  "mac-mini-m4-pro-24": "https://www.apple.com/tr/shop/buy-mac/mac-mini/m4-pro",
  "mac-mini-m4-pro-48": "https://www.apple.com/tr/shop/buy-mac/mac-mini/m4-pro",
  "mac-mini-m4-pro-64": "https://www.apple.com/tr/shop/buy-mac/mac-mini/m4-pro",
  "m3-max-36": "https://www.apple.com/tr/shop/buy-mac/macbook-pro",
  "mac-studio-m2-max-32": "https://support.apple.com/tr-tr/111835",
  "mac-studio-m4-max-36": "https://www.apple.com/tr/shop/buy-mac/mac-studio",
  "mac-studio-m4-max-48": "https://www.apple.com/tr/shop/buy-mac/mac-studio",
  "mac-studio-m2-ultra-64": "https://support.apple.com/tr-tr/111837",
  "mac-studio-m2-ultra-64-used":
    "https://support.apple.com/tr-tr/111837",
  "mac-studio-m3-ultra-192": "https://www.apple.com/tr/shop/buy-mac/mac-studio",
  "cluster-4x-mac-mini-m4-16": "https://github.com/exo-explore/exo",
  "cluster-2x-mac-mini-m4-pro-24": "https://github.com/exo-explore/exo",
  "cluster-2x-mac-mini-m4-pro-64": "https://github.com/exo-explore/exo",
  "cluster-4x-mac-mini-m4-pro-64": "https://blog.exolabs.net/day-2/",
  "asus-ascent-gx10":
    "https://www.asus.com/tr/networking-iot-servers/desktop-ai-supercomputer/ultra-small-ai-supercomputers/asus-ascent-gx10/",
  "nvidia-dgx-spark":
    "https://marketplace.nvidia.com/en-us/enterprise/personal-ai-supercomputers/dgx-spark/",
  "framework-desktop-amd-395-128": "https://frame.work/desktop",
  "framework-desktop-amd-395-64": "https://frame.work/desktop",
  "rtx-4070":
    "https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4070-family/",
  "pc-single-3090":
    "https://www.nvidia.com/en-us/geforce/graphics-cards/30-series/rtx-3090-3090ti/",
  "pc-dual-3090":
    "https://www.nvidia.com/en-us/geforce/graphics-cards/30-series/rtx-3090-3090ti/",
  "rtx-4090":
    "https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4090/",
  "ws-dual-4090":
    "https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4090/",
  "raspberry-pi-5": "https://www.raspberrypi.com/products/raspberry-pi-5/",
};

/**
 * Donanım profilleri. Fiyatlar USD ve (varsa) TL cinsinden yaklaşıktır (2026-Q1 piyasa).
 * TL fiyatları Türkiye pazarı için Apple resmi fiyatlar ve ikinci el platformlar (pazar ortalaması) referans alınmıştır.
 * Güç tüketimi tam sistem load'unu temsil eder.
 *
 * Kullanıcı hedefi: Büyük modelleri (30B-70B+) uygun fiyata çalıştırmak.
 * Bu hedefe göre "kullanılabilir bellek / TL" metriği kritik önemde.
 */
const RAW_PROFILES: Hardware[] = [
  {
    id: "cpu-ryzen-7",
    name: "CPU-only PC (Ryzen 7 + 32GB RAM)",
    type: "desktop",
    vendor: "AMD",
    ramGB: 32,
    approxPriceUSD: 900,
    approxPriceTRY: 32_000,
    market: "new",
    memoryBandwidthGBs: 80,
    idlePowerW: 55,
    loadPowerW: 160,
    osSupport: ["windows", "linux"],
    strengths: [
      "Ucuz ve her yerde bulunur",
      "7B modeller çalıştırılabilir",
      "Genel amaçlı kullanım",
    ],
    weaknesses: [
      "GPU yok: 13B+ yavaş",
      "Token/s sınırlı",
      "Uzun context çok yavaşlar",
    ],
  },
  {
    id: "m2-air-16",
    name: "MacBook Air M2 16GB",
    type: "laptop",
    vendor: "Apple",
    unifiedMemoryGB: 16,
    ramGB: 16,
    approxPriceUSD: 1400,
    approxPriceTRY: 48_000,
    market: "new",
    memoryBandwidthGBs: 100,
    idlePowerW: 5,
    loadPowerW: 28,
    osSupport: ["macos"],
    strengths: [
      "Sessiz, fansız",
      "Unified memory GPU erişimi",
      "Mobilite + iyi pil",
    ],
    weaknesses: [
      "13B+ için yetersiz bellek",
      "Termal throttling uzun süreli kullanımda",
    ],
  },
  {
    id: "mac-mini-m4-16",
    name: "Mac mini M4 · 16GB · 512GB",
    type: "desktop",
    vendor: "Apple",
    unifiedMemoryGB: 16,
    ramGB: 16,
    approxPriceUSD: 999,
    approxPriceTRY: 42_000,
    market: "new",
    memoryBandwidthGBs: 120,
    nodeCount: 1,
    idlePowerW: 4,
    loadPowerW: 45,
    osSupport: ["macos"],
    strengths: [
      "Sıfır 42K ₺ · 512GB SSD baseline (256GB NAND tuzağı yok)",
      "Olağanüstü TL/performans (≤8B modellerde)",
      "Küçük, sessiz, fansız benzeri · 7/24 server olarak ideal",
    ],
    weaknesses: [
      "11GB kullanılabilir bellek → sadece 3-8B modeller",
      "14B+ modellerde context daralır veya sığmaz",
      "70B hayal edilemez",
    ],
  },
  {
    id: "mac-mini-m4-24",
    name: "Mac mini M4 · 24GB · 512GB",
    type: "desktop",
    vendor: "Apple",
    unifiedMemoryGB: 24,
    ramGB: 24,
    approxPriceUSD: 1449,
    approxPriceTRY: 61_000,
    market: "new",
    memoryBandwidthGBs: 120,
    nodeCount: 1,
    idlePowerW: 5,
    loadPowerW: 50,
    osSupport: ["macos"],
    strengths: [
      "Sıfır 61K ₺ · 16-17GB kullanılabilir → 14B Q6 rahat",
      "Base M4 çipi + 512GB SSD (dual NAND)",
      "Node olarak ucuz cluster tabanı (2× = 122K ₺)",
    ],
    weaknesses: [
      "Yine 120 GB/s bant (M4 Pro'nun yarısından az)",
      "Fiyat/RAM oranı: 24GB için M4 Pro'ya alternatif değil",
      "32B+ modeller için tek başına yetersiz",
    ],
  },
  {
    id: "mac-mini-m4-pro-24",
    name: "Mac mini M4 Pro 12/16 · 24GB · 512GB",
    type: "desktop",
    vendor: "Apple",
    unifiedMemoryGB: 24,
    ramGB: 24,
    approxPriceUSD: 1799,
    approxPriceTRY: 78_000,
    market: "new",
    memoryBandwidthGBs: 273,
    nodeCount: 1,
    idlePowerW: 5,
    loadPowerW: 65,
    osSupport: ["macos"],
    strengths: [
      "Sıfır 78K ₺ · 273 GB/s bant (M4'ün 2.3x'i)",
      "Thunderbolt 5 ile clusterlanabilir (2× = 160K cluster)",
      "16-17GB kullanılabilir → 14B Q6 rahat",
    ],
    weaknesses: [
      "78K ₺ yalnızca 24GB",
      "32B+ modeller için tek başına yetersiz",
    ],
  },
  {
    id: "mac-mini-m4-pro-48",
    name: "Mac mini M4 Pro 14/20 · 48GB · 1TB",
    type: "desktop",
    vendor: "Apple",
    unifiedMemoryGB: 48,
    ramGB: 48,
    approxPriceUSD: 2399,
    approxPriceTRY: 125_000,
    market: "new",
    memoryBandwidthGBs: 273,
    nodeCount: 1,
    idlePowerW: 6,
    loadPowerW: 70,
    osSupport: ["macos"],
    strengths: [
      "Tek makinede 70B Q4 sığar (~34GB kullanılabilir)",
      "125K ₺'de yeni + 14CPU/20GPU + 1TB + garanti + sessiz",
      "TB5 ile upgrade: ikinci node ile 96GB'a çıkar",
    ],
    weaknesses: [
      "273 GB/s bant → 70B Q4 ~6-8 tok/s",
      "Fine-tune ekosistemi yok (MLX orta seviye)",
      "Apple TR 2026-Q2: 14CPU/20GPU/48GB/1TB BTO ~120-128K ₺",
    ],
  },
  {
    id: "mac-mini-m4-pro-64",
    name: "Mac mini M4 Pro 14/20 · 64GB · 1TB",
    type: "desktop",
    vendor: "Apple",
    unifiedMemoryGB: 64,
    ramGB: 64,
    approxPriceUSD: 2799,
    approxPriceTRY: 142_000,
    market: "new",
    memoryBandwidthGBs: 273,
    nodeCount: 1,
    idlePowerW: 6,
    loadPowerW: 75,
    osSupport: ["macos"],
    strengths: [
      "142K ₺ tek kasa · 45GB kullanılabilir · 70B Q4 konforlu",
      "Cluster için mükemmel node (Exo 8x ile 512GB pool)",
      "Sessiz + 75W max + garanti",
    ],
    weaknesses: [
      "273 GB/s bant (M2 Ultra'nın üçte biri)",
      "Çok büyük modeller (180B+) için cluster şart",
    ],
  },
  {
    id: "cluster-4x-mac-mini-m4-16",
    name: "Cluster: 4× Mac mini M4 · 16GB · 512GB (Exo + TB4)",
    type: "cluster",
    vendor: "Apple",
    unifiedMemoryGB: 64,
    ramGB: 64,
    approxPriceUSD: 3996,
    approxPriceTRY: 172_000,
    market: "new",
    memoryBandwidthGBs: 120,
    nodeCount: 4,
    interconnect: "thunderbolt-4",
    idlePowerW: 16,
    loadPowerW: 180,
    osSupport: ["macos"],
    strengths: [
      "4× 42K = 168K + TB4 kablo/switch ≈ 172K ₺ · 64GB pool",
      "Node başına bağımsız — biri bozulsa kalan çalışır",
      "İncremental satın alma mümkün (önce 2, sonra 4)",
    ],
    weaknesses: [
      "TB4 (40Gb/s) clustering 70B'de ~2-4 tok/s (TB5'in yarısı)",
      "Tensor parallel overhead nedeniyle efektif ~44GB",
      "Fiziksel 4 kasa + 6 kablo + güç düzeni",
    ],
  },
  {
    id: "cluster-2x-mac-mini-m4-pro-24",
    name: "Cluster: 2× Mac mini M4 Pro · 24GB · 512GB (Exo + TB5)",
    type: "cluster",
    vendor: "Apple",
    unifiedMemoryGB: 48,
    ramGB: 48,
    approxPriceUSD: 3598,
    approxPriceTRY: 160_000,
    market: "new",
    memoryBandwidthGBs: 273,
    nodeCount: 2,
    interconnect: "thunderbolt-5",
    idlePowerW: 10,
    loadPowerW: 135,
    osSupport: ["macos"],
    strengths: [
      "2× 78K + TB5 kablo ≈ 160K ₺ · 48GB pool · 35GB kullanılabilir",
      "TB5 (80 Gb/s) → tensor parallel verim %85",
      "Tek node 24GB serverı olarak da yedekte kalır",
    ],
    weaknesses: [
      "35GB usable → 32B Q4 rahat, 70B Q4 sığmaz",
      "Aynı parada M2 Ultra 64GB sıfır (160K ₺) → tek kasa + 800 GB/s",
      "273 GB/s bant M2 Ultra'nın 1/3'ü",
    ],
  },
  {
    id: "cluster-2x-mac-mini-m4-pro-64",
    name: "Cluster: 2x Mac mini M4 Pro 64GB (Exo + TB5)",
    type: "cluster",
    vendor: "Apple",
    unifiedMemoryGB: 128,
    ramGB: 128,
    approxPriceUSD: 5600,
    approxPriceTRY: 286_000,
    market: "new",
    memoryBandwidthGBs: 273,
    nodeCount: 2,
    interconnect: "thunderbolt-5",
    idlePowerW: 12,
    loadPowerW: 150,
    osSupport: ["macos"],
    strengths: [
      "128GB unified pool · 90GB kullanılabilir",
      "TB5 + RDMA → %99 latency azaltma",
      "Llama 70B Q8 veya 120B Q4 çalışır",
    ],
    weaknesses: [
      "286K ₺ (2× 142K + TB5 kablo + aksesuar)",
      "Yine de tek M2 Ultra 64GB kadar bant genişliği yok",
    ],
  },
  {
    id: "cluster-4x-mac-mini-m4-pro-64",
    name: "Cluster: 4x Mac mini M4 Pro 64GB (Exo + TB5)",
    type: "cluster",
    vendor: "Apple",
    unifiedMemoryGB: 256,
    ramGB: 256,
    approxPriceUSD: 11_200,
    approxPriceTRY: 572_000,
    market: "new",
    memoryBandwidthGBs: 273,
    nodeCount: 4,
    interconnect: "thunderbolt-5",
    idlePowerW: 24,
    loadPowerW: 300,
    osSupport: ["macos"],
    strengths: [
      "256GB pool · Nemotron 70B ~8 tok/s",
      "Llama 3.3 70B Q4 ~3.9 tok/s (ölçülmüş)",
      "DeepSeek V3 671B Q4 pratik sınırda",
    ],
    weaknesses: [
      "480K TL (referans: benchmark gerçek kurulumu)",
      "Bütçe dışı ama yol haritası için önemli",
    ],
  },
  {
    id: "m3-max-36",
    name: "MacBook Pro M3 Max 36GB",
    type: "laptop",
    vendor: "Apple",
    unifiedMemoryGB: 36,
    ramGB: 36,
    approxPriceUSD: 3500,
    approxPriceTRY: 125_000,
    market: "new",
    memoryBandwidthGBs: 400,
    idlePowerW: 10,
    loadPowerW: 90,
    osSupport: ["macos"],
    strengths: [
      "~400GB/s bellek bant genişliği",
      "Uzun context verimli",
      "30B+ quant modeller çalışır",
    ],
    weaknesses: [
      "Pahalı",
      "CUDA ekosistemi yok",
      "70B için hâlâ sınırda",
    ],
  },
  {
    id: "mac-studio-m2-max-32",
    name: "Mac Studio M2 Max · 32GB · 512GB",
    type: "workstation",
    vendor: "Apple",
    unifiedMemoryGB: 32,
    ramGB: 32,
    approxPriceUSD: 2400,
    approxPriceTRY: 102_000,
    market: "new",
    memoryBandwidthGBs: 400,
    idlePowerW: 10,
    loadPowerW: 100,
    osSupport: ["macos"],
    strengths: [
      "Sıfır 102K ₺ · 400 GB/s bant (M4 Pro'nun ~1.5×'i)",
      "22GB kullanılabilir → 32B Q4 rahat (~10-12 tok/s)",
      "Prompt processing M4 Pro'dan 2×+ hızlı",
    ],
    weaknesses: [
      "70B Q4 sığmaz (32GB total → 22GB usable)",
      "M4 Max 36GB sıfır 120K ₺'de sadece +18K farkla ~10% daha hızlı",
      "2023 silikon — ömür döngüsü M4'e göre kısa",
    ],
  },
  {
    id: "mac-studio-m4-max-36",
    name: "Mac Studio M4 Max · 36GB · 512GB",
    type: "workstation",
    vendor: "Apple",
    unifiedMemoryGB: 36,
    ramGB: 36,
    approxPriceUSD: 2800,
    approxPriceTRY: 120_000,
    market: "new",
    memoryBandwidthGBs: 410,
    idlePowerW: 8,
    loadPowerW: 90,
    osSupport: ["macos"],
    strengths: [
      "Sıfır 120K ₺ · 410 GB/s bant + M4 Max compute",
      "Masaüstü form faktöründe M4 Max · sessiz, düşük güç",
      "32B Q4 modelleri rahat çalıştırır (~14 tok/s)",
    ],
    weaknesses: [
      "25GB kullanılabilir → 70B Q4 sığmaz (Q3 zorla)",
      "Bütçe/bellek oranı orta (4.8K ₺/GB)",
      "Mac mini M4 Pro 24GB'a göre 1.5× fiyat, ~2× hız",
    ],
  },
  {
    id: "mac-studio-m4-max-48",
    name: "Mac Studio M4 Max · 48GB · 1TB",
    type: "workstation",
    vendor: "Apple",
    unifiedMemoryGB: 48,
    ramGB: 48,
    approxPriceUSD: 3900,
    approxPriceTRY: 150_000,
    market: "new",
    memoryBandwidthGBs: 410,
    idlePowerW: 10,
    loadPowerW: 95,
    osSupport: ["macos"],
    strengths: [
      "Apple yeni makinelerde 'büyük model' sweet spot",
      "70B Q4 sığar (34GB kullanılabilir)",
      "Sessiz, garantili",
    ],
    weaknesses: [
      "70B'de ~5-8 tok/s (hızı sınırda)",
      "M2 Ultra ikinci el ile kıyasta bant genişliği yarı",
    ],
  },
  {
    id: "mac-studio-m2-ultra-64",
    name: "Mac Studio M2 Ultra · 64GB · 512GB (sıfır)",
    type: "workstation",
    vendor: "Apple",
    unifiedMemoryGB: 64,
    ramGB: 64,
    approxPriceUSD: 3999,
    approxPriceTRY: 160_000,
    market: "new",
    memoryBandwidthGBs: 800,
    idlePowerW: 15,
    loadPowerW: 130,
    osSupport: ["macos"],
    strengths: [
      "Sıfır 160K ₺ · 800 GB/s bant (M4 Max'ın 2×'i)",
      "45GB kullanılabilir → 70B Q4 rahat, ~12-15 tok/s",
      "Tek kasa + Apple garantisi · API servisi için sweet spot",
    ],
    weaknesses: [
      "Apple yeni satıştan kaldırabilir (M3 Ultra sonrası)",
      "CUDA yok (vLLM, fine-tune ekosistemi zor)",
      "70B Q8 sığmaz (64GB yeterli değil)",
    ],
  },
  {
    id: "mac-studio-m2-ultra-64-used",
    name: "Mac Studio M2 Ultra · 64GB · 512GB (ikinci el)",
    type: "workstation",
    vendor: "Apple",
    unifiedMemoryGB: 64,
    ramGB: 64,
    approxPriceUSD: 2800,
    approxPriceTRY: 115_000,
    market: "used",
    memoryBandwidthGBs: 800,
    idlePowerW: 15,
    loadPowerW: 130,
    osSupport: ["macos"],
    strengths: [
      "2. el 115K ₺ (~sıfırın %72'si) · benzer donanım",
      "45GB kullanılabilir → 70B Q4 rahat, ~12-15 tok/s",
      "Benzer TL bütçede yeni makineleri geçer",
    ],
    weaknesses: [
      "İkinci el garanti riski · AppleCare+ uzatılamayabilir",
      "Sıfır 160K ₺ seçeneği varken TCO farkı dar",
      "CUDA yok (vLLM, fine-tune ekosistemi zor)",
    ],
  },
  {
    id: "mac-studio-m3-ultra-192",
    name: "Mac Studio M3 Ultra 192GB",
    type: "workstation",
    vendor: "Apple",
    unifiedMemoryGB: 192,
    ramGB: 192,
    approxPriceUSD: 9000,
    approxPriceTRY: 320_000,
    market: "new",
    memoryBandwidthGBs: 819,
    idlePowerW: 18,
    loadPowerW: 170,
    osSupport: ["macos"],
    strengths: [
      "Tek makinede DeepSeek V3 / Llama 4 400B Q4 çalışır",
      "Frontier'a yakın yerel deneyim",
      "Sessiz, tek fiş",
    ],
    weaknesses: [
      "Çok pahalı",
      "Upgrade yok",
      "CUDA ekosistem boşluğu büyük modelde daha hissedilir",
    ],
  },
  // --------------------------------------------------------------------------
  // 2026 yeni sınıf: AI-özel mini workstation'lar (GB10, Strix Halo)
  // Kaynaklar: NVIDIA, ASUS Pressroom (Ekim 2025), AMD/Framework, Ollama/LMSYS
  // benchmarkları, Tom's Hardware, Exo Labs.
  // --------------------------------------------------------------------------
  {
    id: "asus-ascent-gx10",
    name: "ASUS Ascent GX10 (NVIDIA GB10)",
    type: "workstation",
    vendor: "ASUS / NVIDIA",
    unifiedMemoryGB: 128,
    ramGB: 128,
    approxPriceUSD: 3999,
    approxPriceTRY: 250_000,
    market: "new",
    memoryBandwidthGBs: 273,
    nodeCount: 1,
    interconnect: "thunderbolt-4",
    idlePowerW: 35,
    loadPowerW: 170,
    osSupport: ["linux"],
    strengths: [
      "1 PFLOPS FP4 AI compute · Grace Blackwell Superchip",
      "128GB LPDDR5X unified → 200B model kadar",
      "CUDA + NVFP4 + pre-made containers tam ekosistem",
      "İki birim ConnectX-7 ile bağlanabilir",
    ],
    weaknesses: [
      "Türkiye'de 250K TL — bütçenin 2x'i",
      "273 GB/s bant → 70B Q4 ~4.4 tok/s (yavaş)",
      "ARM Grace CPU (x86 uyumluluğu yok)",
      "Ubuntu-only, oyun/multimedia için değil",
    ],
  },
  {
    id: "nvidia-dgx-spark",
    name: "NVIDIA DGX Spark (GB10)",
    type: "workstation",
    vendor: "NVIDIA",
    unifiedMemoryGB: 128,
    ramGB: 128,
    approxPriceUSD: 4699,
    approxPriceTRY: 290_000,
    market: "new",
    memoryBandwidthGBs: 273,
    nodeCount: 1,
    interconnect: "thunderbolt-4",
    idlePowerW: 35,
    loadPowerW: 170,
    osSupport: ["linux"],
    strengths: [
      "ASUS Ascent ile aynı GB10 platformu + 4TB SSD",
      "DGX OS (NVIDIA kurumsal destek)",
      "Exo hybrid: prefill DGX Spark + decode Mac Studio = 4x hız",
    ],
    weaknesses: [
      "Türkiye'de yaygın satış yok (~290K TL tahmini)",
      "Ascent GX10'dan ~32.000 ₺ daha pahalı, aynı çipsetle",
      "70B Q4 tok/s Mac Studio M2 Ultra'dan düşük",
    ],
  },
  {
    id: "framework-desktop-amd-395-128",
    name: "Framework Desktop (Ryzen AI Max+ 395, 128GB)",
    type: "desktop",
    vendor: "AMD / Framework",
    unifiedMemoryGB: 128,
    ramGB: 128,
    approxPriceUSD: 3300,
    approxPriceTRY: 140_000,
    market: "new",
    memoryBandwidthGBs: 212,
    nodeCount: 1,
    idlePowerW: 25,
    loadPowerW: 180,
    osSupport: ["linux", "windows"],
    strengths: [
      "128GB unified (96GB VRAM allocatable)",
      "Strix Halo · Radeon 8060S 40 CU + 50 TOPS NPU",
      "x86 uyumlu · Linux + Windows",
      "Onarılabilir/modüler (Framework felsefesi)",
    ],
    weaknesses: [
      "~212 GB/s ölçülen bant (DGX Spark kadar düşük)",
      "ROCm olgun değil (CUDA yok)",
      "Llama 70B Q4 ~5-12 tok/s, DeepSeek R1 70B Q8 ~3 tok/s",
      "Türkiye'de doğrudan satış yok (ithalat + gümrük)",
    ],
  },
  {
    id: "framework-desktop-amd-395-64",
    name: "Framework Desktop (Ryzen AI Max+ 395, 64GB)",
    type: "desktop",
    vendor: "AMD / Framework",
    unifiedMemoryGB: 64,
    ramGB: 64,
    approxPriceUSD: 2000,
    approxPriceTRY: 85_000,
    market: "new",
    memoryBandwidthGBs: 212,
    nodeCount: 1,
    idlePowerW: 25,
    loadPowerW: 180,
    osSupport: ["linux", "windows"],
    strengths: [
      "64GB unified · 70B Q4 sığar (~45GB kullanılabilir)",
      "x86 Windows + Linux",
      "Mini PC form · 180W max",
    ],
    weaknesses: [
      "212 GB/s bant → 70B Q4 ~6-8 tok/s",
      "ROCm ekosistem gelişim aşamasında",
      "TR'de doğrudan satış yok",
    ],
  },
  {
    id: "rtx-4070",
    name: "Desktop + RTX 4070 (12GB VRAM)",
    type: "desktop",
    vendor: "NVIDIA",
    gpu: { model: "RTX 4070", vramGB: 12 },
    ramGB: 32,
    approxPriceUSD: 1500,
    approxPriceTRY: 50_000,
    market: "new",
    memoryBandwidthGBs: 504,
    idlePowerW: 70,
    loadPowerW: 340,
    osSupport: ["windows", "linux"],
    strengths: [
      "CUDA ekosistemi tam",
      "8B quant modeller çok hızlı",
      "Fiyat/performans dengeli",
    ],
    weaknesses: [
      "12GB 13B+ için kısıtlı",
      "70B modeller için partial offload gerekli",
      "Yüksek güç tüketimi",
    ],
  },
  {
    id: "pc-single-3090",
    name: "PC + RTX 3090 24GB (ikinci el) + 64GB RAM",
    type: "desktop",
    vendor: "NVIDIA",
    gpu: { model: "RTX 3090 (ikinci el)", vramGB: 24 },
    ramGB: 64,
    approxPriceUSD: 2000,
    approxPriceTRY: 85_000,
    market: "used",
    memoryBandwidthGBs: 936,
    idlePowerW: 75,
    loadPowerW: 420,
    osSupport: ["linux", "windows"],
    strengths: [
      "En ucuz 24GB VRAM yolu",
      "32B modeller rahat, 70B partial offload ile çalışır",
      "CUDA ekosistemi tam (vLLM, fine-tune, LoRA)",
    ],
    weaknesses: [
      "2026-Q2: 2. el 3090 TR'de 25-30K ₺, sahibinden tek 3090 sistem 95K ₺'den başlıyor",
      "70B partial offload: ~5-8 tok/s (yavaş)",
      "Madencilik kartı riski (termal stres, RMA yok)",
      "Yüksek güç + gürültü",
    ],
  },
  {
    id: "pc-dual-3090",
    name: "PC + 2x RTX 3090 48GB (ikinci el DIY)",
    type: "workstation",
    vendor: "NVIDIA",
    gpu: { model: "2x RTX 3090 (ikinci el)", vramGB: 48 },
    ramGB: 128,
    approxPriceUSD: 3400,
    approxPriceTRY: 150_000,
    market: "used",
    memoryBandwidthGBs: 936,
    idlePowerW: 140,
    loadPowerW: 750,
    osSupport: ["linux", "windows"],
    strengths: [
      "Büyük model için en iyi TL/GB oranı (~3.1K TL/GB)",
      "70B Q4 tam VRAM'de, ~18-25 tok/s",
      "Fine-tuning, LoRA, DPO — CUDA tam ekosistem",
      "Upgrade yolu açık (tek kart değiştir)",
    ],
    weaknesses: [
      "2026-Q2 gerçekçi DIY bütçesi: 135-160K ₺ (2× 3090 2. el 55-60K + yeni sistem 80-100K)",
      "Hazır/integrator sistem 180-220K ₺'ye çıkar (Greenbeast/Custom Lux örnekleri)",
      "1500W+ PSU zorunlu",
      "Gürültü, ısı, soğutma planlanmalı",
      "Madencilik kartı riski 2 katı",
      "Elektrik ~685 ₺/ay ek maliyet",
    ],
  },
  {
    id: "rtx-4090",
    name: "Desktop + RTX 4090 (24GB VRAM)",
    type: "desktop",
    vendor: "NVIDIA",
    gpu: { model: "RTX 4090", vramGB: 24 },
    ramGB: 64,
    approxPriceUSD: 3200,
    approxPriceTRY: 115_000,
    market: "new",
    memoryBandwidthGBs: 1008,
    idlePowerW: 90,
    loadPowerW: 500,
    osSupport: ["windows", "linux"],
    strengths: [
      "24GB tüketici sınıfın zirvesi",
      "30B quant modeller rahat",
      "En yüksek tokens/s tüketici sınıfta",
    ],
    weaknesses: [
      "Pahalı",
      "Çok yüksek güç tüketimi",
      "70B modeller agresif quant gerektirir",
    ],
  },
  {
    id: "ws-dual-4090",
    name: "Workstation: 2x RTX 4090 (48GB toplam)",
    type: "workstation",
    vendor: "NVIDIA",
    gpu: { model: "2x RTX 4090", vramGB: 48 },
    ramGB: 128,
    approxPriceUSD: 7500,
    approxPriceTRY: 270_000,
    market: "new",
    memoryBandwidthGBs: 1008,
    idlePowerW: 180,
    loadPowerW: 950,
    osSupport: ["linux", "windows"],
    strengths: [
      "70B modeller rahat çalışır (~35-45 tok/s)",
      "Multi-GPU split + en yüksek throughput",
      "Paralel model servisleri",
    ],
    weaknesses: [
      "Çok pahalı (dual 3090'a göre 2.5x)",
      "Yüksek elektrik maliyeti",
      "Gürültü ve ısı yönetimi",
    ],
  },
  {
    id: "raspberry-pi-5",
    name: "Raspberry Pi 5 8GB (edge)",
    type: "edge",
    vendor: "Raspberry Pi",
    ramGB: 8,
    approxPriceUSD: 120,
    approxPriceTRY: 4_200,
    market: "new",
    memoryBandwidthGBs: 17,
    idlePowerW: 3,
    loadPowerW: 10,
    osSupport: ["linux"],
    strengths: [
      "Çok ucuz",
      "Sürekli çalışabilir",
      "Küçük modeller (1-3B) için yeterli",
    ],
    weaknesses: [
      "Çok yavaş",
      "Sadece küçük modeller",
      "Üretim kullanımı için uygun değil",
    ],
  },
];

/** URL + TTFT + risk + akustik + termal merge edilmiş nihai donanım listesi. */
export const hardwareProfiles: Hardware[] = RAW_PROFILES.map((h) => {
  const ac = HARDWARE_ACOUSTICS[h.id];
  return {
    ...h,
    url: HARDWARE_URLS[h.id] ?? h.url,
    promptEvalTPS70BQ4:
      h.promptEvalTPS70BQ4 ?? HARDWARE_PROMPT_EVAL_TPS[h.id],
    importRisk: h.importRisk ?? HARDWARE_IMPORT_RISK[h.id] ?? "none",
    noiseDbIdle: h.noiseDbIdle ?? ac?.idle,
    noiseDbLoad: h.noiseDbLoad ?? ac?.load,
    acousticClass: h.acousticClass ?? ac?.cls,
    summerThermalPenalty:
      h.summerThermalPenalty ?? HARDWARE_SUMMER_PENALTY[h.id],
  };
});

export const getHardwareById = (id: string) =>
  hardwareProfiles.find((h) => h.id === id);

/**
 * LLM için kullanılabilir belleği hesaplar (yaklaşık).
 * Apple tekli: unified memory %70.
 * Apple cluster: tensor parallel overhead (~%15); interconnect'e göre +/- ince ayar.
 * NVIDIA: VRAM %90; CPU-only: RAM %60.
 */
export function usableLLMMemoryGB(hw: Hardware): number {
  if (hw.gpu) return +(hw.gpu.vramGB * 0.9).toFixed(1);
  if (hw.unifiedMemoryGB) {
    const base = hw.unifiedMemoryGB * 0.7;
    if (hw.type === "cluster") {
      // Tensor parallel ~%85 verim; TB4 daha kötü (~%75).
      const clusterEfficiency =
        hw.interconnect === "thunderbolt-5" ? 0.85 : 0.75;
      return +(base * clusterEfficiency).toFixed(1);
    }
    return +base.toFixed(1);
  }
  return +(hw.ramGB * 0.6).toFixed(1);
}

/**
 * TL başına kullanılabilir bellek (GB). Büyük model perspektifinde ana metrik.
 */
export function tryPerGB(hw: Hardware): number | null {
  if (!hw.approxPriceTRY) return null;
  const usable = usableLLMMemoryGB(hw);
  return Math.round(hw.approxPriceTRY / usable);
}
