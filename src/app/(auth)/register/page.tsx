import { AuthTemplate } from '@/components/templates';
import { RegisterForm } from '@/components/organisms';

export const metadata = {
  title: 'Register | NexusIAM',
  description: 'Create a new NexusIAM account',
};

export default function RegisterPage() {
  return (
    <AuthTemplate 
      title="Create Account" 
      subtitle="Join NexusIAM and start managing your resources"
    >
      <RegisterForm />
    </AuthTemplate>
  );
}
