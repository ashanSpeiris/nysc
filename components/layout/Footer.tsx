'use client';

import { useTranslations } from 'next-intl';
import { Heart, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  const t = useTranslations('contact');
  const tf = useTranslations('footer');

  return (
    <footer className="mt-auto border-t bg-slate-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">
              {tf('contactTitle')}
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <p>{t('address')}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a
                  href={`mailto:${t('email')}`}
                  className="hover:text-primary transition-colors"
                >
                  {t('email')}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a
                  href={`tel:${t('phone')}`}
                  className="hover:text-primary transition-colors"
                >
                  {t('phone')}
                </a>
              </div>
            </div>
          </div>

          {/* About NYSC */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">{tf('aboutTitle')}</h3>
            <p className="text-sm text-muted-foreground">
              {tf('aboutDescription')}
            </p>
          </div>

          {/* Emergency Relief */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">{tf('reliefTitle')}</h3>
            <p className="text-sm text-muted-foreground">
              {tf('reliefDescription')}
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">© 2025 National Youth Services Council. All rights reserved.</p>

          {/* TecWyze Credit */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 fill-red-500 text-red-500 animate-pulse" />
            <span>by</span>
            <Link
              href="https://tecwyze.lk/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline transition-all hover:text-accent"
            >
              TecWyze
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
