interface SectionProps {
  title?: string;
  description?: string;
  totalRowItems?: number;
  children: React.ReactNode;
}

function Section({
  title,
  description,
  totalRowItems,
  children,
}: SectionProps) {
  return (
    <div
      className={`my-2 ${
        totalRowItems === 1
          ? 'col-span-4'
          : totalRowItems === 2
          ? 'col-span-2'
          : 'col-span-1'
      }`}
    >
      <div className="m-1">
        {title && (
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
            {title}
          </p>
        )}
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
