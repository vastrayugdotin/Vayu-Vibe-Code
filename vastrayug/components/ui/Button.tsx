import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-cosmic-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nebula-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            // Variants
            "bg-nebula-gold text-cosmic-black hover:bg-nebula-gold/90":
              variant === "primary",
            "border border-eclipse-silver bg-transparent text-stardust-white hover:bg-eclipse-silver/10":
              variant === "secondary",
            "bg-transparent text-stardust-white hover:bg-eclipse-silver/10 hover:text-stardust-white":
              variant === "ghost",
            "bg-red-400/10 text-red-400 hover:bg-red-400/20":
              variant === "destructive",
            // Sizes
            "h-9 px-3": size === "sm",
            "h-10 px-4 py-2": size === "md",
            "h-11 rounded-md px-8": size === "lg",
          },
          className
        )}
        {...props}
      >
        {isLoading && (
          <Spinner className="mr-2 h-4 w-4" aria-hidden="true" />
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }
