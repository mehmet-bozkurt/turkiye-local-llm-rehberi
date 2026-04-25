import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-8 max-w-3xl", className)}>
      {eyebrow && (
        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
          {eyebrow}
        </div>
      )}
      <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
        <span className="section-gradient-text">{title}</span>
      </h2>
      {description && (
        <p className="mt-3 text-base text-muted-foreground text-balance">
          {description}
        </p>
      )}
    </div>
  );
}
