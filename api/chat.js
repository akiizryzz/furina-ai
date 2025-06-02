export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' })
    return
  }
  const content = req.method === 'GET' ? req.query.content : req.body.content
  const user = req.method === 'GET' ? req.query.user : req.body.user
  if (!content) {
    res.status(400).json({ status: false, message: 'Missing "content" parameter' })
    return
  }
  try {
    const apiUrl = `https://www.furinnteam.web.id/ai/furina?content=${encodeURIComponent(content)}&user=${encodeURIComponent(user || 'user')}`
    const response = await fetch(apiUrl)
    const data = await response.json()
    res.status(200).json({ status: true, statusText: 'OK', statusCode: 200, result: { message: data.result.message }, creator: 'furinn.team' })
  } catch (error) {
    res.status(500).json({ status: false, message: error.message })
  }
}
