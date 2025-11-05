import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

export interface StyledInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

export const StyledInput = forwardRef<HTMLInputElement, StyledInputProps>(
  ({ className, containerClassName, ...props }, ref) => {
    return (
      <div className={cn("relative", containerClassName)}>
        <Input
          ref={ref}
          className={cn(
            "bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl h-14",
            "text-white placeholder:text-white/40",
            "focus:border-white/30 focus:ring-0",
            "text-base transition-all duration-200",
            "hover:bg-black/30 focus:bg-black/30",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

StyledInput.displayName = "StyledInput";
