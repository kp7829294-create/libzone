"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const PasswordInput = React.forwardRef(({ className, ...props }, ref) => {
  const [visible, setVisible] = React.useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setVisible((p) => !p);
  };

  return (
    <div className="relative w-full">
      <Input
        ref={ref}
        type={visible ? "text" : "password"}
        className={cn("pr-12 min-h-[44px] touch-manipulation", className)}
        {...props}
      />
      <button
        type="button"
        onClick={handleClick}
        className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 min-w-[44px] min-h-[44px] text-slate-400 hover:text-slate-600 active:text-slate-700 transition-colors rounded-lg hover:bg-slate-100 active:bg-slate-200 touch-manipulation z-10 select-none"
        aria-label={visible ? "Hide password" : "Show password"}
        tabIndex={-1}
      >
        {visible ? (
          <EyeOff className="h-5 w-5 shrink-0" aria-hidden />
        ) : (
          <Eye className="h-5 w-5 shrink-0" aria-hidden />
        )}
      </button>
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";
