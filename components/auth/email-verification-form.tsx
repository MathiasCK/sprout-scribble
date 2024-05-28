"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { verifyEmailVerificationToken } from "~/server/actions";
import { AuthCard, FormError, FormSuccess } from "~/components/auth";

const EmailVerificationForm = () => {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const token = useSearchParams().get("token");
  const router = useRouter();

  const handleVerification = useCallback(async () => {
    if (success || error) return;

    if (!token) {
      setError("No token found");
      return;
    }

    verifyEmailVerificationToken(token).then(({ success, error }) => {
      if (error) {
        setError(error);
        return;
      }
      if (success) {
        setSuccess(success);
        router.push("/auth/login");
      }
    });
  }, [error, router, success, token]);

  useEffect(() => {
    handleVerification();
  }, [handleVerification]);

  return (
    <AuthCard
      cardTitle="Verify your account"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center flex-col w-full justify-center">
        <p>{!success && !error && "Verifying email..."}</p>
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </AuthCard>
  );
};

export default EmailVerificationForm;
