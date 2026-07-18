import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  tone = "sand",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "sand" | "lavender" | "gold" | "green" | "gray";
}) {
  const tones = {
    sand: "bg-sand-100 text-sand-500",
    lavender: "bg-lavender-100 text-lavender-500",
    gold: "bg-gold-300/30 text-gold-600",
    green: "bg-emerald-100 text-emerald-700",
    gray: "bg-stone-100 text-muted",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
