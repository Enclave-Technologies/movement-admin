import React, { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface LinkWithUnsavedCheckProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  hasUnsavedChanges: boolean;
  onNavigate: () => void;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
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
  onClick,
}) => {
  const router = useRouter();
  
  // Capture navigation clicks
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    // First call the original onClick if provided
    if (onClick) {
      onClick(e);
    }

    // If already prevented, don't continue
    if (e.defaultPrevented) return;

    // If nothing to check, proceed as normal for external links
    if (!hasUnsavedChanges && (href.startsWith('http') || href.startsWith('#'))) {
      return; // Let default navigation happen
    }

    // Always prevent default link behavior
    e.preventDefault();
    
    // Check for unsaved changes
    if (hasUnsavedChanges) {
      // Show warning using passed onNavigate
      onNavigate();
    } else {
      // No unsaved changes, navigate directly
      router.push(href);
    }
  }, [hasUnsavedChanges, href, onClick, onNavigate, router]);

  // For debugging
  useEffect(() => {
    console.log('LinkWithUnsavedCheck rendering with href:', href);
  }, [href]);

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
};

export default LinkWithUnsavedCheck; 