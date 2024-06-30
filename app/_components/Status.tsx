import { Card } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';
import { ContactCard, ContactProps } from './ContactCard';
import { ProjectCard, type ProjectProps } from './ProjectCard';
import { Section } from './Section';
import { WorkCard, type WorkProps } from './WorkCard';

export const Status = () => {
  return (
    <Section className='flex items-start gap-4 max-lg:flex-col'>
      <div className='flex-[3] w-full'>
        <Card className='w-full p-4 flex flex-col gap-2'>
          <p className='text-sm text-muted-foreground'>Projects</p>
          {SIDE_PROJECTS.map((project, index) => (
            <ProjectCard
              key={index}
              {...project}
            />
          ))}
        </Card>
      </div>
      <div className='flex-[2] w-full flex flex-col gap-4'>
        <Card className='p-4 flex-1'>
          <p className='text-sm text-muted-foreground'>Work</p>
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
          <p className='text-sm text-muted-foreground'>Contact me</p>
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

const SIDE_PROJECTS: ProjectProps[] = [
  {
    Logo: Newspaper,
    title: 'Paperlive',
    description: 'bla bla bla',
    url: 'http://demo.paperlive.gabrielhalus.com',
  },
  {
    Logo: Newspaper,
    title: "Let's go Lego",
    description: 'bla bla bla',
    url: '/',
  },
  {
    Logo: Newspaper,
    title: 'Paperlive',
    description: 'bla bla bla',
    url: '/',
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
