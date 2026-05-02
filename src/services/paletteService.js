/** Production: set REACT_APP_API_URL in Netlify (e.g. https://your-api.onrender.com). Dev: leave unset so CRA proxy handles /api. */
const API_BASE = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');

export const generateColorPalette = async (businessIdea, lockedColors) => {
  const lockedColorsDescription = lockedColors
    .map((color, index) =>
      color ? `Color ${index + 1}: RGB(${color.join(',')})` : null
    )
    .filter(Boolean)
    .join(', ');

  const response = await fetch(`${API_BASE}/api/generate-palette`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userInput: businessIdea,
      lockedColors: lockedColors,
      lockedColorsDescription: lockedColorsDescription || undefined,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail =
      (typeof data.details === 'string' && data.details) ||
      (typeof data.error === 'string' && data.error) ||
      `Request failed (${response.status})`;
    const err = new Error(detail);
    err.status = response.status;
    err.payload = data;
    throw err;
  }

  return data;
};
