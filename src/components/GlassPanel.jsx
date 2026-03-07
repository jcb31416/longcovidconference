import clsx from "clsx";

export default function GlassPanel({ className = "", children, str_tint = "" }) {
  const str_cn_tint =
    str_tint === "purple"
      ? "bg-gradient-to-br from-fuchsia-500/[0.05] via-white/[0.02] to-violet-500/[0.04]"
      : str_tint === "blue"
        ? "bg-gradient-to-br from-cyan-500/[0.05] via-white/[0.02] to-blue-500/[0.04]"
        : "bg-black/30";

  return (
    <div
      className={clsx(
        "rounded-2xl border border-white/10 backdrop-blur-md",
        "shadow-[0_12px_30px_rgba(0,0,0,0.55)]",
        str_cn_tint,
        className
      )}
    >
      {children}
    </div>
  );
}
