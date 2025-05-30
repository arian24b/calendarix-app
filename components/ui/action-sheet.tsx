"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ActionSheet = SheetPrimitive.Root

const ActionSheetTrigger = SheetPrimitive.Trigger

const ActionSheetClose = SheetPrimitive.Close

const ActionSheetPortal = SheetPrimitive.Portal

const ActionSheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
ActionSheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const actionSheetVariants = cva(
  "fixed z-50 gap-4 bg-background shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        bottom:
          "inset-x-0 bottom-0 rounded-t-2xl border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        top: "inset-x-0 top-0 rounded-b-2xl border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
      },
    },
    defaultVariants: {
      side: "bottom",
    },
  }
)

export interface ActionSheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof actionSheetVariants> {}

const ActionSheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  ActionSheetContentProps
>(({ side = "bottom", className, children, ...props }, ref) => (
  <ActionSheetPortal>
    <ActionSheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(actionSheetVariants({ side }), className)}
      {...props}
    >
      {/* Handle bar for mobile UX */}
      {side === "bottom" && (
        <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-gray-300" />
      )}
      {children}
    </SheetPrimitive.Content>
  </ActionSheetPortal>
))
ActionSheetContent.displayName = SheetPrimitive.Content.displayName

const ActionSheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left px-6 pt-2 pb-4",
      className
    )}
    {...props}
  />
)
ActionSheetHeader.displayName = "ActionSheetHeader"

const ActionSheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 px-6 pb-6",
      className
    )}
    {...props}
  />
)
ActionSheetFooter.displayName = "ActionSheetFooter"

const ActionSheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
))
ActionSheetTitle.displayName = SheetPrimitive.Title.displayName

const ActionSheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
ActionSheetDescription.displayName = SheetPrimitive.Description.displayName

const ActionSheetItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    destructive?: boolean
  }
>(({ className, destructive, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "flex w-full items-center px-6 py-4 text-base font-medium transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none text-left",
      destructive && "text-red-600 hover:bg-red-50 focus:bg-red-50",
      className
    )}
    {...props}
  >
    {children}
  </button>
))
ActionSheetItem.displayName = "ActionSheetItem"

const ActionSheetSeparator = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("h-px bg-border", className)}
    {...props}
  />
)
ActionSheetSeparator.displayName = "ActionSheetSeparator"

export {
  ActionSheet,
  ActionSheetPortal,
  ActionSheetOverlay,
  ActionSheetTrigger,
  ActionSheetClose,
  ActionSheetContent,
  ActionSheetHeader,
  ActionSheetFooter,
  ActionSheetTitle,
  ActionSheetDescription,
  ActionSheetItem,
  ActionSheetSeparator,
}
