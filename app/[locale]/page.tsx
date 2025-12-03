import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { VolunteerForm } from '@/components/forms/VolunteerForm';
import { PhoenixChat } from '@/components/chat/PhoenixChat';

export default function Home() {
  const t = useTranslations('common');
  const th = useTranslations('hero');

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section with Glassmorphism */}
        <section className="relative overflow-hidden py-16 md:py-24">
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-teal-50">
            {/* Floating Gradient Orbs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
          </div>

          {/* Glass Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="container relative mx-auto px-4">
            <div className="mx-auto max-w-5xl">
              {/* Program Logo */}
              <div className="flex justify-center mb-6">
                <div className="relative h-32 w-64 md:h-48 md:w-96">
                  <Image
                    src="/images/1 million logo-01.png"
                    alt="One Million Volunteers"
                    fill
                    sizes="(max-width: 768px) 256px, 384px"
                    className="object-contain drop-shadow-2xl"
                    priority
                    quality={100}
                  />
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 text-sm font-medium text-primary backdrop-blur-sm shadow-lg">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                  </span>
                  Registration Open - Join Our Mission
                </div>
              </div>

              {/* Main Heading */}
              <div className="text-center space-y-6 mb-12">
                <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                  {t('title')}
                </h1>

                <p className="text-lg text-muted-foreground md:text-xl max-w-3xl mx-auto leading-relaxed">
                  {t('description')}
                </p>
              </div>

              {/* Feature Cards with Glass Effect */}
              <div className="grid gap-6 md:grid-cols-3 mb-8">
                <div className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/60 backdrop-blur-lg p-6 shadow-lg transition-all hover:shadow-2xl hover:scale-105 hover:bg-white/80">
                  <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-primary/5 transition-transform group-hover:scale-110" />
                  <div className="relative space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-foreground">{th('communityImpactTitle')}</h3>
                    <p className="text-sm text-muted-foreground">{th('communityImpactDesc')}</p>
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/60 backdrop-blur-lg p-6 shadow-lg transition-all hover:shadow-2xl hover:scale-105 hover:bg-white/80">
                  <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-secondary/5 transition-transform group-hover:scale-110" />
                  <div className="relative space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-foreground">{th('disasterReliefTitle')}</h3>
                    <p className="text-sm text-muted-foreground">{th('disasterReliefDesc')}</p>
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/60 backdrop-blur-lg p-6 shadow-lg transition-all hover:shadow-2xl hover:scale-105 hover:bg-white/80">
                  <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-accent/5 transition-transform group-hover:scale-110" />
                  <div className="relative space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-foreground">{th('makeDifferenceTitle')}</h3>
                    <p className="text-sm text-muted-foreground">{th('makeDifferenceDesc')}</p>
                  </div>
                </div>
              </div>

              {/* Stats Bar with Glassmorphism */}
              <div className="rounded-2xl border border-white/20 bg-white/70 backdrop-blur-xl p-6 shadow-xl">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div className="space-y-1">
                    <p className="text-3xl font-bold text-primary">1M+</p>
                    <p className="text-sm text-muted-foreground">{th('targetVolunteers')}</p>
                  </div>
                  <div className="space-y-1 border-x">
                    <p className="text-3xl font-bold text-secondary">25</p>
                    <p className="text-sm text-muted-foreground">{th('districts')}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-bold text-accent">5 Days</p>
                    <p className="text-sm text-muted-foreground">{th('reliefCamp')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Registration Form Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <VolunteerForm />
          </div>
        </section>

        {/* Phoenix AI Chat */}
        <PhoenixChat />
      </main>

      <Footer />
    </div>
  );
}
