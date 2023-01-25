import { XMarkIcon } from '@heroicons/react/24/outline';
import { motion, useDragControls } from 'framer-motion';
import { useState } from 'react';

interface NotesProps {
  constraintsRef: React.RefObject<HTMLDivElement>;
  isSchedule: boolean;
  onClose: () => void;
}

function Notes({ constraintsRef, isSchedule, onClose }: NotesProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragControls = useDragControls();

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragListener={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      dragMomentum={false}
      dragConstraints={constraintsRef}
      initial={{
        scale: 0.75,
        opacity: 0,
      }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      exit={{
        scale: 0.75,
        opacity: 0,
      }}
      className="fixed top-12 right-0 z-40 box-border h-64 w-full p-4 md:h-96 md:w-96"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-xl border-2 border-black bg-white shadow-xl">
        <div
          onPointerDown={(e) => {
            dragControls.start(e);
          }}
          className={`flex border-b-2 border-black px-2 py-1`}
          style={{
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
        >
          <p className="flex-1 font-bold tracking-wide">NOTES</p>
          <button
            className="text-gray-600 hover:text-red-400 active:text-red-500
            dark:text-gray-500 dark:hover:text-red-400 dark:active:text-red-500"
            onClick={() => onClose()}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="flex-1 p-2">
          <textarea
            className="box-border block h-full w-full resize-none p-2 text-sm outline-none"
            placeholder={`Add some notes to this ${
              isSchedule ? 'schedule' : 'plan'
            } here. You can even move this little notes window around by dragging the top bar!`}
            style={{
              height: '',
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default Notes;
