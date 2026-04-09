const NAV_ITEMS = [
  { label: 'Get started', href: '#center' },
  { label: 'Documentation', href: '#docs' },
  { label: 'Connect', href: '#social' },
]

export function Sidebar() {
  return (
    <aside className="dashboard-sidebar" aria-label="Primary">
      <nav className="dashboard-sidebar-nav">
        <ul>
          {NAV_ITEMS.map(({ label, href }) => (
            <li key={href}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
