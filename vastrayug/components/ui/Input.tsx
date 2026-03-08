import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type = "text", label, error, helperText, id, ...props },
    ref,
  ) => {
    // Generate an ID if one wasn't provided so we can link label/input/error for accessibility
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-stardust-white"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border bg-deep-indigo px-3 py-2 text-sm text-stardust-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-eclipse-silver focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nebula-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cosmic-black disabled:cursor-not-allowed disabled:opacity-50",
              error
                ? "border-red-400 focus-visible:ring-red-400"
                : "border-eclipse-silver/30",
              className,
            )}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            {...props}
          />
        </div>
        {error && (
          <p
            id={errorId}
            className="mt-1.5 text-sm font-medium text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="mt-1.5 text-sm text-eclipse-silver">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
