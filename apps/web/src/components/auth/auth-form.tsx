'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';

const schema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8)
});

type AuthFormValues = z.infer<typeof schema>;

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: mode === 'login' ? 'demo@broker.dev' : '', password: mode === 'login' ? 'Password123!' : '' }
  });

  async function onSubmit(values: AuthFormValues) {
    const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
    const payload = mode === 'login' ? { email: values.email, password: values.password } : values;
    const { data } = await api.post(endpoint, payload);
    setSession(data);
    router.push('/dashboard');
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <h1 className="mb-2 text-2xl font-semibold">{mode === 'login' ? 'Login' : 'Create account'}</h1>
      <p className="mb-6 text-sm text-slate-400">Secure access to the trading workspace.</p>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {mode === 'register' && <Input placeholder="Name" {...form.register('name')} />}
        <Input placeholder="Email" type="email" {...form.register('email')} />
        <Input placeholder="Password" type="password" {...form.register('password')} />
        <Button className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
        </Button>
      </form>
    </Card>
  );
}
