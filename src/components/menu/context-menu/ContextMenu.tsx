import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { ContextMenuData, UserOptions } from '@/types/BaseTypes';
import ContextMenuButton from './ContextMenuButton';

interface ContextMenuProps {
  data: ContextMenuData;
  switches: UserOptions;
  onClose: () => void;
}

function ContextMenu({ data, switches, onClose }: ContextMenuProps) {
  const [isOpen, setIsOpen] = useState(true);

  const ref = useRef<HTMLDivElement>(null);
  const mode = data.mode || 'right';

  useEffect(() => {
    if (ref.current) {
      const { x, y, width, height } = ref.current.getBoundingClientRect();
      if (mode === 'left') {
        if (x + width > window.innerWidth) {
          ref.current.style.left = `${window.innerWidth - width - 16}px`;
        }
      } else {
        if (x < 0) {
          ref.current.style.right = `${window.innerWidth - width - 16}px`;
        }
      }

      if (y + height > window.innerHeight) {
        ref.current.style.top = `${window.innerHeight - height - 16}px`;
      }
    }
  }, [ref, mode]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className={`${switches.get.dark ? 'dark' : ''} relative z-40`}
        onClose={() => setIsOpen(false)}
      >
        <div className="fixed inset-0 z-20" />
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 -translate-y-4"
          enterTo="opacity-100 translate-y-0"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-4"
          afterLeave={() => onClose()}
        >
          <Dialog.Panel
            ref={ref}
            style={{
              left: mode === 'left' ? `${data.x}px` : undefined,
              right: mode === 'right' ? `calc(100vw - ${data.x}px)` : undefined,
              top: data.y,
            }}
            className="fixed z-30 overflow-hidden rounded-lg bg-gray-50 shadow-lg dark:bg-gray-700"
          >
            {data.topText && (
              <p className="px-2 py-1 text-right text-xs text-gray-400">
                {data.topText}
              </p>
            )}
            {data.items.map((item, i) => (
              <ContextMenuButton
                data={item}
                close={() => setIsOpen(false)}
                sm={data.sm}
                key={`context-menu-item-${i}`}
              />
            ))}
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

export default ContextMenu;
