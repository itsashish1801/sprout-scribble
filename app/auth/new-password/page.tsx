import NewPasswordForm from "@/components/auth/new-password-form";
import { Container } from "@/components/ui/container";

export default function NewPassword() {
  return (
    <Container className="mt-12 md:mt-16">
      <NewPasswordForm />;
    </Container>
  );
}
