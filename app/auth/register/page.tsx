import RegisterForm from "@/components/auth/register-form";
import { Container } from "@/components/ui/container";

export default function RegisterPage() {
  return (
    <Container className="mt-12 md:mt-16">
      <RegisterForm />
    </Container>
  );
}
