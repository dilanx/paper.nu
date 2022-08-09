import { IconElement } from '../../types/BaseTypes';

interface MiniContentBlockProps {
  icon: IconElement;
  title: string;
  children: React.ReactNode;
}

function MiniContentBlock(props: MiniContentBlockProps) {
  return (
    <div className="text-center p-4">
      <div className="mx-auto my-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <props.icon className="w-6 h-6" />
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
