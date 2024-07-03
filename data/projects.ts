import Project from '@/types/project';
import { BicepsFlexed, Brain, ToyBrick } from 'lucide-react';

export const PROJECTS: Project[] = [
  {
    Icon: BicepsFlexed,
    title: 'Trekha',
    slug: 'trekha',
    shortDescription: 'A collaborative Pomodoro timer with social features.',
    longDescription: '',
    image: '',
    url: '',
    repo: 'https://github.com/trekha-com/',
  },
  {
    Icon: Brain,
    title: 'Paperlive',
    slug: 'paperlive',
    shortDescription: 'A platform for tracking and analyzing research paper metrics.',
    longDescription: '',
    image: '/images/paperlive.png',
    url: 'http://demo.paperlive.gabrielhalus.com',
    repo: 'https://github.com/gabrielhalus/paperlive.git',
  },
  {
    Icon: ToyBrick,
    title: "Let's go Lego",
    slug: 'letsgo-lego',
    shortDescription: 'An e-auction website focused on LEGO products.',
    longDescription: '',
    image: '',
    url: '',
  },
];
