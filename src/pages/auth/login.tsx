// Login.tsx
import React from "react";
import LoginForm from "./components/login-form";
import AuthUiLayout from "@/components/ui/AuthUiLayout";

const Login: React.FC = () => {
  return (
    <AuthUiLayout
      title="Sign in"
      subtitle="Sign in to your account to start using ArrowX"
      footerText="Don't have an account?"
      footerLink="/register"
      footerLinkText="Sign up"
    >
      <LoginForm />
    </AuthUiLayout>
  );
};

export default Login;
