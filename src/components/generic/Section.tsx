interface SectionProps {
  title: string;
  description?: string;
  fullRow?: boolean;
  children: React.ReactNode;
}

function Section({ title, description, fullRow, children }: SectionProps) {
  return (
    <div className={`my-2${fullRow ? ' col-span-2' : ''}`}>
      <div className="m-1">
        <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
          {title}
        </p>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

export default Section;
