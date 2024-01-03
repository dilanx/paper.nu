interface ClassPropertyDisplayProps {
  title: string;
  value: string | string[];
}

export default function ClassPropertyDisplay({
  title,
  value,
}: ClassPropertyDisplayProps) {
  return (
    <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
      <p className="font-bold">{title}</p>
      {typeof value === 'string' ? (
        <p className="whitespace-normal font-light">{value}</p>
      ) : (
        value.map((v, i) => (
          <p key={`distro-${i}`} className="whitespace-normal font-light">
            {v}
          </p>
        ))
      )}
    </div>
  );
}
