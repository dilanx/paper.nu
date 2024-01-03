import { ChangeLogPreviewInformation } from '../../types/BaseTypes';

interface GenericChangeLogListProps {
  version: string;
  info: ChangeLogPreviewInformation;
}

export default function GenericChangeLogList({
  version,
  info,
}: GenericChangeLogListProps) {
  return (
    <>
      <p className="my-4 text-center text-lg font-light text-gray-600 dark:text-gray-300">
        the ultimate Northwestern course planning tool
      </p>
      <p className="text-center text-sm font-bold tracking-wide">
        WHAT'S NEW IN VERSION {version}
      </p>
      <ul className="w-full list-disc">
        {info.items.map(({ title, description }, i) => (
          <li className="my-4" key={`clp-item-${i}`}>
            <p className="font-bold">{title}</p>
            <p className="text-sm font-normal">{description}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
