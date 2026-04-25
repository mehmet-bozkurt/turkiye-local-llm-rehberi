import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

/**
 * Aydınlık/karanlık tema geçiş butonu.
 * Kullanıcının sistemsel tercihine saygı duyar (ThemeProvider ele alır),
 * manuel seçim localStorage'a yazılır.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        isDark ? "Aydınlık temaya geç" : "Karanlık temaya geç"
      }
      title={isDark ? "Aydınlık tema" : "Karanlık tema"}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors",
        "hover:border-border/60 hover:bg-secondary/60 hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
