'use client';

import { usePathname } from 'next/navigation';
import { capitalize } from 'lodash';
import { Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Logo } from '../icons';

export function Header() {
  const pathname = usePathname();

  const isDashboardHome = pathname === '/dashboard';

  // Generate a title from the pathname
  const title =
    pathname
      .split('/')
      .pop()
      ?.replace(/-/g, ' ') ?? 'Dashboard';

  const formattedTitle = title
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
       <Link href="/dashboard" className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <span className="font-headline text-xl font-semibold hidden sm:inline">
            ClinicOps
          </span>
        </Link>
      
      <div className="flex-1">
        {!isDashboardHome && (
            <h1 className="flex-1 font-headline text-xl font-semibold text-center">
                {formattedTitle}
            </h1>
        )}
      </div>

      {!isDashboardHome && (
        <Button variant="ghost" asChild>
            <Link href="/dashboard" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
            </Link>
        </Button>
      )}
    </header>
  );
}
