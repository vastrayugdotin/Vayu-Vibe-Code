import * as React from "react";
import { cn } from "@/lib/utils";
import { PackageOpen } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  message?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  message,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex h-64 flex-col items-center justify-center gap-4 border border-dashed border-white/10 py-12",
        className,
      )}
    >
      <div className="text-eclipse-silver/60">
        {icon ?? <PackageOpen className="h-10 w-10" />}
      </div>
      {title && (
        <h3 className="font-heading text-lg text-stardust-white">{title}</h3>
      )}
      {message && (
        <p className="max-w-sm text-center font-body text-sm text-eclipse-silver">
          {message}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
