import type { TooltipProps } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

/**
 * Recharts için koyu tema uyumlu özel tooltip.
 */
export function ChartTooltip({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-lg border border-border/70 bg-popover/95 px-3 py-2 text-xs shadow-xl backdrop-blur-sm">
      {label !== undefined && (
        <div className="mb-1 font-semibold text-foreground">{label}</div>
      )}
      <ul className="space-y-0.5">
        {payload.map((p, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: p.color ?? p.fill }}
            />
            <span className="text-muted-foreground">{p.name}:</span>
            <span className="font-mono text-foreground">
              {typeof p.value === "number"
                ? p.value.toLocaleString("tr-TR", {
                    maximumFractionDigits: 2,
                  })
                : String(p.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
