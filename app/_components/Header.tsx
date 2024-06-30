'use client';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Section } from './Section';
import { GithubIcon } from './icons/GithubIcon';
import { LinkedinIcon } from './icons/LinkedinIcon';

export const Header = () => {
  const { t } = useTranslation();

  return (
    <header className='sticky top-0 py-4 z-10 bg-background'>
      <Section className='flex items-baseline'>
        <h1 className='text-lg font-bold text-foreground'>{t('header.title')}</h1>
        <div className='flex-1' />
        <ul className='flex items-center gap-2'>
          <Link
            href='https://github.com/gabrielhalus'
            className={buttonVariants({ variant: 'outline', size: 'icon' })}
          >
            <GithubIcon
              size={12}
              className='text-foreground'
            />
          </Link>
          <Link
            href='https://linkedin.com/in/gabrielhalus'
            className={buttonVariants({ variant: 'outline', size: 'icon' })}
          >
            <LinkedinIcon
              size={16}
              className='text-foreground'
            />
          </Link>
        </ul>
      </Section>
    </header>
  );
};
