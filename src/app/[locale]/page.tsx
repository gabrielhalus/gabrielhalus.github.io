import { Header } from '../_components/Header';
import { Hero } from '../_components/Hero';
import { Skills } from '../_components/Skills';
import { Status } from '../_components/Status';
import { Spacing } from '../_components/ui/Spacing';

export default function Home() {
  return (
    <main>
      <Header />

      <Spacing size='md' />

      <Hero />

      <Spacing size='md' />

      <Status />

      <Spacing size='md' />

      <Skills />
    </main>
  );
}
