import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  href = "/",
  dark = false,
}: {
  href?: string;
  dark?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "font-display text-xl font-semibold tracking-tight",
        dark ? "text-paper" : "text-pine-900",
      )}
    >
      AUI Carpool
    </Link>
  );
}
