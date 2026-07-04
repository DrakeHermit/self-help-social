import { Suspense } from "react";

import { MainContent } from "@/components/MainContent";
import { MobileNav } from "@/components/MobileNav";
import { NavBar } from "@/components/NavBar";
import { RightAside } from "@/components/RightAside";
import { SideBar } from "@/components/SideBar";
import { getCurrentUser } from "@/lib/user";

async function NavBarWithUser() {
  const user = await getCurrentUser();
  return <NavBar initials={user?.initials} />;
}

async function SideBarWithUser() {
  const user = await getCurrentUser();
  return (
    <SideBar
      name={user?.name}
      handle={user?.handle}
      initials={user?.initials}
    />
  );
}

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<NavBar />}>
        <NavBarWithUser />
      </Suspense>
      <div className="flex flex-1">
        <Suspense fallback={<SideBar />}>
          <SideBarWithUser />
        </Suspense>
        <MainContent>{children}</MainContent>
        <RightAside />
      </div>
      <MobileNav />
    </div>
  );
}
