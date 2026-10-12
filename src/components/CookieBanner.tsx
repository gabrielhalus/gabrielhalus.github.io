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
      className="fixed bottom-4 left-4 z-50 box-border flex w-[min(440px,calc(100%-32px))] flex-col gap-4 rounded-panel border border-line bg-white p-6 shadow-pop"
    >
      <div className="flex items-center gap-2.5">
        <Curso size={40} expression="curieux" />
        <span className="text-[17px] font-semibold">{title}</span>
      </div>
      <p className="m-0 text-[15px] leading-normal text-body">
        {text} <Link href="/cookies" className="text-ink">En savoir plus</Link>
      </p>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={() => choose(false)} className="h-11 cursor-pointer rounded-full border border-line-strong bg-white text-[15px] font-semibold text-ink hover:border-ink">
          Tout refuser
        </button>
        <button type="button" onClick={() => choose(true)} className="h-11 cursor-pointer rounded-full bg-ink text-[15px] font-semibold text-white hover:bg-ink-soft">
          Tout accepter
        </button>
      </div>
      <Link href="/cookies" onClick={() => setOpen(false)} className="flex h-9 items-center justify-center text-sm font-medium text-ink underline underline-offset-4">
        Personnaliser
      </Link>
    </div>
  )
}
