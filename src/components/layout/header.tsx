'use client';

import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { capitalize } from 'lodash';

export function Header() {
  const pathname = usePathname();

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
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm lg:h-[60px] lg:px-6">
      <SidebarTrigger className="md:hidden" />
      <h1 className="flex-1 font-headline text-xl font-semibold">
        {formattedTitle}
      </h1>
    </header>
  );
}
