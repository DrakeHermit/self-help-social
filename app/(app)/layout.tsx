import { MainContent } from "@/components/MainContent";
import { MobileNav } from "@/components/MobileNav";
import { NavBar } from "@/components/NavBar";
import { RightAside } from "@/components/RightAside";
import { SideBar } from "@/components/SideBar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <div className="flex flex-1">
        <SideBar />
        <MainContent>{children}</MainContent>
        <RightAside />
      </div>
      <MobileNav />
    </div>
  );
}
