'use client';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Section } from './Section';
import { GithubIcon } from './icons/GithubIcon';
import { LinkedinIcon } from './icons/LinkedinIcon';

export const Header = () => {
  const { t } = useTranslation();

  return (
    <header className='sticky top-0 py-4'>
      <Section className='flex items-baseline'>
        <h1 className='text-lg font-bold text-foreground'>{t('header.title')}</h1>
        <div className='flex-1' />
        <ul className='flex items-center gap-2'>
          <Link
            href='https://github.com/gabrielhalus'
            className={cn(buttonVariants({ variant: 'outline' }), 'size-6 p-0')}
          >
            <GithubIcon
              size={12}
              className='text-foreground'
            />
          </Link>
          <Link
            href='https://linkedin.com/in/gabrielhalus'
            className={cn(buttonVariants({ variant: 'outline' }), 'size-6 p-0')}
          >
            <LinkedinIcon
              size={12}
              className='text-foreground'
            />
          </Link>
        </ul>
      </Section>
    </header>
  );
};
