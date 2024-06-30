import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Card } from '../../../components/ui/card';

export type LinkCardProps = {
  image: string;
  mediumImage?: string;
  name: string;
  description: string;
  url: string;
  className?: string;
};

export const LinkCard = ({ className, ...props }: LinkCardProps) => {
  return (
    <Link
      className={cn(className, 'group')}
      href={props.url}
    >
      <Card className='p-3 bg-accent/10 flex items-center gap-4'>
        <div className='relative'>
          <img
            src={props.image}
            alt={props.name}
            className='w-10 h-10 rounded-full object-cover'
          />
          {props.mediumImage && (
            <img
              src={props.mediumImage}
              alt={props.name}
              className='w-4 h-4 absolute -bottom-1 -right-1'
            />
          )}
        </div>
        <div className='mr-auto flex flex-col gap-1'>
          <p className='text-sm font-medium leading-none'>{props.name}</p>
          <p className='text-xs text-muted-foreground'>{props.description}</p>
        </div>
        <ArrowUpRight
          className='group-hover:translate-x-1 group-hover:-translate-y-1 mr-4 transition-transform'
          size={16}
        />
      </Card>
    </Link>
  );
};
