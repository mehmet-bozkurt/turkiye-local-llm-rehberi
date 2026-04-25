import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface NavItem {
  id: string;
  label: string;
  number: string;
}

interface SideNavProps {
  items: NavItem[];
}

export function SideNav({ items }: SideNavProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-30% 0px -60% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="Bölüm navigasyonu"
      className="sticky top-8 hidden h-[calc(100vh-4rem)] w-60 shrink-0 flex-col gap-1 overflow-y-auto pr-2 lg:flex"
    >
      <div className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        İçindekiler
      </div>
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={cn(
              "group flex items-start gap-3 rounded-lg border border-transparent px-3 py-2 text-sm transition-colors",
              "hover:border-border/60 hover:bg-secondary/40 hover:text-foreground",
              isActive
                ? "border-primary/30 bg-primary/10 text-primary"
                : "text-muted-foreground"
            )}
          >
            <span
              className={cn(
                "mt-0.5 inline-flex h-5 w-8 shrink-0 items-center justify-center rounded-md text-[10px] font-mono font-semibold",
                isActive
                  ? "bg-primary/20 text-primary"
                  : "bg-secondary/60 text-muted-foreground group-hover:bg-secondary"
              )}
            >
              {item.number}
            </span>
            <span className="text-balance leading-tight">{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
