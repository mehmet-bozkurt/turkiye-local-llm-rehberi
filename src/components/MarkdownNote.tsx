import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Lightbulb, Info, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type NoteTone = "insight" | "info" | "warning";

interface MarkdownNoteProps {
  tone?: NoteTone;
  title?: string;
  children: string;
}

const toneConfig: Record<
  NoteTone,
  { icon: typeof Info; container: string; iconWrap: string }
> = {
  insight: {
    icon: Lightbulb,
    container: "border-amber-500/30 bg-amber-500/5",
    iconWrap: "bg-amber-500/15 text-amber-400",
  },
  info: {
    icon: Info,
    container: "border-primary/30 bg-primary/5",
    iconWrap: "bg-primary/15 text-primary",
  },
  warning: {
    icon: TriangleAlert,
    container: "border-rose-500/30 bg-rose-500/5",
    iconWrap: "bg-rose-500/15 text-rose-400",
  },
};

export function MarkdownNote({
  tone = "info",
  title,
  children,
}: MarkdownNoteProps) {
  const cfg = toneConfig[tone];
  const Icon = cfg.icon;
  return (
    <aside
      className={cn(
        "my-6 flex gap-3 rounded-xl border p-4 text-sm leading-relaxed",
        cfg.container
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          cfg.iconWrap
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        {title && <div className="mb-1 font-semibold">{title}</div>}
        <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-a:text-primary dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
        </div>
      </div>
    </aside>
  );
}
