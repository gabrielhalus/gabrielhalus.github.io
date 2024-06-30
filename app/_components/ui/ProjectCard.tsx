import { type LucideIcon } from 'lucide-react';
import Link from 'next/link';

export type ProjectProps = {
  Logo: LucideIcon;
  title: string;
  description: string;
  url: string;
};

export const ProjectCard = (props: ProjectProps) => {
  return (
    <Link
      href={props.url}
      className='inline-flex items-center gap-4 hover:bg-accent/50 transition-colors p-2 rounded'
    >
      <span className='bg-accent text-accent-foreground p-3 rounded-sm'>
        <props.Logo size={16} />
      </span>
      <div>
        <p className='text-sm font-medium leading-none'>{props.title}</p>
        <p className='text-sm text-muted-foreground'>{props.description}</p>
      </div>
    </Link>
  );
};
