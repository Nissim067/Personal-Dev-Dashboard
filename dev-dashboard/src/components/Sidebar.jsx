const NAV_ITEMS = [
  { label: 'Get started', href: '#center' },
  { label: 'Documentation', href: '#docs' },
  { label: 'Focus Timer', href: '#focus-timer' },
  { label: 'Connect', href: '#social' },
]

export function Sidebar() {
  function handleNavClick(e, href) {
    if (typeof href !== 'string' || !href.startsWith('#')) return

    const el = document.querySelector(href)
    if (!el) return

    e.preventDefault()

    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    el.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    })

    // Keep the URL hash in sync for refresh/back button.
    if (window.location.hash !== href) {
      window.history.pushState(null, '', href)
    }
  }

  return (
    <aside className="dashboard-sidebar" aria-label="Primary">
      <nav className="dashboard-sidebar-nav">
        <ul>
          {NAV_ITEMS.map(({ label, href }) => (
            <li key={href}>
              <a href={href} onClick={(e) => handleNavClick(e, href)}>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
