import { AuthTemplate } from "@/components/templates";
import { LoginForm } from "@/components/organisms";

export const metadata = {
  title: "Login | NexusIAM",
  description: "Sign in to your NexusIAM account",
};

export default function LoginPage() {
  return (
    <AuthTemplate title="Welcome Back" subtitle="Enter your credentials to access your dashboard(contact via locnguyen071102@gmail.com) for demo account">
      <LoginForm />
    </AuthTemplate>
  );
}
