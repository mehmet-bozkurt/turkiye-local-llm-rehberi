import { cn } from "@/lib/utils";
import { hardwareProfiles } from "@/data/hardware";
import { useCases } from "@/data/useCases";
import { feasibilityMatrix } from "@/data/feasibilityMatrix";
import { getModelById } from "@/data/models";
import { getRuntimeById } from "@/data/runtimes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function scoreToClasses(score: number) {
  if (score >= 80)
    return "bg-emerald-500/25 text-emerald-200 border-emerald-500/40";
  if (score >= 60) return "bg-sky-500/25 text-sky-200 border-sky-500/40";
  if (score >= 40)
    return "bg-amber-500/25 text-amber-200 border-amber-500/40";
  return "bg-rose-500/25 text-rose-200 border-rose-500/40";
}

function verdictLabel(v: string) {
  switch (v) {
    case "excellent":
      return "Mükemmel";
    case "good":
      return "İyi";
    case "marginal":
      return "Sınırda";
    default:
      return "Önerilmez";
  }
}

export function FeasibilityHeatmap() {
  return (
    <TooltipProvider delayDuration={150}>
      <div className="overflow-x-auto rounded-xl border border-border/60 bg-card/40 p-2">
        <table className="w-full min-w-[720px] border-separate border-spacing-1">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-card/60 p-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Donanım / Senaryo
              </th>
              {useCases.map((uc) => (
                <th
                  key={uc.id}
                  scope="col"
                  className="p-2 text-center text-xs font-semibold text-muted-foreground"
                >
                  {uc.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hardwareProfiles.map((hw) => (
              <tr key={hw.id}>
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-card/60 p-2 text-left align-middle text-xs font-medium"
                >
                  {hw.name}
                </th>
                {useCases.map((uc) => {
                  const cell = feasibilityMatrix.find(
                    (c) => c.hardwareId === hw.id && c.useCaseId === uc.id
                  );
                  if (!cell) {
                    return (
                      <td
                        key={uc.id}
                        className="h-16 rounded-lg border border-border/30 bg-secondary/20 text-center text-xs text-muted-foreground"
                      >
                        —
                      </td>
                    );
                  }
                  const model = cell.recommendedModel
                    ? getModelById(cell.recommendedModel)
                    : null;
                  const runtime = cell.recommendedRuntime
                    ? getRuntimeById(cell.recommendedRuntime)
                    : null;
                  return (
                    <td key={uc.id} className="p-0">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            aria-label={`${hw.name}, ${uc.name}: skor ${cell.score}, ${verdictLabel(cell.verdict)}`}
                            className={cn(
                              "flex h-16 w-full flex-col items-center justify-center gap-0.5 rounded-lg border text-xs font-medium transition-colors",
                              "hover:scale-[1.02]",
                              scoreToClasses(cell.score)
                            )}
                          >
                            <span className="text-base font-bold">
                              {cell.score}
                            </span>
                            <span className="text-[10px] opacity-80">
                              {verdictLabel(cell.verdict)}
                            </span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <div className="mb-1 font-semibold">
                            {hw.name} × {uc.name}
                          </div>
                          {model && (
                            <div>
                              Model: <span className="font-mono">{model.name}</span>
                            </div>
                          )}
                          {runtime && (
                            <div>
                              Runtime: <span className="font-mono">{runtime.name}</span>
                            </div>
                          )}
                          {cell.notes && (
                            <div className="mt-1 opacity-80">{cell.notes}</div>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-3 flex flex-wrap items-center gap-3 px-2 pb-2 text-[11px] text-muted-foreground">
          <span>Skor:</span>
          <Legend dotClass="bg-emerald-500/70" label="≥80 Mükemmel" />
          <Legend dotClass="bg-sky-500/70" label="60-79 İyi" />
          <Legend dotClass="bg-amber-500/70" label="40-59 Sınırda" />
          <Legend dotClass="bg-rose-500/70" label="<40 Önerilmez" />
        </div>
      </div>
    </TooltipProvider>
  );
}

function Legend({ dotClass, label }: { dotClass: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("h-2.5 w-2.5 rounded-full", dotClass)} />
      {label}
    </span>
  );
}
