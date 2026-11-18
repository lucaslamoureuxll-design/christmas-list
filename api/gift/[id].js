const { kv } = require('@vercel/kv')
const { randomUUID } = require('crypto')

module.exports = async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'DELETE') {
    const { token } = req.body || {}
    if (!token) return res.status(403).json({ error: 'Token required' })
    const stored = await kv.get(`reservation:${id}`)
    if (!stored || stored.token !== token) return res.status(403).json({ error: 'Invalid token' })
    await kv.del(`reservation:${id}`)
    return res.json({ ok: true })
  }

  if (req.method !== 'POST') return res.status(405).end()

  try {
    const token = randomUUID()
    const result = await kv.set(
      `reservation:${id}`,
      { reserved: true, reservedAt: new Date().toISOString(), token },
      { nx: true }
    )

    if (result === null) {
      return res.status(409).json({ error: 'Already reserved' })
    }

    res.json({ ok: true, token })
  } catch (err) {
    console.error('Error reserving gift:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
