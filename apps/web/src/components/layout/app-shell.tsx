'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart3, LayoutDashboard, LogOut, Settings, Shield, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth-store';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/markets', label: 'Markets', icon: BarChart3 },
  { href: '/portfolio', label: 'Portfolio', icon: Wallet },
  { href: '/settings', label: 'Settings', icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-r border-border bg-slate-950/70 p-5">
        <Link href="/dashboard" className="mb-8 flex items-center gap-3 text-xl font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-slate-950">B</span>
          Broker
        </Link>
        <nav className="space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                  pathname.startsWith(item.href) ? 'bg-panel text-primary' : 'text-slate-400 hover:bg-panel'
                }`}
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
          {user?.role === 'ADMIN' && (
            <Link href="/admin" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-400 hover:bg-panel">
              <Shield size={17} />
              Admin
            </Link>
          )}
        </nav>
      </aside>
      <main className="p-5 lg:p-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Paper trading workspace</p>
            <h1 className="text-2xl font-semibold text-white">Welcome back{user?.email ? `, ${user.email}` : ''}</h1>
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              logout();
              router.push('/login');
            }}
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </header>
        {children}
      </main>
    </div>
  );
}
