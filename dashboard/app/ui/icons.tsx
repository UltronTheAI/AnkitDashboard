import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { title?: string };

function BaseIcon({
  title,
  children,
  ...props
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : "presentation"}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function IconUser(props: IconProps) {
  return (
    <BaseIcon
      {...props}
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </BaseIcon>
  );
}

export function IconMail(props: IconProps) {
  return (
    <BaseIcon
      {...props}
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6h16v12H4z" />
      <path d="m4 7 8 6 8-6" />
    </BaseIcon>
  );
}

export function IconPhone(props: IconProps) {
  return (
    <BaseIcon
      {...props}
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 2h4l2 5-2 2c1.5 3 3.5 5 6.5 6.5l2-2 3.5 2v4c0 1-1 2-2 2C11 22 2 13 2 4c0-1 1-2 2-2h3z" />
    </BaseIcon>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <BaseIcon
      {...props}
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </BaseIcon>
  );
}

export function IconMoon(props: IconProps) {
  return (
    <BaseIcon
      {...props}
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 13a7 7 0 1 1-10-10 9 9 0 0 0 10 10Z" />
    </BaseIcon>
  );
}

export function IconSun(props: IconProps) {
  return (
    <BaseIcon
      {...props}
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />
    </BaseIcon>
  );
}

export function IconShield(props: IconProps) {
  return (
    <BaseIcon
      {...props}
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2 20 6v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4Z" />
    </BaseIcon>
  );
}

export function IconFileDown(props: IconProps) {
  return (
    <BaseIcon
      {...props}
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M12 12v6" />
      <path d="m9.5 15 2.5 3 2.5-3" />
    </BaseIcon>
  );
}

export function IconInstagram(props: IconProps) {
  return (
    <BaseIcon
      {...props}
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M17 7h.01" />
    </BaseIcon>
  );
}

export function IconBookmark(props: IconProps) {
  return (
    <BaseIcon
      {...props}
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 4h10a1 1 0 0 1 1 1v17l-6-4-6 4V5a1 1 0 0 1 1-1Z" />
    </BaseIcon>
  );
}
