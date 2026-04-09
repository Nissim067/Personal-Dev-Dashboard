import { useEffect, useRef, useState } from 'react'

const DEFAULT_SECONDS = 25 * 60

function formatTime(totalSeconds) {
  const s = Math.max(0, Number(totalSeconds) || 0)
  const mm = String(Math.floor(s / 60)).padStart(2, '0')
  const ss = String(Math.floor(s % 60)).padStart(2, '0')
  return `${mm}:${ss}`
}

export function PomodoroTimer({ onFocusSeconds }) {
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_SECONDS)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)
  const elapsedRef = useRef(0)

  useEffect(() => {
    if (!isRunning) return

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false)
          elapsedRef.current += 1
          return 0
        }
        elapsedRef.current += 1
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
      if (elapsedRef.current > 0) {
        onFocusSeconds?.(elapsedRef.current)
        elapsedRef.current = 0
      }
    }
  }, [])

  function handleStart() {
    if (secondsLeft <= 0) setSecondsLeft(DEFAULT_SECONDS)
    setIsRunning(true)
  }

  function handlePause() {
    setIsRunning(false)
    if (elapsedRef.current > 0) {
      onFocusSeconds?.(elapsedRef.current)
      elapsedRef.current = 0
    }
  }

  function handleReset() {
    setIsRunning(false)
    setSecondsLeft(DEFAULT_SECONDS)
    if (elapsedRef.current > 0) {
      onFocusSeconds?.(elapsedRef.current)
      elapsedRef.current = 0
    }
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

