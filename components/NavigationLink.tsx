import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type NavigationLinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
  checkUnsavedChanges: () => boolean;
  handleNavigation: (callback: () => void) => void;
};

/**
 * A navigation link that warns about unsaved changes before navigating
 * 
 * @param {NavigationLinkProps} props The component props
 * @returns A link component that checks for unsaved changes before navigating
 */
const NavigationLink: React.FC<NavigationLinkProps> = ({
  href,
  className,
  children,
  checkUnsavedChanges,
  handleNavigation,
}) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If there are unsaved changes, prevent default navigation
    if (checkUnsavedChanges()) {
      e.preventDefault();
      
      // Handle the navigation attempt through the warning system
      handleNavigation(() => {
        router.push(href);
      });
    }
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
};

export default NavigationLink; 