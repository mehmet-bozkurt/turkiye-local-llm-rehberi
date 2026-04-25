import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  hint?: string;
  icon?: LucideIcon;
  tone?: "primary" | "accent" | "success" | "warning" | "danger";
}

const toneMap: Record<NonNullable<StatCardProps["tone"]>, string> = {
  primary: "text-primary",
  accent: "text-accent",
  success: "text-emerald-400",
  warning: "text-amber-400",
  danger: "text-rose-400",
};

export function StatCard({
  label,
  value,
  unit,
  hint,
  icon: Icon,
  tone = "primary",
}: StatCardProps) {
  return (
    <Card className="card-hover">
      <CardContent className="flex flex-col gap-2 p-5">
        <div className="flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground">
          <span>{label}</span>
          {Icon && <Icon className={cn("h-4 w-4", toneMap[tone])} />}
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className={cn("text-3xl font-bold", toneMap[tone])}>
            {value}
          </span>
          {unit && (
            <span className="text-sm text-muted-foreground">{unit}</span>
          )}
        </div>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}
