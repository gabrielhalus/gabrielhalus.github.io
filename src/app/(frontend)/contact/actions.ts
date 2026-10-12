'use server'

import { getPayloadClient } from '@/lib/payload'

export type ContactState = { status: 'idle' | 'success' | 'error'; message?: string; at?: number }

const TYPES = ['custom', 'offer', 'other'] as const

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const get = (key: string) => String(formData.get(key) ?? '').trim()

  // Champ piège : rempli uniquement par les robots
  if (get('website')) return { status: 'success', at: Date.now() }

  const requestType = get('requestType') as (typeof TYPES)[number]
  const name = get('name')
  const email = get('email')
  const message = get('message')

  if (!TYPES.includes(requestType) || !name || !email || !message || formData.get('consent') !== 'on') {
    return { status: 'error', message: 'Merci de remplir les champs obligatoires et d’accepter la politique de confidentialité.' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: 'error', message: 'L’adresse e-mail semble incomplète.' }
  }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'contact-requests',
      data: {
        requestType,
        name: name.slice(0, 200),
        email,
        company: get('company') || undefined,
        phone: get('phone') || undefined,
        offer: requestType === 'offer' ? get('offer') || undefined : undefined,
        budget: requestType === 'custom' ? get('budget') || undefined : undefined,
        message: message.slice(0, 5000),
        consent: true,
      },
    })
    return { status: 'success', at: Date.now() }
  } catch {
    return { status: 'error', message: 'L’envoi a échoué. Réessayez, ou écrivez-moi directement par e-mail.' }
  }
}
