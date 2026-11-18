const { kv } = require('@vercel/kv')

module.exports = async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'DELETE') {
    await kv.del(`reservation:${id}`)
    return res.json({ ok: true })
  }

  if (req.method !== 'POST') return res.status(405).end()

  try {
    const result = await kv.set(
      `reservation:${id}`,
      { reserved: true, reservedAt: new Date().toISOString() },
      { nx: true }
    )

    if (result === null) {
      return res.status(409).json({ error: 'Already reserved' })
    }

    res.json({ ok: true })
  } catch (err) {
    console.error('Error reserving gift:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
