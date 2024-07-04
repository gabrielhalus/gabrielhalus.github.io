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

  const project = find(PROJECTS[locale], function (o: Project) {
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
        <div className='flex flex-col items-start gap-2'>
          <h1 className='text-2xl font-bold'>{project.title}</h1>
          <div>{project.longDescription}</div>
          {(project.url || project.repo) && (
            <Link
              className='text-blue-500 hover:underline'
              href={project.url! || project.repo!}
            >
              {project.url! || project.repo!}
            </Link>
          )}
          {project.note ?? <p>{project.note}</p>}
        </div>
      </Section>
    </>
  );
}
