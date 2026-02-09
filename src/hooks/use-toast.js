"use client";

import { toast as sonnerToast } from "sonner";

export function useToast() {
  const toast = (props) => {
    const { title, description, variant, className } = props || {};
    const message = description ? `${title}\n${description}` : title;
    if (variant === "destructive") {
      sonnerToast.error(title, { description });
    } else {
      sonnerToast.success(title, { description });
    }
  };

  return { toast };
}
