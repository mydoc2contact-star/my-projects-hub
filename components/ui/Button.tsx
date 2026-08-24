import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  href?: string;
  children?: ReactNode;
};

function buttonClassName(
  variant: NonNullable<ButtonProps["variant"]>,
  size: NonNullable<ButtonProps["size"]>,
  className?: string,
) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
    size === "sm" && "h-9 px-3 text-sm",
    size === "md" && "h-11 px-4 text-sm",
    size === "lg" && "h-12 px-5 text-base",
    variant === "primary" && "bg-primary text-white hover:bg-primary-hover",
    variant === "secondary" && "border border-line bg-white text-ink hover:bg-page",
    variant === "ghost" && "text-muted hover:bg-white hover:text-ink",
    variant === "danger" && "bg-red-700 text-white hover:bg-red-800",
    className,
  );
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  href,
  children,
  ...props
}: ButtonProps) {
  const classes = buttonClassName(variant, size, className);
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
