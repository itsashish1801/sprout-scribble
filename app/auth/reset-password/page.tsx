import ResetPasswordForm from "@/components/auth/reset-password-form";
import { Container } from "@/components/ui/container";

export default function ResetPassword() {
  return (
    <Container className="mt-12 md:mt-16">
      <ResetPasswordForm />
    </Container>
  );
}
