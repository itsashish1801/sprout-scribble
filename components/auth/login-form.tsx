import AuthCard from "@/components/auth/auth-card";

export default function LoginForm() {
  return (
    <AuthCard
      cardTitle="Login"
      cardDescription="Enter your email below to login to your account"
      backButtonHref="/"
      backButtonText="Don't have an account?"
      backButtonLabel="Sign up"
    >
      <div></div>
    </AuthCard>
  );
}
