'use client';

import { useTranslation } from 'react-i18next';
import { Section } from './Section';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <div className='bg-muted p-8'>
      <Section>
        <p className='text-sm text-muted-foreground'>{t('footer.copyrights')}</p>
      </Section>
    </div>
  );
};
