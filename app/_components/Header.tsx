'use client';
import { useTranslation } from 'react-i18next';
import { Section } from './Section';
import { LanguagesDropdown } from './ui/LanguagesDropdown';
import Link from 'next/link';

export const Header = () => {
  const { t } = useTranslation('home');

  return (
    <header className='sticky top-0 py-4 z-10 bg-background'>
      <Section className='flex items-baseline'>
        <Link href='/'>
          <h1 className='text-lg font-bold text-foreground'>{t('header.title')}</h1>
        </Link>
        <div className='flex-1' />
        <ul className='flex items-center gap-2'>
          <LanguagesDropdown />
        </ul>
      </Section>
    </header>
  );
};
