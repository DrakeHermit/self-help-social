import Link from "next/link";
import { CalendarHeart, Flame, Users } from "lucide-react";

const HIGHLIGHTS = [
  {
    icon: CalendarHeart,
    title: "Gentle daily check-ins",
    description: "Log the small things you do for yourself, no pressure.",
  },
  {
    icon: Users,
    title: "Accountability partners",
    description: "Show up alongside people working on the same habits.",
  },
  {
    icon: Flame,
    title: "Streaks worth keeping",
    description: "Celebrate consistency instead of chasing perfection.",
  },
];

const BrandMark = ({ className }: { className?: string }) => (
  <span className={className}>
    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#3a2e25] text-lg font-semibold lowercase text-primary ring-1 ring-white/10">
      h
    </span>
    <span className="flex flex-col leading-tight">
      <span className="text-lg font-semibold lowercase tracking-tight text-[#f5ece0]">
        hearth
      </span>
      <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#9a8a78]">
        Self help, together
      </span>
    </span>
  </span>
);

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden flex-col justify-center overflow-hidden bg-gradient-to-br from-[#2a221b] via-[#33271e] to-[#1f1814] p-10 text-[#f1e7d9] lg:flex xl:p-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-highlight/20 blur-3xl"
        />

        <div className="relative z-10 mx-auto flex w-full max-w-md flex-col gap-12">
          <Link
            href="/"
            aria-label="hearth home"
            className="flex w-fit items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          >
            <BrandMark className="flex items-center gap-3" />
          </Link>

          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold leading-snug text-[#f7efe4] xl:text-4xl">
                Small steps, kept together.
              </h1>
              <p className="text-[15px] leading-relaxed text-[#c9b9a6]">
                Track the little things you do for yourself, and show up for the
                people doing the same.
              </p>
            </div>

            <ul className="space-y-5">
            {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-primary ring-1 ring-white/10">
                  <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                </span>
                <span className="space-y-0.5">
                  <span className="block text-sm font-medium text-[#f5ece0]">
                    {title}
                  </span>
                  <span className="block text-sm text-[#a7967f]">
                    {description}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

          <p className="text-xs text-[#8a7b69]">
            A quieter kind of social. Built for showing up.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-background px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            aria-label="hearth home"
            className="mb-10 flex w-fit items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary/70 lg:hidden"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-foreground text-lg font-semibold lowercase text-background">
              h
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-lg font-semibold lowercase tracking-tight text-foreground">
                hearth
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Self help, together
              </span>
            </span>
          </Link>

          {children}
        </div>
      </div>
    </div>
  );
}
