import { Badge } from '@/components/ui/badge';
import { Section } from './Section';

export const Skills = () => {
  return (
    <Section className='flex flex-col gap-4 items-start'>
      <Badge variant={'outline'}>Skills</Badge>
      <h2 className='scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0'>I love working on...</h2>
    </Section>
  );
};
