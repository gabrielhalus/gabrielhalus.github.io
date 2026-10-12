/** Consentement cookies, stocké dans le cookie `gh_consent` (6 mois). */
export type Consent = { analytics: boolean; thirdParty: boolean }

export const CONSENT_COOKIE = 'gh_consent'
export const OPEN_BANNER_EVENT = 'gh:open-consent'
export const CONSENT_CHANGE_EVENT = 'gh:consent-change'

const MAX_AGE = 60 * 60 * 24 * 182

/** Valeur brute du cookie (chaîne stable, utilisable comme instantané de useSyncExternalStore). */
export const readConsentRaw = () =>
  document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${CONSENT_COOKIE}=`))
    ?.slice(CONSENT_COOKIE.length + 1) ?? ''

export const parseConsent = (raw: string | null): Consent | null => {
  if (!raw) return null
  try {
    return JSON.parse(decodeURIComponent(raw)) as Consent
  } catch {
    return null
  }
}

export const subscribeConsent = (onChange: () => void) => {
  window.addEventListener(CONSENT_CHANGE_EVENT, onChange)
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange)
}

export const writeConsent = (consent: Consent) => {
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(consent))}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax`
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: consent }))
}
