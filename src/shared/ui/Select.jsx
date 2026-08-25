export function Select({ className = '', children, ...props }) {
  return (
    <select
      className={`h-10 w-full rounded-md border bg-background px-3 text-sm shadow-xs focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}
