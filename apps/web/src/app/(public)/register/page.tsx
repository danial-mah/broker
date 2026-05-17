import Link from 'next/link';
import { AuthForm } from '@/components/auth/auth-form';

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <div className="w-full">
        <AuthForm mode="register" />
        <p className="mt-5 text-center text-sm text-muted">
          Already registered? <Link href="/login" className="text-primary">Login</Link>
        </p>
      </div>
    </main>
  );
}
