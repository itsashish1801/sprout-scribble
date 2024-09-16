import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import SettingsCard from "@/app/dashboard/settings/settings-card";
import { Container } from "@/components/ui/container";

export default async function SettingsPage() {
  const session = await auth();

  if (!session) return redirect("/auth/login");

  return (
    <Container className="mt-12 md:mt-16">
      <SettingsCard session={session} />
    </Container>
  );
}
