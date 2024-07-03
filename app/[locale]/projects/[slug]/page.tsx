'use client'
import { Section } from '@/app/_components/Section';
import { PROJECTS } from '@/data/projects';
import type Project from '@/types/project';
import { find } from 'lodash';
import { useRouter } from 'next/navigation';

export default function Project({ params: { locale, slug }}: { params: { locale: 'en' | 'fr', slug: string } }) {
    const router = useRouter()
    const  project = find(PROJECTS, function(o: Project) { return o.slug == slug});
    
    if (!project) {
        router.back()
        return;
    }

    return (
        <Section className='flex flex-col gap-4 items-start'>
            <h1>{project.title}</h1>
        </Section>
    );
}
