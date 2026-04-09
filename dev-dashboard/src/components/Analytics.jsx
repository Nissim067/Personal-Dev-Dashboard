import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'
import { useMemo } from 'react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
)

const STORAGE_KEY = 'dev-dashboard.productivity'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function readProductivity() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { tasksCompleted: {}, focusTime: {} }
    const parsed = JSON.parse(raw)
    return {
      tasksCompleted: parsed?.tasksCompleted && typeof parsed.tasksCompleted === 'object' ? parsed.tasksCompleted : {},
      focusTime: parsed?.focusTime && typeof parsed.focusTime === 'object' ? parsed.focusTime : {},
    }
  } catch {
    return { tasksCompleted: {}, focusTime: {} }
  }
}

function sortedKeys(obj) {
  return Object.keys(obj || {}).sort()
}

export function Analytics() {
  const data = useMemo(() => readProductivity(), [])

  const taskDates = useMemo(() => sortedKeys(data.tasksCompleted), [data.tasksCompleted])
  const focusDates = useMemo(() => sortedKeys(data.focusTime), [data.focusTime])
  const allDates = useMemo(() => Array.from(new Set([...taskDates, ...focusDates])).sort(), [taskDates, focusDates])

  const tasksSeries = useMemo(
    () => allDates.map((d) => Number(data.tasksCompleted?.[d] || 0)),
    [allDates, data.tasksCompleted],
  )
  const focusSeries = useMemo(
    () => allDates.map((d) => Number(data.focusTime?.[d] || 0)),
    [allDates, data.focusTime],
  )

  const today = todayKey()
  const todayTasks = Number(data.tasksCompleted?.[today] || 0)
  const todayFocus = Number(data.focusTime?.[today] || 0)

  const barData = useMemo(
    () => ({
      labels: allDates,
      datasets: [
        {
          label: 'Tasks Completed',
          data: tasksSeries,
          backgroundColor: 'rgba(170, 59, 255, 0.35)',
          borderColor: 'rgba(170, 59, 255, 0.9)',
          borderWidth: 1,
        },
      ],
    }),
    [allDates, tasksSeries],
  )

  const lineData = useMemo(
    () => ({
      labels: allDates,
      datasets: [
        {
          label: 'Focus Time (minutes)',
          data: focusSeries,
          borderColor: 'rgba(170, 59, 255, 0.9)',
          backgroundColor: 'rgba(170, 59, 255, 0.15)',
          tension: 0.25,
          pointRadius: 2,
        },
      ],
    }),
    [allDates, focusSeries],
  )

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true },
      },
      scales: {
        x: { ticks: { maxRotation: 0, autoSkip: true } },
        y: { beginAtZero: true },
      },
    }),
    [],
  )

  return (
    <div>
      <p>
        <strong>{todayTasks}</strong> tasks completed today · <strong>{todayFocus}</strong> minutes focused today
      </p>
      <div style={{ height: 180, marginTop: 12 }}>
        <Bar data={barData} options={options} />
      </div>
      <div style={{ height: 180, marginTop: 16 }}>
        <Line data={lineData} options={options} />
      </div>
    </div>
  )
}

