import { AuthTemplate } from '@/components/templates';
import { EmailConfirmationForm } from '@/components/organisms';

export const metadata = {
  title: 'Email Confirmation | NexusIAM',
  description: 'Confirm your email address to activate your account',
};

export default function EmailConfirmationPage() {
  return (
    <AuthTemplate 
      title="Confirm Your Email" 
      subtitle="Enter the confirmation code sent to your email address"
    >
      <EmailConfirmationForm />
    </AuthTemplate>
  );
}
