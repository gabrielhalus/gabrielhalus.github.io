'use client'

import Link from 'next/link'
import { useEffect, useState, useSyncExternalStore } from 'react'

import { OPEN_BANNER_EVENT, readConsentRaw, subscribeConsent, writeConsent } from '@/lib/consent'

import { Curso } from './Curso'

export const CookieBanner = ({ title, text }: { title: string; text: string }) => {
  // null côté serveur : la bannière n'apparaît qu'une fois le cookie lu dans le navigateur
  const consent = useSyncExternalStore(subscribeConsent, readConsentRaw, () => null)
  const [forced, setForced] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const show = () => {
      setDismissed(false)
      setForced(true)
    }
    window.addEventListener(OPEN_BANNER_EVENT, show)
    return () => window.removeEventListener(OPEN_BANNER_EVENT, show)
  }, [])

  const open = !dismissed && (forced || consent === '')
  if (!open) return null

  const setOpen = (value: boolean) => {
    setDismissed(!value)
    if (!value) setForced(false)
  }

  const choose = (all: boolean) => {
    writeConsent({ analytics: all, thirdParty: all })
    setOpen(false)
  }

  return (
    <div
      role="dialog"
      aria-label="Consentement aux cookies"
      className="fixed inset-x-0 bottom-0 z-40 box-border flex flex-col gap-3.5 rounded-t-[28px] bg-white px-[18px] pt-2.5 pb-[22px] shadow-[0_-12px_40px_-8px_#10101040] sm:inset-x-auto sm:bottom-4 sm:left-4 sm:w-[min(440px,calc(100%-32px))] sm:gap-4 sm:rounded-panel sm:border sm:border-line sm:p-6 sm:shadow-pop"
    >
      <span aria-hidden="true" className="h-[5px] w-10 self-center rounded-full bg-line-strong sm:hidden" />
      <div className="flex items-center gap-3 sm:gap-2.5">
        <span className="sm:hidden">
          <Curso size={48} expression="curieux" />
        </span>
        <span className="hidden sm:contents">
          <Curso size={40} expression="curieux" />
        </span>
        <span className="text-lg font-bold tracking-[-0.02em] sm:text-[17px] sm:font-semibold sm:tracking-normal">{title}</span>
      </div>
      <p className="m-0 text-[15px] leading-normal text-body">
        {text} <Link href="/cookies" className="text-ink">En savoir plus</Link>
      </p>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={() => choose(false)} className="h-[52px] cursor-pointer rounded-full border border-line-strong bg-white text-base font-semibold text-ink hover:border-ink sm:h-11 sm:text-[15px]">
          Tout refuser
        </button>
        <button type="button" onClick={() => choose(true)} className="h-[52px] cursor-pointer rounded-full bg-ink text-base font-semibold text-white hover:bg-ink-soft sm:h-11 sm:text-[15px]">
          Tout accepter
        </button>
      </div>
      <Link href="/cookies" onClick={() => setOpen(false)} className="flex h-11 items-center justify-center text-[15px] font-medium text-ink underline underline-offset-4 sm:h-9 sm:text-sm">
        Personnaliser
      </Link>
    </div>
  )
}
