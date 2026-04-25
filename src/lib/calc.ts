import type { Model, Hardware, Quantization, UseCase } from "@/types";
import { USD_TO_TRY } from "./utils";

/**
 * VRAM tahmini.
 * formül: params(B) * bytesPerParam + context_overhead + runtime_overhead
 * - context_overhead ≈ 0.5 GB / 32K token (KV cache yaklaşık)
 * - runtime_overhead ≈ 1.2 katsayısı (activation + graph)
 */
export function estimateVramGB(model: Model, quant: Quantization): number {
  const paramsGB = model.params * quant.bytesPerParam;
  const contextGB = (model.contextLength / 32_000) * 0.5;
  return +(paramsGB * 1.15 + contextGB).toFixed(1);
}

/**
 * Donanımda modelin sığıp sığmadığı.
 * - Apple Silicon'da unifiedMemory'nin ~%70'i kullanılabilir.
 * - NVIDIA'da VRAM'in ~%90'ı kullanılabilir.
 */
export function doesFit(
  hw: Hardware,
  requiredVramGB: number
): { fits: boolean; mode: "vram" | "unified" | "partial" | "nofit" } {
  if (hw.gpu) {
    const usable = hw.gpu.vramGB * 0.9;
    if (requiredVramGB <= usable) return { fits: true, mode: "vram" };
    if (requiredVramGB <= usable + hw.ramGB * 0.5)
      return { fits: true, mode: "partial" };
    return { fits: false, mode: "nofit" };
  }
  if (hw.unifiedMemoryGB) {
    const usable = hw.unifiedMemoryGB * 0.7;
    if (requiredVramGB <= usable) return { fits: true, mode: "unified" };
    return { fits: false, mode: "nofit" };
  }
  // CPU-only
  const usable = hw.ramGB * 0.6;
  if (requiredVramGB <= usable) return { fits: true, mode: "partial" };
  return { fits: false, mode: "nofit" };
}

/**
 * Yerel TCO (Total Cost of Ownership) hesabı.
 * - Donanım amortismanı belirli ay sayısına bölünür.
 * - Elektrik maliyeti: yükteki saatler + idle saatler * güç * $/kWh
 */
export interface LocalTcoInput {
  hardware: Hardware;
  amortizationMonths: number;
  hoursPerDayUnderLoad: number;
  electricityUsdPerKwh: number;
}

export interface LocalTcoResult {
  hwMonthlyUsd: number;
  electricityMonthlyUsd: number;
  totalMonthlyUsd: number;
  totalOneYearUsd: number;
}

export function localTco(input: LocalTcoInput): LocalTcoResult {
  const { hardware, amortizationMonths, hoursPerDayUnderLoad, electricityUsdPerKwh } =
    input;
  const hoursIdle = Math.max(0, 24 - hoursPerDayUnderLoad);
  const dailyKwh =
    (hardware.loadPowerW * hoursPerDayUnderLoad +
      hardware.idlePowerW * hoursIdle) /
    1000;
  const monthlyKwh = dailyKwh * 30;
  const electricityMonthlyUsd = +(monthlyKwh * electricityUsdPerKwh).toFixed(2);
  const hwMonthlyUsd = +(hardware.approxPriceUSD / amortizationMonths).toFixed(2);
  const totalMonthlyUsd = +(hwMonthlyUsd + electricityMonthlyUsd).toFixed(2);
  return {
    hwMonthlyUsd,
    electricityMonthlyUsd,
    totalMonthlyUsd,
    totalOneYearUsd: +(totalMonthlyUsd * 12).toFixed(2),
  };
}

/**
 * Türkiye mesken elektrik kademeli tarifesi (2026-Q1, TL/kWh).
 * EPDK tarife kararı + dağıtım bedeli + vergi + TRT payı dahil yaklaşık rakamlar.
 *
 * - İlk 150 kWh: ~3.20 TL/kWh (düşük kademe)
 * - 150-300 kWh: ~4.80 TL/kWh (orta kademe)
 * - 300+ kWh: ~6.20 TL/kWh (yüksek kademe)
 *
 * AI çalıştıran bir kullanıcı tipik olarak yüksek kademeyi aşar, bu nedenle
 * marjinal kWh maliyetinin yaklaşık 5.5-6.2 TL olduğunu varsaymak gerçekçi.
 */
export const TR_ELECTRICITY_TIERS: Array<{
  upToKwh: number;
  tryPerKwh: number;
}> = [
  { upToKwh: 150, tryPerKwh: 3.2 },
  { upToKwh: 300, tryPerKwh: 4.8 },
  { upToKwh: Infinity, tryPerKwh: 6.2 },
];

/**
 * Aylık kWh tüketimi ve (varsa) baz tüketim için kademeli tarife üzerinden
 * toplam TL fatura. `baselineMonthlyKwh` = AI dışı ev tüketimi (ortalama 250 kWh).
 * AI yükü bu baz üzerine eklendiği için genelde yüksek kademeye düşer.
 */
export function tryElectricityMonthlyTL(
  aiMonthlyKwh: number,
  baselineMonthlyKwh = 250,
): {
  baseTL: number;
  withAiTL: number;
  aiDeltaTL: number;
  effectiveAiTLPerKwh: number;
} {
  const bill = (kwh: number) => {
    let remain = kwh;
    let cost = 0;
    let prevCap = 0;
    for (const t of TR_ELECTRICITY_TIERS) {
      const slice = Math.max(0, Math.min(remain, t.upToKwh - prevCap));
      cost += slice * t.tryPerKwh;
      remain -= slice;
      prevCap = t.upToKwh;
      if (remain <= 0) break;
    }
    return cost;
  };
  const baseTL = +bill(baselineMonthlyKwh).toFixed(2);
  const withAiTL = +bill(baselineMonthlyKwh + aiMonthlyKwh).toFixed(2);
  const aiDeltaTL = +(withAiTL - baseTL).toFixed(2);
  const effectiveAiTLPerKwh =
    aiMonthlyKwh > 0 ? +(aiDeltaTL / aiMonthlyKwh).toFixed(2) : 0;
  return { baseTL, withAiTL, aiDeltaTL, effectiveAiTLPerKwh };
}

/**
 * Bir donanımın AI yükünden ötürü aylık ek kWh ve ek TL faturasını hesaplar.
 * Load saatleri dışındaki saatler idle kabul edilir.
 */
export function hardwareMonthlyElectricityTR(
  hw: Hardware,
  hoursPerDayUnderLoad: number,
  baselineMonthlyKwh = 250,
): {
  monthlyKwh: number;
  monthlyTL: number;
  marginalTLPerKwh: number;
  loadDailyKwh: number;
  idleDailyKwh: number;
} {
  const hoursIdle = Math.max(0, 24 - hoursPerDayUnderLoad);
  const loadDailyKwh = (hw.loadPowerW * hoursPerDayUnderLoad) / 1000;
  const idleDailyKwh = (hw.idlePowerW * hoursIdle) / 1000;
  const monthlyKwh = +((loadDailyKwh + idleDailyKwh) * 30).toFixed(2);
  const tier = tryElectricityMonthlyTL(monthlyKwh, baselineMonthlyKwh);
  return {
    monthlyKwh,
    monthlyTL: tier.aiDeltaTL,
    marginalTLPerKwh: tier.effectiveAiTLPerKwh,
    loadDailyKwh: +loadDailyKwh.toFixed(2),
    idleDailyKwh: +idleDailyKwh.toFixed(2),
  };
}

/**
 * Yerel TCO'nun TL tabanlı versiyonu.
 *
 * - Donanım tarafı: varsa `approxPriceTRY` (Türkiye gerçek pazar), yoksa
 *   global `approxPriceUSD * 45 TL` olarak tahmin edilir.
 * - Elektrik: düz `tryPerKwh` değeri ile çarpılır (UI'da slider, varsayılan
 *   5 TL/kWh — yüksek kademeye düşmüş bir konut faturasının marjinal maliyeti).
 */
export interface LocalTcoTRYInput {
  hardware: Hardware;
  amortizationMonths: number;
  hoursPerDayUnderLoad: number;
  tryPerKwh: number;
}

export interface LocalTcoTRYResult {
  hwMonthlyTL: number;
  electricityMonthlyTL: number;
  totalMonthlyTL: number;
  totalOneYearTL: number;
}

export function localTcoTRY(input: LocalTcoTRYInput): LocalTcoTRYResult {
  const { hardware, amortizationMonths, hoursPerDayUnderLoad, tryPerKwh } =
    input;
  const hoursIdle = Math.max(0, 24 - hoursPerDayUnderLoad);
  const dailyKwh =
    (hardware.loadPowerW * hoursPerDayUnderLoad +
      hardware.idlePowerW * hoursIdle) /
    1000;
  const monthlyKwh = dailyKwh * 30;
  const electricityMonthlyTL = +(monthlyKwh * tryPerKwh).toFixed(2);
  const priceTL =
    hardware.approxPriceTRY ?? hardware.approxPriceUSD * USD_TO_TRY;
  const hwMonthlyTL = +(priceTL / amortizationMonths).toFixed(2);
  const totalMonthlyTL = +(hwMonthlyTL + electricityMonthlyTL).toFixed(2);
  return {
    hwMonthlyTL,
    electricityMonthlyTL,
    totalMonthlyTL,
    totalOneYearTL: +(totalMonthlyTL * 12).toFixed(2),
  };
}

/**
 * Cloud API TCO hesabı.
 * tokensPerDay = girdi + çıktı toplamı kabul edilir;
 * in/out oranı ~= 70/30 varsayılır (chat ve RAG için tipik).
 */
export interface CloudTcoInput {
  tokensPerDay: number;
  pricePerMillionIn: number;
  pricePerMillionOut: number;
  inOutRatio?: number;
}

export function cloudTco({
  tokensPerDay,
  pricePerMillionIn,
  pricePerMillionOut,
  inOutRatio = 0.7,
}: CloudTcoInput): { monthlyUsd: number; yearlyUsd: number } {
  const monthlyTokens = tokensPerDay * 30;
  const inTokens = monthlyTokens * inOutRatio;
  const outTokens = monthlyTokens * (1 - inOutRatio);
  const monthlyUsd = +(
    (inTokens / 1_000_000) * pricePerMillionIn +
    (outTokens / 1_000_000) * pricePerMillionOut
  ).toFixed(2);
  return { monthlyUsd, yearlyUsd: +(monthlyUsd * 12).toFixed(2) };
}

/**
 * Cloud TCO'nun TL karşılığı. Fiyatlar USD bazlı geldiği için çıktı sabit
 * USD→TRY (45) kuruyla çevrilir.
 */
export function cloudTcoTRY(
  input: CloudTcoInput,
): { monthlyTL: number; yearlyTL: number } {
  const { monthlyUsd, yearlyUsd } = cloudTco(input);
  return {
    monthlyTL: +(monthlyUsd * USD_TO_TRY).toFixed(2),
    yearlyTL: +(yearlyUsd * USD_TO_TRY).toFixed(2),
  };
}

/**
 * Fizibilite skoru (0-100):
 * - vramFit: modelin donanıma sığma derecesi
 * - speed: tokens/s (senaryo latency hassasiyeti ile çarpılır)
 * - quality: modelin parametre sayısı + quant kalite korunumu
 * - ease: runtime + OS uyumu (dışarıdan verilir)
 *
 * Ağırlıklar kullanım senaryosuna göre değişir.
 */
export interface FeasibilityInput {
  vramFit: number; // 0-1
  tokensPerSec: number;
  qualityScore: number; // 0-1
  easeScore: number; // 0-1
  useCase: UseCase;
}

export function feasibilityScore(input: FeasibilityInput): number {
  const { vramFit, tokensPerSec, qualityScore, easeScore, useCase } = input;
  // latency hassasiyeti yüksekse tokens/s daha çok tartar
  const speedNorm = Math.min(1, tokensPerSec / 100);
  const latencyWeight = useCase.latencySensitivity / 5;
  const qualityWeight = useCase.qualitySensitivity / 5;
  const easeWeight = 0.2;
  const fitWeight = 0.3;

  const wSum = latencyWeight + qualityWeight + easeWeight + fitWeight;
  const raw =
    (vramFit * fitWeight +
      speedNorm * latencyWeight +
      qualityScore * qualityWeight +
      easeScore * easeWeight) /
    wSum;

  return Math.round(raw * 100);
}

/**
 * Break-even: yerel ve cloud aylık maliyetleri eşit olduğu günlük token sayısı.
 */
export function breakEvenTokensPerDay(
  localMonthlyUsd: number,
  pricePerMillionIn: number,
  pricePerMillionOut: number,
  inOutRatio = 0.7
): number {
  const effectivePricePerMillion =
    pricePerMillionIn * inOutRatio + pricePerMillionOut * (1 - inOutRatio);
  const monthlyTokens = (localMonthlyUsd / effectivePricePerMillion) * 1_000_000;
  return Math.round(monthlyTokens / 30);
}

/**
 * TL tabanlı break-even: yerelin aylık TL maliyeti ile cloud'un 1M token TL
 * maliyeti eşit olduğunda günlük token sayısı. Cloud fiyatı USD olarak gelir,
 * TL'ye sabit kur ile çevrilir.
 */
export function breakEvenTokensPerDayTL(
  localMonthlyTL: number,
  pricePerMillionInUSD: number,
  pricePerMillionOutUSD: number,
  inOutRatio = 0.7,
): number {
  const effectivePerMillionTL =
    (pricePerMillionInUSD * inOutRatio +
      pricePerMillionOutUSD * (1 - inOutRatio)) *
    USD_TO_TRY;
  const monthlyTokens = (localMonthlyTL / effectivePerMillionTL) * 1_000_000;
  return Math.round(monthlyTokens / 30);
}
