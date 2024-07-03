'use client'
import Project from '@/types/project';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export const ProjectCard = (props: Project) => {
  return (
    <Link
      href={`/projects/${props.slug}`}
      className='group inline-flex items-center gap-4 hover:bg-accent/50 transition-colors p-2 rounded'
    >
      <span className='bg-accent text-accent-foreground p-3 rounded-sm'>
        <props.Icon size={16} />
      </span>
      <div className='flex-1'>
        <p className='text-sm font-medium leading-none'>{props.title}</p>
        <p className='text-sm text-muted-foreground'>{props.description}</p>
      </div>
      <ArrowUpRight
          className='group-hover:translate-x-1 group-hover:-translate-y-1 mr-4 transition-transform'
          size={16}
        />
    </Link>
  );
};
