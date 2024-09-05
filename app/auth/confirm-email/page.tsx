import EmailVerificationForm from "@/components/auth/email-verification-form";
import { Container } from "@/components/ui/container";

export default function ConfirmEmailPage() {
  return (
    <Container className="mt-12 md:mt-16">
      <EmailVerificationForm />
    </Container>
  );
}
