const variants = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/85',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/75',
  outline: 'border bg-background hover:bg-accent',
  danger: 'bg-destructive text-white hover:bg-destructive/85',
}

const sizes = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-6 text-sm',
}

export function Button({
  className = '',
  size = 'md',
  variant = 'primary',
  type = 'button',
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium shadow-sm transition-[color,background-color,transform,box-shadow] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 motion-reduce:transform-none ${variants[variant]} ${sizes[size]} ${className}`}
      type={type}
      {...props}
    />
  )
}
