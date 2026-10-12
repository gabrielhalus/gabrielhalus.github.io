import Link from 'next/link'
import { type ComponentProps, type ReactNode, useId } from 'react'

import { cn } from '@/lib/utils'

import { Curso } from './Curso'
import { ArrowRight, ArrowUpRight } from './icons'

/* ── Boutons pilule ─────────────────────────────────────────── */

type ButtonVariant = 'primary' | 'accent' | 'outline' | 'white'
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-white hover:bg-ink-soft',
  accent: 'bg-accent text-ink hover:bg-accent-deep',
  outline: 'border border-line-strong bg-white text-ink hover:border-ink',
  white: 'bg-white text-ink hover:bg-surface-2',
}

// Pastille fléchée : contraste inverse du bouton
const dotVariants: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-ink',
  accent: 'bg-ink text-accent',
  outline: 'bg-ink text-accent',
  white: 'bg-ink text-accent',
}

const sizes: Record<ButtonSize, { button: string; withDot: string; dot: string }> = {
  sm: { button: 'h-11 px-[18px] text-sm', withDot: 'pl-[18px] pr-1.5', dot: 'size-8' },
  md: { button: 'h-12 px-5 text-[15px]', withDot: 'pl-5 pr-1.5', dot: 'size-9' },
  lg: { button: 'h-[52px] px-[22px] text-base', withDot: 'pl-[22px] pr-1.5', dot: 'size-10' },
  xl: { button: 'h-14 px-6 text-[17px]', withDot: 'pl-6 pr-2', dot: 'size-10' },
}

type ButtonLinkProps = {
  href: string
  variant?: ButtonVariant
  size?: ButtonSize
  arrow?: boolean
  className?: string
  children: ReactNode
} & Omit<ComponentProps<typeof Link>, 'href' | 'className' | 'children'>

export const ButtonLink = ({ href, variant = 'primary', size = 'lg', arrow = false, className, children, ...rest }: ButtonLinkProps) => (
  <Link
    href={href}
    className={cn(
      'inline-flex shrink-0 items-center justify-center gap-2.5 rounded-full font-semibold no-underline transition-colors',
      buttonVariants[variant],
      sizes[size].button,
      arrow && sizes[size].withDot,
      className,
    )}
    {...rest}
  >
    {children}
    {arrow && <ArrowDot className={cn(dotVariants[variant], sizes[size].dot)} />}
  </Link>
)

export const ArrowDot = ({ className, up = false }: { className?: string; up?: boolean }) => (
  <span className={cn('flex shrink-0 items-center justify-center rounded-full', className)}>
    {up ? <ArrowUpRight /> : <ArrowRight />}
  </span>
)

/* ── Blocs ──────────────────────────────────────────────────── */

type BlockVariant = 'white' | 'dark' | 'accent' | 'none'

const blockVariants: Record<BlockVariant, string> = {
  white: 'bg-white',
  dark: 'bg-ink text-white',
  accent: 'bg-accent text-ink',
  none: '',
}

export const Block = ({
  as: Tag = 'section',
  variant = 'white',
  className,
  children,
  ...rest
}: {
  as?: 'section' | 'div' | 'article' | 'aside' | 'header' | 'figure'
  variant?: BlockVariant
  className?: string
  children: ReactNode
  id?: string
  'aria-label'?: string
  'aria-labelledby'?: string
}) => (
  <Tag className={cn('rounded-block', blockVariants[variant], className)} {...rest}>
    {children}
  </Tag>
)

/* ── Typo ───────────────────────────────────────────────────── */

export const Eyebrow = ({ children, className }: { children: ReactNode; className?: string }) => (
  <span className={cn('eyebrow', className ?? 'text-muted')}>{children}</span>
)

/** En-tête de section : eyebrow + H2 à gauche, texte d'appui à droite. */
export const SectionHeading = ({
  eyebrow,
  title,
  aside,
  dark = false,
  id,
  className,
}: {
  eyebrow?: ReactNode
  title: ReactNode
  aside?: ReactNode
  dark?: boolean
  id?: string
  className?: string
}) => (
  <div className={cn('flex flex-wrap items-end justify-between gap-6', className)}>
    <div className="flex flex-col gap-3.5">
      {eyebrow && <Eyebrow className={dark ? 'text-subtle' : 'text-muted'}>{eyebrow}</Eyebrow>}
      <h2 id={id} className="h-section max-w-[760px]">
        {title}
      </h2>
    </div>
    {aside && <p className={cn('m-0 max-w-[380px] text-base leading-[1.55]', dark ? 'text-on-dark' : 'text-muted')}>{aside}</p>}
  </div>
)

/* ── Étiquettes ─────────────────────────────────────────────── */

export const Tag = ({ children, accent = false, mono = false, className }: { children: ReactNode; accent?: boolean; mono?: boolean; className?: string }) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-3.5 py-[7px] text-[13px]',
      accent ? 'bg-accent text-ink' : 'border border-line-strong',
      mono && 'font-mono',
      className,
    )}
  >
    {children}
  </span>
)

export const Badge = ({ children, className }: { children: ReactNode; className?: string }) => (
  <span className={cn('inline-flex items-center gap-1.5 rounded-chip px-2 py-1.5 text-xs font-medium', className ?? 'bg-surface-2 text-muted')}>
    {children}
  </span>
)

export const AvailabilityBadge = ({ text, className }: { text: string; className?: string }) => (
  <span className={cn('inline-flex items-center gap-2 self-start rounded-full bg-surface-2 py-2 pr-3.5 pl-2.5 text-sm font-medium', className)}>
    <span className="size-2 rounded-full bg-success shadow-[0_0_0_4px_var(--color-mint)]" />
    {text}
  </span>
)

/** Visuel de substitution légendé, en attendant une vraie image. */
export const Placeholder = ({ label, className }: { label: string; className?: string }) => (
  <div className={cn('flex items-center justify-center p-6 text-center font-mono text-xs', className)}>{label}</div>
)

/** Symbole de la marque : Curso, ton clair. */
export const Logo = ({ size = 40, glitchOnHover }: { size?: number; glitchOnHover?: boolean }) => (
  <Curso size={size} glitchOnHover={glitchOnHover} />
)

/** Questions / réponses en <details> : la première ouverte, une seule à la fois (attribut `name`). */
export const FaqList = ({ items, size = 'md', className }: { items: { question: string; answer: string; id?: string | null }[]; size?: 'md' | 'lg'; className?: string }) => {
  const group = useId()
  return (
    <div className={cn('flex flex-col', className)}>
      {items.map((item, i) => (
        <details key={item.id ?? i} name={group} open={i === 0} className={cn('border-b border-line pb-4', size === 'lg' && 'pt-2', i === items.length - 1 && size === 'md' && 'border-b-0')}>
          <summary className={cn('py-2 font-semibold text-ink', size === 'lg' ? 'text-[19px]' : 'text-lg')}>{item.question}</summary>
          <p className={cn('mt-2 mb-0 leading-[1.55] text-body', size === 'lg' ? 'text-[17px]' : 'text-[15px]')}>{item.answer}</p>
        </details>
      ))}
    </div>
  )
}
