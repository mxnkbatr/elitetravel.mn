import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
};

/** Consistent horizontal + vertical rhythm for page sections */
export function Section({ children, className = "" }: SectionProps) {
  return (
    <div className={`px-4 sm:px-6 ${className}`.trim()}>{children}</div>
  );
}
