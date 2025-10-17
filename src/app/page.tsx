
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Logo } from '@/components/icons';
import { placeholderImages } from '@/lib/placeholder-images';

export default function LandingPage() {
  const heroImage = placeholderImages.find(p => p.id === 'landing-hero-night');

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <header className="absolute top-0 left-0 z-50 flex items-center gap-2 p-4 sm:p-6 lg:p-8">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-white" />
          <span className="font-headline text-xl font-bold text-white">ClinicOps</span>
        </Link>
      </header>

      <main className="flex-grow">
        <section className="relative h-screen w-full">
          {heroImage && (
             <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
            <h1 className="font-headline text-6xl font-bold md:text-8xl">
              ClinicOps
            </h1>
            <p className="mt-4 text-lg text-white/90 md:text-xl">
              Built for Those Who Serve.
            </p>
            <div className="mt-8 flex gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 transition-transform duration-300 hover:scale-105" asChild>
                <Link href="/login">Login</Link>
              </Button>
               <Button size="lg" variant="outline" className="bg-transparent hover:bg-white/10 text-white rounded-full px-8 border-white transition-transform duration-300 hover:scale-105" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
