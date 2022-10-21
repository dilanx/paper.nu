import { ReactNode } from 'react';

interface AboutButtonProps {
  children: ReactNode;
  href: string;
}

function AboutButton({ children, href }: AboutButtonProps) {
  return (
    <a
      className="flex-1 w-full py-2 border-2 border-black text-black dark:border-white dark:text-white rounded-lg text-sm font-medium
        hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black shadow-sm text-center"
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
}

export default AboutButton;
