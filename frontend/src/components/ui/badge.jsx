import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-accent text-neutral-950 hover:bg-accent/80",
        secondary:
          "border-transparent bg-surface text-primary hover:bg-surface/80",
        outline:
          "border-line text-text-muted hover:border-accent/40 hover:text-primary",
        cyber:
          "border-accent/30 bg-accent/10 text-accent hover:border-accent/60 hover:bg-accent/20",
        dark:
          "border-[#1F1F2E] bg-[#0B0B12] text-text-muted hover:text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
