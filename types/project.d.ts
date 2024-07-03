import { LucideIcon } from 'lucide-react';

type Project = {
  Icon: LucideIcon;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  image?: string;
  url?: string;
  repo?: string;
};

export default Project;
