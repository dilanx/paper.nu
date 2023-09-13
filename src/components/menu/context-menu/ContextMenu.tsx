import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { ContextMenuData, UserOptions } from '../../../types/BaseTypes';
import ContextMenuButton from './ContextMenuButton';

interface ContextMenuProps {
  data: ContextMenuData;
  switches: UserOptions;
  onClose: () => void;
}

function ContextMenu({ data, switches, onClose }: ContextMenuProps) {
  const [isOpen, setIsOpen] = useState(true);

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
            style={{ right: `calc(100vw - ${data.x}px)`, top: data.y }}
            className="fixed z-30 overflow-hidden rounded-lg bg-gray-50 shadow-lg dark:bg-gray-700"
          >
            {data.items.map((item, i) => (
              <ContextMenuButton
                data={item}
                close={() => setIsOpen(false)}
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
