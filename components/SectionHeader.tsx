import React from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  heading: string;
  intro?: string;
  align?: "left" | "center";
  invert?: boolean;
  as?: "h2" | "h3";
  headingClassName?: string;
}

export default function SectionHeader({
  eyebrow,
  heading,
  intro,
  align = "left",
  invert = false,
  as = "h2",
  headingClassName = "",
}: SectionHeaderProps) {
  const Tag = as;
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";
  const eyebrowCls = invert ? "text-white/70" : "text-primary";
  const introCls = invert ? "text-white/75" : "text-ink/70";
  const headingCls = invert ? "text-white" : "text-ink";

  return (
    <div className={`max-w-3xl ${alignCls}`}>
      {eyebrow && (
        <p className={`text-eyebrow ${eyebrowCls} mb-4 ${align === "center" ? "" : ""}`}>
          <span className={`inline-block h-[1px] w-8 align-middle mr-3 ${invert ? "bg-white/40" : "bg-primary/60"}`} />
          {eyebrow}
        </p>
      )}
      <Tag
        className={`font-display font-light tracking-tightest leading-[1.05] text-4xl md:text-5xl lg:text-6xl ${headingCls} ${headingClassName}`}
      >
        {heading}
      </Tag>
      {intro && (
        <p className={`mt-6 text-lg md:text-xl leading-relaxed ${introCls}`}>{intro}</p>
      )}
    </div>
  );
}
