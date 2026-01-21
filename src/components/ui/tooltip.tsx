'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

// Simple tooltip implementation without radix-ui
const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>

interface TooltipProps {
  children: React.ReactNode
}

const Tooltip = ({ children }: TooltipProps) => (
  <div className="relative inline-block">{children}</div>
)

const TooltipTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button ref={ref} className={cn('', className)} {...props} />
))
TooltipTrigger.displayName = 'TooltipTrigger'

interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  sideOffset?: number
}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ className, sideOffset = 4, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground',
        className
      )}
      {...props}
    />
  )
)
TooltipContent.displayName = 'TooltipContent'

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
