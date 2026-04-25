# System Patterns

## Mimari
Saf bir **SPA (Single Page Application)**. Tüm veri client tarafında, derleme zamanında bundle'a gömülü. Sunucu yok.

```
[ data/*.ts ] --> [ lib/calc.ts ] --> [ components/charts/* ]
                                    \--> [ components/sections/* ]
                                              |
                                         [ Layout + SideNav ]
```

## Ana Prensipler
1. **Veri tek kaynak**: Tüm model/donanım/runtime parametreleri `src/data/` altında. UI asla string literal "Llama 3.1" yazmaz, her zaman `models.find(m => m.id === 'llama-3.1-8b')` üzerinden geçer.
2. **Pure function hesaplamalar**: `lib/calc.ts` — VRAM tahmini, TCO, fizibilite skoru saf fonksiyonlardır. Test edilebilir, memoize edilebilir.
3. **Composition over configuration**: Her section kendi bölümünü çizen küçük bir React bileşenidir; layout onları sırayla render eder.
4. **Scroll-spy navigasyon**: `IntersectionObserver` ile aktif bölüm tespiti; SideNav bu state'i dinler.
5. **Erişilebilirlik fallback'i**: Her chart, `<ComparisonTable>` ile eşleşir veya `aria-label` + `role="img"` taşır.

## Component Türleri
- **Layout bileşenleri**: `Layout`, `SideNav`, `SectionHeader`, `StatCard`.
- **Görsel bileşenler**: `charts/` altında Recharts sarmalayıcıları.
- **Section bileşenleri**: `sections/` altında 00-08 numaralı içerik bloklar.
- **Primitive UI**: `ui/` altında shadcn stili (card, button, badge, tabs, tooltip).

## Stil Sistemi
- **Tailwind + CSS değişkenleri** (`hsl(var(--...))`).
- **Koyu tema varsayılan**, `html class="dark"`.
- **Renk paleti**: primary=cyan (199° 89% 54%), accent=mor (263° 70% 60%), chart-1..5 çeşitli.
- **Hover kuralı**: `transform: translateY/X` yasak. Sadece `scale`, `shadow`, `opacity`, `border-color`, `bg-color`.

## Animasyon
- `framer-motion` ile sadece bölüm girişlerinde `fade + scale` (translate değil, user rule uyumlu).
- Chart animasyonları Recharts'ın varsayılanı.

## Dosya Adlandırma
- React bileşenleri: `PascalCase.tsx`.
- Data dosyaları: `camelCase.ts`.
- Section'lar: `00-Intro.tsx` formatında, sıralı okunabilirlik için rakam prefix.
