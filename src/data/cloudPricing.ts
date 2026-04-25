import type { CloudProvider } from "@/types";

/**
 * Cloud API fiyatları (2026-Q1, USD / 1M token).
 *
 * Bu tablo yerel AI fizibilitesinin asıl karşısındaki tablodur:
 * 2024-2025 döngüsünde "frontier" fiyatları %70 düştü, "mini" modeller ise
 * yerel 70B kalitesini **tek haneli cent**'lerde sunar hale geldi. Yerel AI
 * kararı bu nedenle saf ekonomik gerekçeden **mahremiyet + öğrenme + bağımsızlık**
 * gerekçesine kaydı.
 *
 * Kaynaklar (Nisan 2026):
 * - openai.com/api/pricing
 * - anthropic.com/pricing
 * - ai.google.dev/pricing
 * - fireworks.ai/pricing
 * - together.ai/pricing
 * - platform.deepseek.com
 * - console.groq.com/pricing
 */
export const cloudProviders: CloudProvider[] = [
  {
    id: "openai",
    name: "OpenAI",
    url: "https://openai.com/api/pricing",
    models: [
      {
        name: "GPT-5",
        tier: "flagship",
        pricePerMillionIn: 1.25,
        pricePerMillionOut: 10,
        contextLength: 400_000,
      },
      {
        name: "GPT-5 mini",
        tier: "mid",
        pricePerMillionIn: 0.25,
        pricePerMillionOut: 2,
        contextLength: 400_000,
      },
      {
        name: "GPT-5 nano",
        tier: "mini",
        pricePerMillionIn: 0.05,
        pricePerMillionOut: 0.4,
        contextLength: 400_000,
      },
      {
        name: "GPT-4o",
        tier: "mid",
        pricePerMillionIn: 2.5,
        pricePerMillionOut: 10,
        contextLength: 128_000,
      },
    ],
  },
  {
    id: "anthropic",
    name: "Anthropic",
    url: "https://www.anthropic.com/pricing",
    models: [
      {
        name: "Claude Opus 4.5",
        tier: "flagship",
        pricePerMillionIn: 15,
        pricePerMillionOut: 75,
        contextLength: 200_000,
      },
      {
        name: "Claude Sonnet 4.5",
        tier: "mid",
        pricePerMillionIn: 3,
        pricePerMillionOut: 15,
        contextLength: 1_000_000,
      },
      {
        name: "Claude Haiku 4.5",
        tier: "mini",
        pricePerMillionIn: 1,
        pricePerMillionOut: 5,
        contextLength: 200_000,
      },
    ],
  },
  {
    id: "google",
    name: "Google Gemini",
    url: "https://ai.google.dev/pricing",
    models: [
      {
        name: "Gemini 2.5 Pro",
        tier: "flagship",
        pricePerMillionIn: 1.25,
        pricePerMillionOut: 10,
        contextLength: 2_000_000,
      },
      {
        name: "Gemini 2.5 Flash",
        tier: "mid",
        pricePerMillionIn: 0.3,
        pricePerMillionOut: 2.5,
        contextLength: 1_000_000,
      },
      {
        name: "Gemini 2.5 Flash-Lite",
        tier: "mini",
        pricePerMillionIn: 0.1,
        pricePerMillionOut: 0.4,
        contextLength: 1_000_000,
      },
    ],
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    url: "https://api-docs.deepseek.com/quick_start/pricing",
    models: [
      {
        name: "DeepSeek V3.1",
        tier: "flagship",
        pricePerMillionIn: 0.27,
        pricePerMillionOut: 1.1,
        contextLength: 128_000,
      },
      {
        name: "DeepSeek V3.1 (cache hit)",
        tier: "mid",
        pricePerMillionIn: 0.07,
        pricePerMillionOut: 1.1,
        contextLength: 128_000,
      },
    ],
  },
  {
    id: "groq",
    name: "Groq (ultra-hız inference)",
    url: "https://console.groq.com/pricing",
    models: [
      {
        name: "Llama 3.3 70B",
        tier: "flagship",
        pricePerMillionIn: 0.59,
        pricePerMillionOut: 0.79,
        contextLength: 128_000,
      },
      {
        name: "GPT-OSS 120B",
        tier: "flagship",
        pricePerMillionIn: 0.15,
        pricePerMillionOut: 0.75,
        contextLength: 128_000,
      },
      {
        name: "Qwen3 32B",
        tier: "mid",
        pricePerMillionIn: 0.29,
        pricePerMillionOut: 0.59,
        contextLength: 128_000,
      },
    ],
  },
  {
    id: "fireworks",
    name: "Fireworks AI",
    url: "https://fireworks.ai/pricing",
    models: [
      {
        name: "DeepSeek V3.1",
        tier: "flagship",
        pricePerMillionIn: 0.56,
        pricePerMillionOut: 1.68,
        contextLength: 128_000,
      },
      {
        name: "Qwen3 235B-A22B",
        tier: "flagship",
        pricePerMillionIn: 0.22,
        pricePerMillionOut: 0.88,
        contextLength: 128_000,
      },
      {
        name: "Llama 3.3 70B",
        tier: "mid",
        pricePerMillionIn: 0.9,
        pricePerMillionOut: 0.9,
        contextLength: 128_000,
      },
    ],
  },
  {
    id: "together",
    name: "Together AI",
    url: "https://www.together.ai/pricing",
    models: [
      {
        name: "DeepSeek V3.1",
        tier: "flagship",
        pricePerMillionIn: 0.6,
        pricePerMillionOut: 1.7,
        contextLength: 128_000,
      },
      {
        name: "Llama 3.3 70B",
        tier: "mid",
        pricePerMillionIn: 0.88,
        pricePerMillionOut: 0.88,
        contextLength: 128_000,
      },
      {
        name: "Qwen 2.5 72B",
        tier: "mid",
        pricePerMillionIn: 1.2,
        pricePerMillionOut: 1.2,
        contextLength: 128_000,
      },
    ],
  },
];

export const getCloudProviderById = (id: string) =>
  cloudProviders.find((p) => p.id === id);
