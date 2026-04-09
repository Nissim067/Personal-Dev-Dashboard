import { useEffect, useRef, useState } from 'react'

const DEFAULT_SECONDS = 25 * 60

function formatTime(totalSeconds) {
  const s = Math.max(0, Number(totalSeconds) || 0)
  const mm = String(Math.floor(s / 60)).padStart(2, '0')
  const ss = String(Math.floor(s % 60)).padStart(2, '0')
  return `${mm}:${ss}`
}

export function PomodoroTimer() {
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_SECONDS)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!isRunning) return

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [isRunning])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  function handleStart() {
    if (secondsLeft <= 0) setSecondsLeft(DEFAULT_SECONDS)
    setIsRunning(true)
  }

  function handlePause() {
    setIsRunning(false)
  }

  function handleReset() {
    setIsRunning(false)
    setSecondsLeft(DEFAULT_SECONDS)
  }

  return (
    <div className="pomodoro">
      <div className="pomodoro-time" aria-label="Time remaining">
        {formatTime(secondsLeft)}
      </div>
      <div className="pomodoro-controls">
        {isRunning ? (
          <button className="pomodoro-button" type="button" onClick={handlePause}>
            Pause
          </button>
        ) : (
          <button className="pomodoro-button" type="button" onClick={handleStart}>
            Start
          </button>
        )}
        <button className="pomodoro-button" type="button" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  )
}

