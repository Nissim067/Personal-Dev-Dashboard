export function WidgetCard({
  title,
  children,
  id,
  as: Component = 'div',
  icon,
  className,
}) {
  return (
    <Component id={id} className={className}>
      {icon}
      {title != null && title !== '' ? <h2>{title}</h2> : null}
      {children}
    </Component>
  )
}
