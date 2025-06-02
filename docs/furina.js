export default async function handler(req, res) {
  const { content, user } = req.query;

  const aiResult = await fetchExternalAI(content, user);
  res.status(200).json({ status: true, creator: "@Kyzryzz", result: { message: aiResult } });
}
