const { kv } = require('@vercel/kv')

module.exports = async function handler(req, res) {
  const { id } = req.query

  if (req.method !== 'POST') return res.status(405).end()

  const { name } = req.body || {}
  if (!name || !String(name).trim()) {
    return res.status(400).json({ error: 'Name is required' })
  }

  try {
    // nx: true = only set if key does not already exist (atomic check-and-set)
    const result = await kv.set(
      `reservation:${id}`,
      { by: String(name).trim(), reservedAt: new Date().toISOString() },
      { nx: true }
    )

    if (result === null) {
      // Key already existed — gift was already reserved
      const existing = await kv.get(`reservation:${id}`)
      return res.status(409).json({
        error: 'Already reserved',
        by: existing?.by || 'quelqu\'un'
      })
    }

    res.json({ ok: true })
  } catch (err) {
    console.error('Error reserving gift:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
