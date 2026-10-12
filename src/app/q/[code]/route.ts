import { NextResponse } from 'next/server'

import { getPayloadClient, getSettings } from '@/lib/payload'

type Ctx = { params: Promise<{ code: string }> }

const BOT = /bot|crawl|spider|preview|facebookexternalhit|slack|whatsapp|telegram|discord|linkedin|curl|wget/i

const deviceOf = (ua: string) => (/iPad|Tablet/i.test(ua) ? 'tablet' : /Mobi|Android|iPhone/i.test(ua) ? 'mobile' : 'desktop')

/** /q/[code] : compte le scan (hors robots d'aperçu) puis redirige vers la destination du QR code. */
export async function GET(req: Request, { params }: Ctx) {
  const { code } = await params
  const [payload, settings] = await Promise.all([getPayloadClient(), getSettings()])
  const { docs } = await payload.find({ collection: 'qr-codes', where: { code: { equals: code.toLowerCase() } }, limit: 1, depth: 0 })
  const qr = docs[0]

  const target = qr?.active ? qr.destination : '/'
  // Base publique des Réglages : derrière le proxy, req.url peut valoir http://0.0.0.0:3000
  const res = NextResponse.redirect(new URL(target, (process.env.NODE_ENV === 'production' && settings.siteUrl) || req.url), 302)
  res.headers.set('Cache-Control', 'no-store')

  const ua = req.headers.get('user-agent') ?? ''
  if (qr?.active && !BOT.test(ua)) {
    try {
      await payload.create({ collection: 'qr-scans', data: { qrCode: qr.id, device: deviceOf(ua) } })
      await payload.update({ collection: 'qr-codes', id: qr.id, data: { scans: (qr.scans ?? 0) + 1, lastScanAt: new Date().toISOString() } })
    } catch (err) {
      payload.logger.error({ err, msg: `Scan du QR code ${code} non enregistré` })
    }
  }
  return res
}
