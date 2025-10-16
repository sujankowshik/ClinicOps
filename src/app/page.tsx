
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Logo } from '@/components/icons';
import { placeholderImages } from '@/lib/placeholder-images';

export default function LandingPage() {
  const heroImage = placeholderImages.find(p => p.id === 'landing-hero-night');

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <header className="absolute top-0 left-0 z-50 p-4 sm:p-6 lg:p-8">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-white" />
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
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
            <h1 className="font-headline text-6xl font-bold md:text-8xl" style={{fontFamily: "'serif'"}}>
              ClinicOps
            </h1>
            <p className="mt-4 text-lg text-white/90 md:text-xl">
              Built for Those Who Serve.
            </p>
            <Button size="lg" className="mt-8 bg-[#6A9983] hover:bg-[#5A8973] text-black rounded-full px-8" asChild>
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
