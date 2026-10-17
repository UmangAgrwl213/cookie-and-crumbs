"use client";

import { useToast } from "@/lib/hooks/use-toast";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" aria-live="polite" aria-label="Notifications">
      {toasts.map(({ id, title, description, variant, action }) => (
        <div
          key={id}
          className={cn(
            "flex items-start gap-3 w-full max-w-sm rounded-xl border bg-card p-4 shadow-lg animate-slide-in",
            "focus-visible:outline-none focus-visible:ring-2"
          )}
          role="alert"
        >
          <div className="flex-1">
            {title && <div className="font-semibold">{title}</div>}
            {description && <div className="text-sm text-muted-foreground mt-1">{description}</div>}
            {action && (
              <div className="mt-3">
                <button onClick={action.onClick} className="text-sm font-medium text-primary hover:underline">
                  {action.label}
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => { /* dismiss logic */ }}
            className="shrink-0 p-1 rounded hover:bg-muted focus-visible:ring-2"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}