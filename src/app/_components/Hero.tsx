'use client';
import { cn } from '@/lib/utils';
import { ComponentPropsWithoutRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Section } from './Section';
import { Spacing } from './ui/Spacing';

const Code = ({ className, ...props }: ComponentPropsWithoutRef<'span'>) => {
  return (
    <span
      className={cn(
        'bg-accent/30 font-mono border hover:bg-accent/50 transition-colors border-accent px-1 py-0.5 mx-0.5 text-primary rounded-sm',
        className,
      )}
      {...props}
    />
  );
};

export const Hero = () => {
  const { t } = useTranslation();

  return (
    <Section className='flex items-start max-lg:flex-col'>
      <div className='flex-[2]'>
        <div className='flex items-center gap-4'>
          <img
            src='https://avatars.githubusercontent.com/u/73295384?v=4'
            className='w-[100px] h-auto max-w-xs rounded-full'
            alt="Gabriel's picture"
          />
          <div className='flex-[1] h-full'>
            <h2 className='font-caption font-semibold text-5xl text-primary'>{t('profile.name')}</h2>
            <h3 className='font-caption text-3xl'>{t('profile.title')}</h3>
          </div>
        </div>
        <Spacing size='xs' />
        <p className='text-base'>{t('profile.description')}</p>
      </div>
    </Section>
  );
};
