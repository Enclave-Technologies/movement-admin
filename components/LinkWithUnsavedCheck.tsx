import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface LinkWithUnsavedCheckProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  hasUnsavedChanges: boolean;
  onNavigate: () => void;
}

/**
 * A Link component that checks for unsaved changes before navigation
 */
const LinkWithUnsavedCheck: React.FC<LinkWithUnsavedCheckProps> = ({
  href,
  children,
  className,
  hasUnsavedChanges,
  onNavigate,
}) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      onNavigate();
    }
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
};

export default LinkWithUnsavedCheck; 