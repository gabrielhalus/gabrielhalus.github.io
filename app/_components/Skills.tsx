'use client';
import { useTranslation } from 'react-i18next';
import { Badge } from '../../components/ui/badge';
import { Section } from './Section';

export const Skills = () => {
  const { t } = useTranslation();

  return (
    <Section className='flex flex-col gap-4 items-start'>
      <Badge variant={'outline'}>{t('skills.badge')}</Badge>
      <h2 className='scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0'>{t('skills.title')}</h2>
    </Section>
  );
};
