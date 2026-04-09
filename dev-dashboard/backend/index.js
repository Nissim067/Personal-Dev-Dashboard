const express = require('express')
const cors = require('cors')
const axios = require('axios')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

app.get('/github/:username', async (req, res) => {
  const { username } = req.params

  try {
    const response = await axios.get(`https://api.github.com/users/${username}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'personal-dev-dashboard',
      },
      validateStatus: () => true,
    })

    if (response.status >= 400) {
      return res.status(response.status).json({
        error: 'GitHub API request failed',
        status: response.status,
        data: response.data,
      })
    }

    return res.json(response.data)
  } catch (err) {
    return res.status(500).json({
      error: 'Unexpected server error',
      message: err?.message ?? String(err),
    })
  }
})

app.post('/ai', async (req, res) => {
  const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : ''

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Server missing OPENAI_API_KEY' })
  }

  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini'

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/responses',
      {
        model,
        input: prompt,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        validateStatus: () => true,
      },
    )

    if (response.status >= 400) {
      return res.status(response.status).json({
        error: 'AI request failed',
        status: response.status,
        data: response.data,
      })
    }

    const data = response.data || {}
    const reply =
      (typeof data.output_text === 'string' && data.output_text) ||
      (Array.isArray(data.output) &&
        data.output
          .flatMap((o) => (Array.isArray(o?.content) ? o.content : []))
          .filter((c) => c?.type === 'output_text' && typeof c.text === 'string')
          .map((c) => c.text)
          .join('\n')
          .trim()) ||
      ''

    return res.json({ reply })
  } catch (err) {
    return res.status(500).json({
      error: 'Unexpected server error',
      message: err?.message ?? String(err),
    })
  }
})

const port = process.env.PORT ? Number(process.env.PORT) : 3001
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`)
})

