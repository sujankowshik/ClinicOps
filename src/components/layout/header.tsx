'use client';

import { usePathname, useRouter } from 'next/navigation';
import { capitalize } from 'lodash';
import { Home, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Logo } from '../icons';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export function Header() {
  const pathname = usePathname();
  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

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
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="flex items-center gap-2">
        <Link href="/dashboard">
          <Logo className="h-8 w-8 text-primary" />
          <span className="sr-only">ClinicOps</span>
        </Link>
      </div>

      <div className="flex-1">
        <h1 className="flex-1 font-headline text-xl font-semibold md:text-2xl">
          {formattedTitle}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`}
                    alt={user.displayName || 'User'}
                    data-ai-hint="person portrait"
                  />
                  <AvatarFallback>
                    {user.displayName?.charAt(0) || user.email?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.displayName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
