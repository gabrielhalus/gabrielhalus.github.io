import { Curso } from '@/components/Curso'
import { ButtonLink } from '@/components/ui'

export default function NotFound() {
  return (
    <section className="pad-block flex min-h-[60vh] flex-col items-start justify-center gap-10 overflow-hidden rounded-block bg-ink text-white md:flex-row md:items-center md:gap-16">
      <Curso size={220} tone="sombre" expression="surpris" animated className="max-w-[45vw] self-center" />
      <div className="flex flex-col items-start gap-5">
        <span className="font-mono text-sm text-accent">Erreur 404</span>
        <h1 className="m-0 max-w-[640px] text-[clamp(40px,5.6vw,80px)] leading-[0.96] font-extrabold tracking-[-0.05em] text-balance">Même Curso ne trouve pas cette page.</h1>
        <p className="m-0 max-w-[480px] text-lg text-on-dark">Le lien est peut-être ancien, ou la page a changé d’adresse.</p>
        <ButtonLink href="/" variant="accent" arrow>
          Retour à l’accueil
        </ButtonLink>
      </div>
    </section>
  )
}
