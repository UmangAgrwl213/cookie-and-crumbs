"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnnouncementBarProps {
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function AnnouncementBar({ message, dismissible = true, onDismiss }: AnnouncementBarProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className={cn(
        "w-full py-2 px-4 text-center text-sm font-medium bg-primary text-primary-foreground",
        "transition-opacity duration-200"
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-center gap-4">
        <span>{message}</span>
        {dismissible && (
          <button
            onClick={() => {
              setDismissed(true);
              onDismiss?.();
            }}
            className="p-1 rounded hover:bg-primary/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-foreground"
            aria-label="Dismiss announcement"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}