import { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface SkeletonBlockProps {
  shape?: "rect" | "circle";
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: CSSProperties;
}

export function SkeletonBlock({
  shape = "rect",
  width,
  height,
  className,
  style,
}: SkeletonBlockProps) {
  return (
    <div
      className={cn(
        "skeleton bg-muted animate-pulse",
        shape === "circle" && "rounded-full",
        shape === "rect" && "rounded-md",
        className
      )}
      style={{
        width: width ?? "100%",
        height: height ?? "100%",
        aspectRatio: !width || !height ? "1 / 1" : undefined,
        ...style,
      }}
      aria-hidden="true"
    />
  );
}