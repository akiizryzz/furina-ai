export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ status: false, creator: "@Kyzryzz", message: 'Method Not Allowed' })
    return
  }
  const { content, user } = req.query
  if (!content) {
    res.status(400).json({ status: false, creator: "@Kyzryzz", message: 'Missing "content" parameter' })
    return
  }
  try {
    const apiUrl = `https://www.furinnteam.web.id/ai/furina?content=${encodeURIComponent(content)}&user=${encodeURIComponent(user || 'user')}`
    const response = await fetch(apiUrl)
    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ status: false, creator: "@Kyzryzz", message: error.message })
  }
}
