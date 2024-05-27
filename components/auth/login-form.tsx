"use client";

import AuthCard from "./auth-card";

const LoginForm = () => {
  return (
    <AuthCard
      cardTitle="Welcome back!"
      backButtonHref="/auth/register"
      backButtonLabel="Create a new account"
      showSocials
    >
      <p>Log in to your account</p>
    </AuthCard>
  );
};

export default LoginForm;
