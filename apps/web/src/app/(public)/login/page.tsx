import Link from 'next/link';
import { AuthForm } from '@/components/auth/auth-form';

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <div className="w-full">
        <AuthForm mode="login" />
        <p className="mt-5 text-center text-sm text-slate-400">
          New here? <Link href="/register" className="text-primary">Create an account</Link>
        </p>
      </div>
    </main>
  );
}
