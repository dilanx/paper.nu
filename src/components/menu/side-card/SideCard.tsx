import { XMarkIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { UserOptions } from '../../../types/BaseTypes';
import { SideCardData } from '../../../types/SideCardTypes';
import SideCardItem from './SideCardItem';

interface SideCardProps {
  data: SideCardData;
  switches: UserOptions;
  close: () => void;
}

function SideCard({ data, switches, close }: SideCardProps) {
  return (
    <div className="fixed w-screen md:max-w-md h-screen top-0 right-0 z-40 px-4 py-8">
      <motion.div className="w-full h-full bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4">
        <div className="flex w-full items-center gap-2 mb-8">
          <p
            className={`text-${data.themeColor}-400 text-sm font-bold tracking-wider flex-grow`}
          >
            {data.type}
          </p>
          <div>
            <button
              className="text-gray-600 flex items-center"
              onClick={() => close()}
            >
              <XMarkIcon className="w-7 h-7" />
            </button>
          </div>
        </div>
        <p
          className={`text-2xl font-bold text-gray-800 text-center sm:text-left`}
        >
          {data.title}
        </p>
        {data.subtitle && (
          <p className="text-lg font-light text-gray-800 text-center sm:text-left">
            {data.subtitle}
          </p>
        )}
        {data.message && (
          <p className="my-4 text-sm text-gray-600">{data.message}</p>
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
      </motion.div>
    </div>
  );
}

export default SideCard;
