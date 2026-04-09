const express = require('express')
const cors = require('cors')
const axios = require('axios')

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

const port = process.env.PORT ? Number(process.env.PORT) : 3001
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`)
})

