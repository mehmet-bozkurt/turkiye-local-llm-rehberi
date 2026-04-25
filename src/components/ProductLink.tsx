import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductLinkProps {
  /** Görüntülenecek metin (ürün adı). */
  name: string;
  /** Resmi/referans URL. Undefined ise sadece düz metin render edilir. */
  url?: string;
  /** Dış ikon gösterilsin mi? Uzun başlıklarda kapatılabilir. */
  showIcon?: boolean;
  className?: string;
}

/**
 * Ürün ismini üreticinin resmi/referans sayfasına götüren küçük link bileşeni.
 * url yoksa link göstermez; böylece aynı JSX her iki durumu da karşılayabilir.
 */
export function ProductLink({
  name,
  url,
  showIcon = true,
  className,
}: ProductLinkProps) {
  if (!url) {
    return <span className={className}>{name}</span>;
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(
        "inline-flex items-center gap-1 decoration-dotted underline-offset-4 hover:text-primary hover:underline",
        className,
      )}
      title={`${name} — resmi sayfayı yeni sekmede aç`}
    >
      <span>{name}</span>
      {showIcon && (
        <ExternalLink className="h-3 w-3 shrink-0 opacity-60" aria-hidden />
      )}
    </a>
  );
}
