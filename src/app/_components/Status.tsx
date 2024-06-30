'use client';
import { Card } from '@/components/ui/card';
import { BicepsFlexed, Brain, ToyBrick } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Section } from './Section';
import { ContactCard, ContactProps } from './ui/ContactCard';
import { ProjectCard, type ProjectProps } from './ui/ProjectCard';
import { WorkCard, type WorkProps } from './ui/WorkCard';

export const Status = () => {
  const { t } = useTranslation();

  return (
    <Section className='flex gap-4 max-lg:flex-col items-stretch'>
      <div className='flex-[3] w-full'>
        <Card className='h-full w-full p-4 flex flex-col gap-2'>
          <p className='text-sm text-muted-foreground'>{t('projects')}</p>
          {PROJECTS.map((project, index) => (
            <ProjectCard
              key={index}
              {...project}
            />
          ))}
        </Card>
      </div>
      <div className='flex-[2] w-full flex flex-col gap-4'>
        <Card className='p-4 flex-1'>
          <p className='text-sm text-muted-foreground'>{t('work')}</p>
          <div className='flex flex-col gap-4'>
            {WORKS.map((work, index) => (
              <WorkCard
                key={index}
                {...work}
              />
            ))}
          </div>
        </Card>
        <Card className='p-4 flex-1 flex flex-col gap-2'>
          <p className='text-sm text-muted-foreground'>{t('contact')}</p>
          <div className='flex flex-col gap-4'>
            {CONTACTS.map((contact, index) => (
              <ContactCard
                key={index}
                {...contact}
              />
            ))}
          </div>
        </Card>
      </div>
    </Section>
  );
};

const PROJECTS: ProjectProps[] = [
  {
    Logo: BicepsFlexed,
    title: 'Trekha',
    description: 'A collaborative Pomodoro timer with social features.',
    url: 'http://trekha.com',
  },
  {
    Logo: Brain,
    title: 'Paperlive',
    description: 'A platform for tracking and analyzing research paper metrics.',
    url: 'http://demo.paperlive.gabrielhalus.com',
  },
  {
    Logo: ToyBrick,
    title: "Let's go Lego",
    description: 'An e-auction website focused on LEGO products.',
    url: '#',
  },
];

const WORKS: WorkProps[] = [
  {
    image: 'https://www.eolas.fr/uploads/Image/ab/SIT_EOLAS_679_Logo_Couleur72dpi.png',
    title: 'Eolas',
    role: 'Software developer',
    date: '2023 - Present',
    url: 'https://eolas.fr',
  },
  {
    image: 'https://www.liglab.fr/sites/default/files/theme/logo-lig_0.svg',
    title: 'LIG',
    role: 'Software developer',
    date: '2023',
    url: 'https://www.liglab.fr',
    intern: true,
  },
];

const CONTACTS: ContactProps[] = [
  {
    name: '@gabrielhalus',
    image:
      'https://media.licdn.com/dms/image/D4E03AQH7RFJIkDwp4A/profile-displayphoto-shrink_400_400/0/1713345873825?e=1725494400&v=beta&t=DPg93PUPzg03LsXqek89Y1Z-ldtV1z9KuYnyhg6ajds',
    mediumImage: 'https://img.freepik.com/vecteurs-premium/linkedin-logo_578229-227.jpg',
    description: '96 relations',
    url: 'https://linkedin.com/in/gabrielhalus',
  },
  {
    name: '@gabrielhalus',
    image: 'https://avatars.githubusercontent.com/u/73295384?v=4',
    mediumImage: 'https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894_1280.png',
    description: '12 repos',
    url: 'https://github.com/gabrielhalus',
  },
];
