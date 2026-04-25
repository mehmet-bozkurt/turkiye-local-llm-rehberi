import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number, digits = 1): string {
  if (value >= 1000) {
    return (value / 1000).toFixed(digits) + "K";
  }
  return value.toFixed(digits);
}

export function formatUSD(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 10 ? 2 : 0,
  }).format(value);
}

export function formatTRY(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * USD → TRY dönüşüm oranı (TCMB satış kuru, 2026-Q2, ≈44.89 → 45 yuvarlandı).
 * Tüm global fiyatlar (cloud API, uluslararası ürün listeleri) bu sabitle TL'ye
 * çevrilir. Türkiye pazar fiyatı zaten TL girili olanlar için bu sabit kullanılmaz —
 * doğrudan `approxPriceTRY` okunur.
 */
export const USD_TO_TRY = 45;

export function usdToTry(usd: number): number {
  return usd * USD_TO_TRY;
}

/** Global USD tutarını TL olarak biçimlendir (ör. cloud API $0.27 → ₺12). */
export function formatUsdAsTRY(usd: number): string {
  const tl = usd * USD_TO_TRY;
  if (tl < 1) {
    return `${tl.toFixed(2)} ₺`;
  }
  if (tl < 100) {
    return `${tl.toFixed(1)} ₺`;
  }
  return formatTRY(tl);
}
