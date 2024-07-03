'use client';
import { Section } from '@/app/_components/Section';
import { Spacing } from '@/app/_components/ui/Spacing';
import { PROJECTS } from '@/data/projects';
import type Project from '@/types/project';
import { find } from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function Project({ params: { locale, slug } }: { params: { locale: 'en' | 'fr'; slug: string } }) {
  const router = useRouter();
  const { t } = useTranslation();

  const project = find(PROJECTS, function (o: Project) {
    return o.slug == slug;
  });

  if (!project) {
    router.back();
    return;
  }

  return (
    <>
      <Spacing size='xs' />
      <Section className='flex flex-col gap-4 items-start'>
        <button
          className='hover:underline'
          onClick={router.back}
        >
          {t('back')}
        </button>

        {project.image && (
          <img
            src={project.image}
            className='shadow rounded-md obj-contain'
          />
        )}

        <Spacing size='xs' />
        <div>
          <h1 className='text-2xl font-bold'>{project.title}</h1>
          <div>{project.shortDescription}</div>
        </div>
        <Spacing size='xs' />
        {project.url && (
          <Link
            className='flex gap-2 text-blue-500 hover:underline-offset-1'
            href={project.url}
          >
            {t('home.demo')}
            {project.url}
          </Link>
        )}
      </Section>
    </>
  );
}
