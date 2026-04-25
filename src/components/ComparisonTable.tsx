import { cn } from "@/lib/utils";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
}

interface ComparisonTableProps<T> {
  columns: Column<T>[];
  data: T[];
  caption?: string;
  getRowKey: (row: T) => string;
  dense?: boolean;
}

export function ComparisonTable<T>({
  columns,
  data,
  caption,
  getRowKey,
  dense = false,
}: ComparisonTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border/60 bg-card/40">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        {caption && (
          <caption className="sr-only">{caption}</caption>
        )}
        <thead>
          <tr className="border-b border-border/60 bg-secondary/30">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                scope="col"
                className={cn(
                  "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                  col.align === "right" && "text-right",
                  col.align === "center" && "text-center",
                  col.className
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={getRowKey(row)}
              className="border-b border-border/40 transition-colors last:border-0 hover:bg-secondary/20"
            >
              {columns.map((col) => {
                const value = col.render
                  ? col.render(row)
                  : (row as Record<string, unknown>)[String(col.key)];
                return (
                  <td
                    key={String(col.key)}
                    className={cn(
                      dense ? "px-3 py-2" : "px-4 py-3",
                      col.align === "right" && "text-right tabular-nums",
                      col.align === "center" && "text-center",
                      col.className
                    )}
                  >
                    {value as React.ReactNode}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
