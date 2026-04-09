import { useEffect, useMemo, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { Navbar } from './components/Navbar'
import { Sidebar } from './components/Sidebar'
import { WidgetCard } from './components/WidgetCard'
import { PomodoroTimer } from './components/PomodoroTimer'
import { askAI, fetchGithubUser } from './api'
import './App.css'

const TASKS_STORAGE_KEY = 'dev-dashboard.tasks'

function App() {
  const [count, setCount] = useState(0)
  const [username, setUsername] = useState('octocat')
  const [githubUser, setGithubUser] = useState(null)
  const [githubError, setGithubError] = useState('')
  const [githubLoading, setGithubLoading] = useState(false)

  const [aiPrompt, setAiPrompt] = useState('')
  const [aiReply, setAiReply] = useState('')
  const [aiError, setAiError] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  const [tasks, setTasks] = useState(() => {
    try {
      const raw = localStorage.getItem(TASKS_STORAGE_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) return []
      return parsed
        .filter((t) => t && typeof t === 'object')
        .map((t) => ({
          id: String(t.id ?? ''),
          text: String(t.text ?? ''),
          completed: Boolean(t.completed),
        }))
        .filter((t) => t.id && t.text)
    } catch {
      return []
    }
  })
  const [newTaskText, setNewTaskText] = useState('')

  async function handleGithubLookup(e) {
    e.preventDefault()
    setGithubError('')
    setGithubLoading(true)

    try {
      const data = await fetchGithubUser(username)
      setGithubUser(data)
    } catch (err) {
      setGithubUser(null)
      setGithubError(err?.message ?? 'Failed to fetch user')
    } finally {
      setGithubLoading(false)
    }
  }

  async function handleAskAI(e) {
    e.preventDefault()
    setAiError('')
    setAiLoading(true)

    try {
      const data = await askAI(aiPrompt)
      setAiReply(data?.reply ?? '')
      setAiPrompt('')
    } catch (err) {
      setAiReply('')
      setAiError(err?.message ?? 'AI request failed')
    } finally {
      setAiLoading(false)
    }
  }

  useEffect(() => {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
    } catch {
      // ignore write failures (private mode/quota/etc)
    }
  }, [tasks])

  const remainingCount = useMemo(
    () => tasks.reduce((acc, t) => acc + (t.completed ? 0 : 1), 0),
    [tasks],
  )

  function addTask(e) {
    e.preventDefault()
    const text = newTaskText.trim()
    if (!text) return

    const id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`

    setTasks((prev) => [{ id, text, completed: false }, ...prev])
    setNewTaskText('')
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    )
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <div className="dashboard-main">
        <div className="dashboard-content">
          <Navbar />

          <WidgetCard as="section" id="center">
            <div className="hero">
              <img
                src={heroImg}
                className="base"
                width="170"
                height="179"
                alt=""
              />
              <img src={reactLogo} className="framework" alt="React logo" />
              <img src={viteLogo} className="vite" alt="Vite logo" />
            </div>
            <div>
              <h1>Get started</h1>
              <p>
                Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
              </p>
            </div>
            <button
              className="counter"
              onClick={() => setCount((count) => count + 1)}
            >
              Count is {count}
            </button>
          </WidgetCard>

          <div className="ticks"></div>

          <section id="next-steps">
            <WidgetCard
              id="docs"
              icon={
                <svg className="icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#documentation-icon"></use>
                </svg>
              }
              title="Documentation"
            >
              <p>Your questions, answered</p>
              <form className="github-form" onSubmit={handleGithubLookup}>
                <input
                  className="github-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="GitHub username"
                  aria-label="GitHub username"
                />
                <button className="github-button" type="submit" disabled={githubLoading}>
                  {githubLoading ? 'Loading…' : 'Fetch'}
                </button>
              </form>
              {githubError ? <p className="github-error">{githubError}</p> : null}
              {githubUser ? (
                <div className="github-result">
                  <div className="github-name">
                    {githubUser.name || githubUser.login}
                  </div>
                  <div className="github-stats">
                    <span>
                      <strong>{githubUser.followers}</strong> followers
                    </span>
                    <span>
                      <strong>{githubUser.public_repos}</strong> repos
                    </span>
                  </div>
                </div>
              ) : null}
              <ul>
                <li>
                  <a href="https://vite.dev/" target="_blank">
                    <img className="logo" src={viteLogo} alt="" />
                    Explore Vite
                  </a>
                </li>
                <li>
                  <a href="https://react.dev/" target="_blank">
                    <img className="button-icon" src={reactLogo} alt="" />
                    Learn more
                  </a>
                </li>
              </ul>
            </WidgetCard>

            <WidgetCard
              id="focus-timer"
              icon={
                <svg className="icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#documentation-icon"></use>
                </svg>
              }
              title="Focus Timer"
            >
              <p>25-minute Pomodoro session</p>
              <PomodoroTimer />
            </WidgetCard>

            <WidgetCard
              id="ai-assistant"
              icon={
                <svg className="icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#documentation-icon"></use>
                </svg>
              }
              title="AI Assistant"
            >
              <p>Your questions, answered</p>
              <form className="github-form" onSubmit={handleAskAI}>
                <input
                  className="github-input"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ask AI..."
                  aria-label="Ask AI"
                />
                <button className="github-button" type="submit" disabled={aiLoading}>
                  {aiLoading ? 'Thinking...' : 'Ask AI'}
                </button>
              </form>
              {aiError ? <p className="github-error">{aiError}</p> : null}
              {aiReply ? <div className="github-result">{aiReply}</div> : null}
            </WidgetCard>

            <WidgetCard
              id="tasks"
              icon={
                <svg className="icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#social-icon"></use>
                </svg>
              }
              title="Tasks"
            >
              <p>
                {tasks.length === 0
                  ? 'No tasks yet'
                  : `${remainingCount} remaining`}
              </p>
              <form className="tasks-form" onSubmit={addTask}>
                <input
                  className="tasks-input"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="Add a task…"
                  aria-label="Add a task"
                />
                <button className="tasks-button" type="submit">
                  Add
                </button>
              </form>

              <ul className="tasks-list" aria-label="Tasks">
                {tasks.map((t) => (
                  <li key={t.id} className={t.completed ? 'is-complete' : ''}>
                    <label className="tasks-item">
                      <input
                        type="checkbox"
                        checked={t.completed}
                        onChange={() => toggleTask(t.id)}
                      />
                      <span>{t.text}</span>
                    </label>
                    <button
                      className="tasks-delete"
                      type="button"
                      onClick={() => deleteTask(t.id)}
                      aria-label={`Delete task: ${t.text}`}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </WidgetCard>
          </section>

          <div className="ticks"></div>
          <section id="spacer"></section>
        </div>
      </div>
    </div>
  )
}

export default App
