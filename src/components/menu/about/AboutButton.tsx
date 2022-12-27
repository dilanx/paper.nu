import { ReactNode } from 'react';

interface AboutButtonProps {
  children: ReactNode;
  href: string;
}

function AboutButton({ children, href }: AboutButtonProps) {
  return (
    <a
      className="w-full flex-1 rounded-lg border-2 border-black py-2 text-center text-sm font-medium text-black shadow-sm
        hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
}

export default AboutButton;
