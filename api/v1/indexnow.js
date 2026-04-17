const sanitizeUrl = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  try {
    const url = new URL(raw);
    return url.toString();
  } catch {
    return '';
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const key = process.env.INDEXNOW_KEY;
  const host = process.env.SITE_HOST;
  const keyLocation = process.env.INDEXNOW_KEY_LOCATION;
  if (!key || !host || !keyLocation) {
    return res.status(500).json({
      error: 'IndexNow is not configured. Set INDEXNOW_KEY, SITE_HOST, and INDEXNOW_KEY_LOCATION.',
    });
  }

  const payload = req.body || {};
  const urls = Array.isArray(payload.urls) ? payload.urls.map(sanitizeUrl).filter(Boolean).slice(0, 10000) : [];

  if (urls.length === 0) {
    return res.status(400).json({ error: 'No valid URLs provided.' });
  }

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key,
        keyLocation,
        urlList: urls,
      }),
    });

    const text = await response.text();
    if (!response.ok) {
      return res.status(502).json({ error: text.slice(0, 300) || 'IndexNow upstream error' });
    }

    return res.status(200).json({ submitted: urls.length, result: text || 'ok' });
  } catch (error) {
    console.error('indexnow error', error);
    return res.status(500).json({ error: 'Failed to submit IndexNow request' });
  }
}
