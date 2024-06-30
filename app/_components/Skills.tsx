'use client';
import { Card } from '@/components/ui/card';
import { Trans, useTranslation } from 'react-i18next';
import { Badge } from '../../components/ui/badge';
import { Section } from './Section';
import { DockerIcon } from './icons/DockerIcon';
import { ReactIcon } from './icons/ReactIcon';
import { TailwindIcon } from './icons/TailwindIcon';
import { Code } from './ui/Code';

export const Skills = () => {
  const { t } = useTranslation('home');

  return (
    <Section className='flex flex-col gap-4 items-start'>
      <Badge variant={'outline'}>{t('skills.badge')}</Badge>
      <h2 className='scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0'>{t('skills.title')}</h2>
      <div className='flex max-md:flex-col gap-4'>
        <Card className='flex-1 flex flex-col gap-2 p-4'>
          <ReactIcon
            size={42}
            className='animate-spin'
            style={{ animationDuration: '10s' }}
          />
          <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight mb-2'>{t('skills.react.title')}</h3>
          <p className='text-sm text-muted-foreground'>
            <Trans i18nKey='skills.react.description'>
              My main framework is <Code>React</Code>. I also use <Code>Next.js</Code> as a backend and frontend framework.
            </Trans>
          </p>
        </Card>
        <Card className='flex-1 flex flex-col gap-2 p-4'>
          <TailwindIcon size={42} />
          <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight mb-2'>{t('skills.tailwind.title')}</h3>
          <p className='text-sm text-muted-foreground'>
            <Trans i18nKey={'skills.tailwind.description'}>
              I can create <b>beautiful</b> applications <i>in seconds</i> using <Code>TailwindCSS</Code>.
            </Trans>
          </p>
        </Card>
        <Card className='flex-1 flex flex-col gap-2 p-4'>
          <DockerIcon size={42} />
          <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight mb-2'>{t('skills.docker.title')}</h3>
          <p className='text-sm text-muted-foreground'>
            <Trans i18nKey={'skills.docker.description'}>
              I use <Code>Docker</Code> to containerize applications, ensuring <b>consistent</b> environments.
            </Trans>
          </p>
        </Card>
      </div>
    </Section>
  );
};
