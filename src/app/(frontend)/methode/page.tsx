import type { Metadata } from 'next'

import { Block, ButtonLink, Eyebrow } from '@/components/ui'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Déroulement d’un projet web sur mesure',
  description:
    'Vous savez ce qui sera développé, combien cela coûtera et comment le projet avancera, du premier échange à la mise en service.',
  alternates: { canonical: '/methode' },
}

export default async function MethodPage() {
  const payload = await getPayloadClient()
  const { method } = await payload.findGlobal({ slug: 'home' })
  const steps = method?.steps ?? []

  return (
    <>
      <Block className="pad-block flex flex-col gap-3.5">
        <Eyebrow>// Méthode</Eyebrow>
        <h1 className="m-0 max-w-[900px] text-[clamp(42px,5.4vw,80px)] leading-[0.95] font-extrabold tracking-[-0.05em] text-balance">Un projet cadré dès le départ, avec un suivi régulier.</h1>
        <p className="m-0 max-w-[620px] text-lg leading-normal text-body">
          Vous savez ce qui sera développé, combien cela coûtera et comment le projet avancera. Je vous accompagne personnellement à chaque étape, du premier échange à la mise en service.
        </p>
      </Block>
      {steps.length > 0 && (
        <Block variant="dark" className="pad-block">
          <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-3 p-0">
            {steps.map((step, i) => (
              <li key={step.id} className="flex flex-col gap-6 rounded-tile border border-night-line bg-night p-6">
                <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, '0')}</span>
                <div className="flex flex-col gap-2">
                  <h2 className="m-0 text-xl font-semibold tracking-[-0.02em]">{step.title}</h2>
                  <p className="m-0 text-[15px] leading-normal text-on-dark">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Block>
      )}
      <Block variant="accent" className="flex flex-wrap items-center justify-between gap-7 p-[clamp(32px,5vw,64px)]">
        <h2 className="m-0 max-w-[720px] text-[clamp(30px,3.6vw,48px)] leading-none font-bold tracking-[-0.04em] text-balance">Un projet en tête&nbsp;?</h2>
        <ButtonLink href="/contact" size="xl" arrow>
          Discuter de votre besoin
        </ButtonLink>
      </Block>
    </>
  )
}
