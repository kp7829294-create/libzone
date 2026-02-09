import { cn } from "@/lib/utils";

export function Spinner({ className }) {
  return (
    <div
      className={cn("animate-spin rounded-full border-2 border-primary border-t-transparent", className)}
      role="status"
      aria-label="Loading"
    />
  );
}
