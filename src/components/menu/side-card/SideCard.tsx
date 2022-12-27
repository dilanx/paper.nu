import { XMarkIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { UserOptions } from '../../../types/BaseTypes';
import { SideCardData } from '../../../types/SideCardTypes';
import SideCardButton from './SideCardButton';
import SideCardItem from './SideCardItem';

interface SideCardProps {
  data: SideCardData;
  switches: UserOptions;
  close: () => void;
}

function SideCard({ data, switches, close }: SideCardProps) {
  return (
    <div className="fixed top-0 right-0 z-40 h-screen w-screen px-4 py-8 md:max-w-md">
      <motion.div
        className="no-scrollbar h-full w-full overflow-y-scroll rounded-xl bg-white p-4 shadow-xl dark:bg-gray-700"
        initial={{
          x: 448,
        }}
        animate={{
          x: 0,
        }}
        exit={{
          x: 448,
        }}
        transition={{
          duration: 0.5,
          type: 'spring',
        }}
      >
        <div className="mb-8 flex w-full items-center gap-2">
          <p
            className={`text-${data.themeColor}-400 flex-grow text-sm font-bold tracking-wider`}
          >
            {data.type}
          </p>
          <div>
            <button
              className="flex items-center text-gray-600 hover:text-red-400 active:text-red-500 dark:text-gray-500 dark:hover:text-red-400 dark:active:text-red-300"
              onClick={() => close()}
            >
              <XMarkIcon className="h-7 w-7" />
            </button>
          </div>
        </div>
        {data.alertMessage && (
          <div className="my-4 rounded-lg border-2 border-red-500 bg-red-100 p-2 dark:border-red-400 dark:bg-gray-700">
            <p className="text-center text-sm font-medium text-red-600 dark:text-red-300">
              {data.alertMessage}
            </p>
          </div>
        )}
        <p
          className={`text-center text-2xl font-bold text-gray-800 dark:text-gray-50 sm:text-left`}
        >
          {data.title}
        </p>
        {data.subtitle && (
          <p className="text-center text-lg font-light text-gray-800 dark:text-gray-100 sm:text-left">
            {data.subtitle}
          </p>
        )}
        {data.message && (
          <p className="my-4 text-sm text-gray-600 dark:text-gray-400">
            {data.message}
          </p>
        )}
        {data.items && (
          <div className="mt-4">
            {data.items.map((item, i) => (
              <SideCardItem
                key={`side-card-item-${i}`}
                data={item}
                color={data.themeColor}
              />
            ))}
          </div>
        )}
        {data.buttons && (
          <div className="m-4 mt-8">
            {data.buttons.map((button, i) => (
              <SideCardButton
                key={`side-card-button-${i}`}
                data={button}
                close={close}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default SideCard;
