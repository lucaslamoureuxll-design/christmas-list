const { kv } = require('@vercel/kv')

const GIFT_IDS = [
  'knit-808', 'pull-rose-scuffers', 'pull-mariniere-scuffers',
  'clavier-logitech', 'jogging-divinbydivin', 'akimbo-lows',
  'pantalon-camo-beige', 'jean-camo-gris'
]

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  try {
    const entries = await Promise.all(
      GIFT_IDS.map(async id => {
        const data = await kv.get(`reservation:${id}`)
        return [id, data]
      })
    )
    res.setHeader('Cache-Control', 'no-store')
    res.json(Object.fromEntries(entries))
  } catch (err) {
    console.error('Error fetching reservations:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
