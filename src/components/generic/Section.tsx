interface SectionProps {
  title: string;
  fullRow?: boolean;
  children: React.ReactNode;
}

function Section({ title, fullRow, children }: SectionProps) {
  return (
    <div className={`my-2${fullRow ? ' col-span-2' : ''}`}>
      <p className="text-sm font-bold text-gray-500 dark:text-gray-400 m-1">
        {title}
      </p>
      {children}
    </div>
  );
}

export default Section;
