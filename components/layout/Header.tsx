'use client';

import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';

export function Header() {
  const t = useTranslations('navigation');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const changeLocale = (newLocale: string) => {
    const currentPath = pathname.split('/').slice(2).join('/');
    router.push(`/${newLocale}${currentPath ? `/${currentPath}` : ''}`);
  };

  const languageNames: Record<string, string> = {
    en: 'English',
    si: 'සිංහල',
    ta: 'தமிழ்',
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo and Title */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="relative h-12 w-12 md:h-16 md:w-16">
                <Image
                  src="/images/nysc-logo.png"
                  alt="NYSC Logo"
                  fill
                  sizes="(max-width: 768px) 48px, 64px"
                  className="object-contain"
                  priority
                  quality={100}
                />
              </div>
              <div className="hidden md:block h-10 w-px bg-border" />
              <div className="relative h-10 w-10 md:h-14 md:w-14">
                <Image
                  src="/images/sri-lanka-emblem.png"
                  alt="Sri Lanka Emblem"
                  fill
                  sizes="(max-width: 768px) 40px, 56px"
                  className="object-contain"
                  priority
                  quality={100}
                />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold text-primary md:text-lg">
                National Youth Services Council
              </h1>
              <p className="text-xs text-muted-foreground md:text-sm">
                One Million Volunteers
              </p>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <Select value={locale} onValueChange={changeLocale}>
              <SelectTrigger className="w-[110px] md:w-[130px]">
                <SelectValue>{languageNames[locale]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="si">සිංහල</SelectItem>
                <SelectItem value="ta">தமிழ்</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </header>
  );
}
