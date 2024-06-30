import { Header } from '../_components/Header';
import { Hero } from '../_components/Hero';
import { Skills } from '../_components/Skills';
import { Status } from '../_components/Status';
import { TranslationsProvider } from '../_components/context/TranslationsProvider';
import { Spacing } from '../_components/ui/Spacing';
import initTranslations from '../i18n';

const i18nNamespaces = ['home'];

export default async function Home({ params: { locale } }: Readonly<{ params: { locale: string } }>) {
  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <main>
        <Header />

        <Spacing size='md' />
        <Hero />

        <Spacing size='md' />
        <Status />

        <Spacing size='md' />
        <Skills />
      </main>
    </TranslationsProvider>
  );
}
