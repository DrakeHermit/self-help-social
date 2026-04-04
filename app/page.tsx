import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 w-full flex flex-col gap-20 p-10">
        <ThemeSwitcher />
      </div>
    </main>
  );
}
