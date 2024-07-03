'use client'
import Project from '@/types/project';
import Link from 'next/link';

export const ProjectCard = (props: Project) => {
  return (
    <Link
      href={`/projects/${props.slug}`}
      className='inline-flex items-center gap-4 hover:bg-accent/50 transition-colors p-2 rounded'
    >
      <span className='bg-accent text-accent-foreground p-3 rounded-sm'>
        <props.Icon size={16} />
      </span>
      <div>
        <p className='text-sm font-medium leading-none'>{props.title}</p>
        <p className='text-sm text-muted-foreground'>{props.description}</p>
      </div>
    </Link>
  );
};
