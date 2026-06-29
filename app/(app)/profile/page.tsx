import { notFound } from "next/navigation";

import { ProfileView } from "@/components/profile/ProfileView";
import { FEATURES } from "@/lib/flags";

export default function ProfilePage() {
  if (!FEATURES.garden) {
    notFound();
  }

  const user = {
    name: "You",
    handle: "you",
    joinedLabel: "here since jan 2026",
    initials: "YO",
    bio: "trying to read more, scroll less. one small thing a day.",
  };

  return <ProfileView user={user} />;
}
