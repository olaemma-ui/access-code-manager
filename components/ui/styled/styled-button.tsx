import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface StyledButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "social";
  isLoading?: boolean;
}

export const StyledButton = forwardRef<HTMLButtonElement, StyledButtonProps>(
  ({ className, variant = "primary", isLoading, children, ...props }, ref) => {
    const baseStyles =
      "rounded-2xl h-14 text-base transition-all duration-300 transform";

    const variants = {
      primary:
        "w-full bg-white/20 backdrop-blur-sm border border-white/20 hover:bg-white/30 text-white font-medium hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]",
      social:
        "bg-black/20 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/30 hover:scale-105 hover:shadow-lg active:scale-95",
    };

    return (
      <Button
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? "Loading..." : children}
      </Button>
    );
  }
);

StyledButton.displayName = "StyledButton";
