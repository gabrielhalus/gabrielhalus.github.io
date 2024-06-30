'use client';
import { useTranslation } from 'react-i18next';
import { Section } from './Section';
import { Spacing } from './ui/Spacing';

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
