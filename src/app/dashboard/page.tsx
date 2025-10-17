
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  BarChartBig,
  User,
  Calendar,
  Boxes,
  HeartPulse,
  MessageSquareQuote,
  Mic,
} from 'lucide-react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  href: string;
  Icon: LucideIcon;
}

function FeatureCard({ title, description, href, Icon }: FeatureCardProps) {
  return (
    <Link href={href}>
      <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1 bg-accent/20 hover:bg-accent/30 border-accent/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-headline text-lg font-medium text-accent-foreground/90">
            {title}
          </CardTitle>
          <Icon className="h-6 w-6 text-accent-foreground/80" />
        </CardHeader>
        <CardContent>
          <CardDescription className="text-accent-foreground/70">{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function DashboardPage() {
  const features: FeatureCardProps[] = [
    {
      title: 'Analytics',
      description: 'View operational data and key metrics.',
      href: '/dashboard/analytics',
      Icon: BarChartBig,
    },
    {
      title: 'Patient Management',
      description: 'Register, view, and manage patient records.',
      href: '/dashboard/patients',
      Icon: User,
    },
    {
      title: 'Appointments',
      description: 'Schedule and track patient appointments.',
      href: '/dashboard/appointments',
      Icon: Calendar,
    },
    {
      title: 'Inventory',
      description: 'Manage medical supplies and stock levels.',
      href: '/dashboard/inventory',
      Icon: Boxes,
    },
     {
      title: 'Symptom Evaluator',
      description: 'AI-powered tool to assess patient symptoms.',
      href: '/dashboard/symptom-evaluator',
      Icon: HeartPulse,
    },
    {
      title: 'CareBot',
      description: 'AI assistant for FAQs and voice-based triage.',
      href: '/dashboard/faq-and-triage',
      Icon: MessageSquareQuote,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Welcome to ClinicOps
        </h1>
        <p className="text-muted-foreground">
          Your central hub for managing clinic operations efficiently.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </div>
  );
}
