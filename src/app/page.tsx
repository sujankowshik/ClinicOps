
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Logo } from '@/components/icons';
import { placeholderImages } from '@/lib/placeholder-images';

export default function LandingPage() {
  const heroImage = placeholderImages.find(p => p.id === 'landing-hero');

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-background/80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <span className="font-headline text-xl font-semibold text-white">
            ClinicOps
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow">
        <section className="relative h-[calc(100vh-4rem)] w-full">
          {heroImage && (
             <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
            <h1 className="font-headline text-5xl font-bold md:text-7xl">
              ClinicOps
            </h1>
            <p className="mt-4 text-lg text-white/80 md:text-xl">
              Built for Those Who Serve.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
