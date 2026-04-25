import type { ReactNode } from "react";
import { Cpu, Github } from "lucide-react";
import { SideNav, type NavItem } from "./SideNav";
import { ThemeToggle } from "./ThemeToggle";

interface LayoutProps {
  children: ReactNode;
  navItems: NavItem[];
}

export function Layout({ children, navItems }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <Cpu className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight">
                LocalAI
              </span>
              <span className="text-[10px] text-muted-foreground">
                Fizibilite Dashboard
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground sm:gap-3">
            <span className="hidden font-mono sm:inline">v0.1 · 2026-Q1</span>
            <ThemeToggle />
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hidden h-8 w-8 items-center justify-center rounded-md hover:bg-secondary/60 hover:text-foreground sm:inline-flex"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <SideNav items={navItems} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>

      <footer className="border-t border-border/60 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
          Bu dashboard kişisel bir araştırma aracıdır. Model ve donanım verileri
          topluluk kaynaklı ve yaklaşıktır; resmi benchmark değildir.
        </div>
      </footer>
    </div>
  );
}
