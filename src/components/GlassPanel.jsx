import clsx from "clsx";

export default function GlassPanel({ className = "", children, str_tint = "" }) {
  const str_cn_tint =
    str_tint === "purple"
      ? "bg-gradient-to-br from-fuchsia-500/[0.07] via-white/[0.04] to-violet-500/[0.06]"
      : str_tint === "blue"
        ? "bg-gradient-to-br from-cyan-500/[0.07] via-white/[0.04] to-blue-500/[0.06]"
        : "bg-white/[0.045]";

  return (
    <div
      className={clsx(
        "rounded-2xl border border-white/14 backdrop-blur-md",
        "shadow-[0_12px_30px_rgba(0,0,0,0.42)]",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
        str_cn_tint,
        className
      )}
    >
      {children}
    </div>
  );
}
