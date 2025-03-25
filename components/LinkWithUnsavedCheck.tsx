import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface LinkWithUnsavedCheckProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  hasUnsavedChanges: boolean;
  onNavigationAttempt: (destination: string) => void;
}

const LinkWithUnsavedCheck: React.FC<LinkWithUnsavedCheckProps> = ({
  href,
  children,
  className,
  hasUnsavedChanges,
  onNavigationAttempt
}) => {
  const router = useRouter();
  
  const handleClick = (e: React.MouseEvent) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      onNavigationAttempt(href);
    }
  };
  
  return (
    <Link 
      href={href} 
      className={className}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
};

export default LinkWithUnsavedCheck; 