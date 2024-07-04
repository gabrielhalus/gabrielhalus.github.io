'use client';
import { useTranslation } from 'react-i18next';
import { Section } from './Section';
import { Spacing } from './ui/Spacing';

export const Hero = () => {
  const { t } = useTranslation('home');

  return (
    <Section className='flex items-start max-lg:flex-col'>
      <div className='flex-[2]'>
        <div className='flex items-center gap-4'>
          <img
            src='https://media.licdn.com/dms/image/D4E03AQH7RFJIkDwp4A/profile-displayphoto-shrink_400_400/0/1713345873825?e=1725494400&v=beta&t=DPg93PUPzg03LsXqek89Y1Z-ldtV1z9KuYnyhg6ajds'
            className='w-[100px] h-auto max-w-xs rounded-full'
            alt="Gabriel's picture"
          />
          <div className='flex-[1] h-full'>
            <h2 className='font-caption font-semibold text-5xl max-sm:text-4xl text-primary'>{t('profile.name')}</h2>
            <h3 className='font-caption text-3xl max-sm:text-2xl'>{t('profile.title')}</h3>
          </div>
        </div>
        <Spacing size='xs' />
        <p className='text-base'>{t('profile.description')}</p>
      </div>
    </Section>
  );
};
