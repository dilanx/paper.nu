interface SearchMessageProps {
  title: string;
  subtitle: string;
}

export default function SearchMessage({ title, subtitle }: SearchMessageProps) {
  return (
    <div className="px-4 text-center text-gray-600 dark:text-gray-400">
      <p className="text-lg font-medium">{title}</p>
      <p className="text-sm font-light">{subtitle}</p>
    </div>
  );
}
