# LocalAI Fizibilite Dashboard

Yerel bir bilgisayarda yapay zeka (LLM ve multimodal modeller) çalıştırmanın mantıklı olup olmadığına karar vermek, en iyi yöntemi analiz etmek ve bu analizi interaktif bir dashboard üzerinden görselleştirmek için hazırlanmış kişisel bir araştırma aracı.

## Ne sunar?

9 bölümden oluşan tek sayfalık bir dashboard:

1. **Giriş & TL;DR** — hızlı özet + "mantıklı / duruma göre / mantıksız" kararı.
2. **Problem Tanımı** — yerel AI'ın avantaj ve dezavantajları.
3. **Donanım** — RAM/VRAM formülü, tüketici ve workstation profilleri.
4. **Modeller** — Llama 3.x, Qwen 2.5, DeepSeek-R1, Phi-4, Gemma 3, Mistral Nemo. VRAM ve tokens/s grafikleri.
5. **Runtimes** — Ollama, llama.cpp, LM Studio, vLLM, MLX, Jan, TGI — radar grafiği + seçim rehberi.
6. **Senaryolar** — chat, kod, RAG, özetleme, vision için somut donanım + model + runtime önerileri.
7. **Maliyet** — yerel (amortisman + elektrik) vs cloud (OpenAI, Anthropic, Groq, Together) TCO karşılaştırması. İnteraktif slider'lar.
8. **Fizibilite Matrisi** — donanım × senaryo heatmap, 0-100 skor.
9. **Sonuç** — 4 soruluk karar ağacı + kişisel tavsiye.

## Teknoloji

- **Vite 5 + React 18 + TypeScript 5** — saf client-side SPA
- **Tailwind CSS** + shadcn-style UI primitives (Radix)
- **Recharts** — bar, radar, scatter, line grafikleri
- **Framer Motion** — section geçişleri
- **react-markdown + remark-gfm** — araştırma notları

## Geliştirme

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ static output
npm run preview  # dist/ önizleme
```

## Dizin Yapısı

```
src/
├── data/             # modeller, donanım, runtime, senaryo, cloud fiyat, fizibilite matrisi
├── lib/calc.ts       # VRAM tahmini, TCO, break-even, fizibilite skoru (saf fonksiyonlar)
├── components/
│   ├── ui/           # shadcn-style primitives (card, button, badge, tabs, tooltip)
│   ├── charts/       # Recharts sarmalayıcıları
│   └── sections/     # 9 bölümün içerikli React bileşenleri
├── types/            # paylaşılan TypeScript tipleri
└── styles/globals.css
```

## Veri güncelleme

Yeni bir model / donanım / runtime eklemek istersen:

1. İlgili `src/data/*.ts` dosyasına yeni obje ekle.
2. Fizibilite skorunu güncellemek istersen `src/data/feasibilityMatrix.ts`'e hücreler ekle.
3. `memory-bank/activeContext.md` ve `memory-bank/progress.md`'yi güncelle.

UI otomatik türer — hiçbir component dosyası değişmesine gerek yoktur.

## Memory Bank

`memory-bank/` altında 6 dosya (projectbrief, productContext, systemPatterns, techContext, activeContext, progress) proje hafızasını tutar. Her önemli değişiklikten sonra güncellenmesi beklenir.

## Notlar

- Tüm veriler topluluk kaynaklı ve yaklaşıktır; resmi benchmark değildir.
- Hover efektlerinde `transform: translateY/X` **kullanılmaz** (proje kuralı); yalnızca `scale`, `shadow`, `opacity`, `color`.
- Dil: Türkçe içerik, teknik terimler (VRAM, token, quantization) orijinal.

## Lisans

Kişisel araştırma; istediğin gibi fork'la ve uyarla.
