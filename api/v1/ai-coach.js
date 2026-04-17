const WINDOW_MS = 5 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;
const MIN_INTERVAL_MS = 30 * 1000;
const rateStore = new Map();

const sanitizeText = (value, maxLength = 300) => {
  return String(value || '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
};

const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
};

const checkRateLimit = (ip) => {
  const now = Date.now();
  const existing = rateStore.get(ip) || { count: 0, windowStart: now, lastRequestAt: 0 };

  if (now - existing.windowStart > WINDOW_MS) {
    existing.count = 0;
    existing.windowStart = now;
  }

  if (now - existing.lastRequestAt < MIN_INTERVAL_MS) {
    return { allowed: false, status: 429, message: 'Cooldown active. Try again in a moment.' };
  }

  if (existing.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, status: 429, message: 'Too many requests. Please wait before retrying.' };
  }

  existing.count += 1;
  existing.lastRequestAt = now;
  rateStore.set(ip, existing);
  return { allowed: true };
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server AI key is not configured' });
  }

  const ip = getClientIp(req);
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    return res.status(limit.status).json({ error: limit.message });
  }

  const body = req.body || {};
  const habits = Array.isArray(body.habits) ? body.habits.join(', ') : body.habits;
  const habitsSummary = sanitizeText(habits || 'The user has no habits yet.', 1200);
  const currentDate = sanitizeText(body.currentDate || '', 20);

  const prompt = `User habits context: [${habitsSummary}]. Current date: ${currentDate}. Task: Provide a brutal, elite, high-performance coaching quote (max 12 words). No emojis. No preamble. Be unique and creative each time.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(502).json({ error: `AI upstream failed: ${text.slice(0, 200)}` });
    }

    const data = await response.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const quote = sanitizeText(raw.replace(/^"|"$/g, ''), 140) || 'Excellence is not an act, but a habit.';
    return res.status(200).json({ quote });
  } catch (error) {
    console.error('ai-coach error', error);
    return res.status(500).json({ error: 'Unable to generate coaching right now' });
  }
}
