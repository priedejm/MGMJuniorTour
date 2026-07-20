import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  invert = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  invert?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-14",
        align === "center" && "text-center",
        className,
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "text-xs font-bold uppercase tracking-[0.2em] mb-3",
            invert ? "text-gold" : "text-gold",
          )}
        >
          {eyebrow}
        </div>
      )}
      <h2
        className={cn(
          "font-display font-black uppercase text-4xl md:text-5xl tracking-tight leading-[1.05]",
          invert ? "text-white" : "text-navy",
        )}
      >
        {title}
      </h2>
      <div
        className={cn(
          "h-1 w-20 bg-gold mt-5",
          align === "center" && "mx-auto",
        )}
      />
      {subtitle && (
        <p
          className={cn(
            "mt-6 text-lg leading-relaxed max-w-2xl",
            align === "center" && "mx-auto",
            invert ? "text-slate-300" : "text-slate-600",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}