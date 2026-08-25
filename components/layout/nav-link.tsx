"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = {
  href: string;
  className?: string;
  activeClassName?: string;
  children: React.ReactNode;
};

/** Adds an active-state class when the current path matches the link's path (query/hash ignored). */
export function NavLink({ href, className = "", activeClassName = "", children }: NavLinkProps) {
  const pathname = usePathname();
  const targetPath = href.split("?")[0].split("#")[0] || "/";
  const isActive = pathname === targetPath;

  return (
    <Link href={href} className={`${className} ${isActive ? activeClassName : ""}`.trim()}>
      {children}
    </Link>
  );
}
