import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export type WorkProps = {
  image: string;
  title: string;
  role: string;
  date: string;
  url: string;
  freelance?: boolean;
  intern?: boolean;
};

export const WorkCard = (props: WorkProps) => {
  return (
    <Link
      href={props.url}
      className='inline-flex items-center gap-4 hover:bg-accent/50 transition-colors p-1 rounded'
    >
      <img
        src={props.image}
        alt={props.title}
        className='w-10 h-10 object-contain rounded-sm'
      />
      <div className='mr-auto'>
        <div className='flex items-center gap-2'>
          <p className='text-sm font-medium leading-none'>{props.title}</p>
          {props.freelance && <Badge variant='outline'>Mission</Badge>}
          {props.intern && <Badge variant='outline'>Intern</Badge>}
        </div>
        <p className='text-xs text-muted-foreground'>{props.role}</p>
      </div>
      <div>
        <p className='text-xs text-nowrap text-end text-muted-foreground'>{props.date}</p>
      </div>
    </Link>
  );
};
