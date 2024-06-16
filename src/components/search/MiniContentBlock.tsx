import { IconElement } from '@/types/BaseTypes';

interface MiniContentBlockProps {
  icon: IconElement;
  title: string;
  children: React.ReactNode;
}

function MiniContentBlock(props: MiniContentBlockProps) {
  return (
    <div className="p-4 text-center">
      <div className="mx-auto my-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <props.icon className="h-6 w-6" />
      </div>
      <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
        {props.title}
      </p>
      <p className="text-sm font-light text-gray-400 dark:text-gray-500">
        {props.children}
      </p>
    </div>
  );
}

export default MiniContentBlock;
