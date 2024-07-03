import { Contact } from '../_components/Contact';
import { Footer } from '../_components/Footer';
import { Header } from '../_components/Header';
import { Hero } from '../_components/Hero';
import { Skills } from '../_components/Skills';
import { Status } from '../_components/Status';
import { Spacing } from '../_components/ui/Spacing';


export default async function Home() {

  return (
      <main>
        <Hero />
        <Spacing size='md' />
        <Status />
        <Spacing size='md' />
        <Skills />
        <Spacing size='md' />
        <Contact />
      </main>
  );
}
