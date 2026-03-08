"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    variant?: "underline" | "pill"
  }
>(({ className, variant = "underline", ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center text-eclipse-silver",
      {
        "h-10 rounded-md bg-deep-indigo p-1": variant === "pill",
        "w-full justify-start border-b border-eclipse-silver/20":
          variant === "underline",
      },
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    variant?: "underline" | "pill"
  }
>(({ className, variant = "underline", ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium ring-offset-cosmic-black transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nebula-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      {
        "rounded-sm data-[state=active]:bg-void-black data-[state=active]:text-stardust-white data-[state=active]:shadow-sm":
          variant === "pill",
        "-mb-[1px] border-b-2 border-transparent hover:text-stardust-white data-[state=active]:border-nebula-gold data-[state=active]:text-nebula-gold":
          variant === "underline",
      },
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-cosmic-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nebula-gold focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
