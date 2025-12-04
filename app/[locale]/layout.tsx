import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://volunteer.nysc.lk';

export const metadata: Metadata = {
  title: 'NYSC Volunteer Portal - One Million Volunteers Program',
  description: 'මිලියනයක ස්වේච්ඡා තරුණ බලකායට ඔබත් එකතු වන්න....! ஒரு மில்லியன் தன்னார்வ இளைஞர் படையில் இணைய உங்களுக்கும் ஒரு சந்தர்ப்பம்....! An Opportunity for You to Join the Million Volunteer Youth Corps....!',
  openGraph: {
    title: 'NYSC Volunteer Portal - One Million Volunteers Program',
    description: 'මිලියනයක ස්වේච්ඡා තරුණ බලකායට ඔබත් එකතු වන්න....! ஒரு மில்லியன் தன்னார்வ இளைஞர் படையில் இணைய உங்களுக்கும் ஒரு சந்தர்ப்பம்....! An Opportunity for You to Join the Million Volunteer Youth Corps....!',
    url: siteUrl,
    siteName: 'NYSC Volunteer Portal',
    images: [
      {
        url: `${siteUrl}/images/volunteers_meta.jpg`,
        width: 1200,
        height: 630,
        alt: 'NYSC One Million Volunteers Program',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NYSC Volunteer Portal - One Million Volunteers Program',
    description: 'මිලියනයක ස්වේච්ඡා තරුණ බලකායට ඔබත් එකතු වන්න....! ஒரு மில்லியன் தன்னார்வ இளைஞர் படையில் இணைய உங்களுக்கும் ஒரு சந்தர்ப்பம்....! An Opportunity for You to Join the Million Volunteer Youth Corps....!',
    images: [`${siteUrl}/images/volunteers_meta.jpg`],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
