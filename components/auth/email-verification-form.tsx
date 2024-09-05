"use client";

import { verifyEmailToken } from "@/server/actions/tokens";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import AuthCard from "@/components/auth/auth-card";
import FormSuccess from "@/components/auth/form-success";
import FormError from "@/components/auth/form-error";

export default function EmailVerificationForm() {
  const token = useSearchParams().get("token");
  const router = useRouter();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleVerification = useCallback(async () => {
    if (success || error) return;

    if (!token) {
      setError("No token provided");
      return;
    }

    const data = await verifyEmailToken(token);

    if (data.error) setError(data.error);

    if (data.success) {
      setSuccess(data.success);
      router.push("/auth/login");
    }
  }, [error, router, success, token]);

  useEffect(() => {
    handleVerification();
  }, [handleVerification]);

  return (
    <AuthCard
      cardTitle="Email verification"
      cardDescription="Verify your email"
      backButtonHref="/auth/login"
      backButtonLabel="Login"
      backButtonText="Already have an account?"
      showSocials={false}
    >
      <div className="flex items-center justify-center w-full">
        <p>{!success && !error ? "Verifying email..." : null}</p>
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </AuthCard>
  );
}
