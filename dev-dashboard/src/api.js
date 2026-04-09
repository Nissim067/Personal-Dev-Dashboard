const DEFAULT_BASE_URL =
  (typeof import.meta !== 'undefined' &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE_URL) ||
  'http://localhost:3001'

export async function fetchGithubUser(username) {
  const safeUsername = String(username || '').trim()
  if (!safeUsername) {
    throw new Error('Username is required')
  }

  const res = await fetch(
    `${DEFAULT_BASE_URL}/github/${encodeURIComponent(safeUsername)}`,
    {
      headers: {
        Accept: 'application/json',
      },
    },
  )

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) || `Request failed (${res.status})`
    const err = new Error(message)
    err.status = res.status
    err.data = data
    throw err
  }

  return data
}

export async function askAI(prompt) {
  const safePrompt = String(prompt || '').trim()
  if (!safePrompt) {
    throw new Error('Prompt is required')
  }

  const res = await fetch(`${DEFAULT_BASE_URL}/ai`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt: safePrompt }),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) || `Request failed (${res.status})`
    const err = new Error(message)
    err.status = res.status
    err.data = data
    throw err
  }

  return data
}

