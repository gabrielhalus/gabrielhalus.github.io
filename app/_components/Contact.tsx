'use client';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { Section } from './Section';
import { LinkCard } from './ui/LinkCard';

export const Contact = () => {
  const { t } = useTranslation('home');

  return (
    <Section className='flex flex-col gap-4 items-start'>
      <Badge variant={'outline'}>{t('contact.badge')}</Badge>
      <h2 className='scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0'>{t('contact.title')}</h2>
      <div className='w-full flex max-md:flex-col gap-4'>
        <LinkCard
          className='flex-1'
          url='https://linkedin.com/in/gabrielhalus'
          name='@gabrielhalus'
          image='https://media.licdn.com/dms/image/D4E03AQH7RFJIkDwp4A/profile-displayphoto-shrink_400_400/0/1713345873825?e=1725494400&v=beta&t=DPg93PUPzg03LsXqek89Y1Z-ldtV1z9KuYnyhg6ajds'
          mediumImage='https://img.freepik.com/vecteurs-premium/linkedin-logo_578229-227.jpg'
          description={t('contact.linkedin-caption')}
        />
        <LinkCard
          className='flex-1'
          url='mailto:gabrielhalus@gmail.com'
          name='gabrielhalus@gmail.com'
          image='images/avatar.jpg'
          description={t('contact.mail-caption')}
        />
      </div>
    </Section>
  );
};
