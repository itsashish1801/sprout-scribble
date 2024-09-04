import LoginForm from "@/components/auth/login-form";
import { Container } from "@/components/ui/container";

export default function LoginPage() {
  return (
    <Container className="mt-12 md:mt-20">
      <LoginForm />
    </Container>
  );
}
