import { AuthTemplate } from "@/components/templates";
import { ResendEmailConfirmationForm } from "@/components/organisms";

export const metadata = {
  title: "Resend Email Verification | NexusIAM",
  description: "Resend the verification email to your email address",
};

export default function ResendEmailVerificationPage() {
  return (
    <AuthTemplate title="Resend Email Verification" subtitle="Resend the verification email to your email address">
      <ResendEmailConfirmationForm />
    </AuthTemplate>
  );
}
