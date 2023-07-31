import { CloudIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion, useDragControls } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { SpinnerCircularFixed } from 'spinners-react';
import Account from '../../Account';
import { discardNotesChanges } from '../../app/AccountModification';
import { Alert } from '../../types/AlertTypes';
import { UserOptions } from '../../types/BaseTypes';
import { Mode } from '../../utility/Constants';
import Utility from '../../utility/Utility';

interface NotesProps {
  constraintsRef: React.RefObject<HTMLDivElement>;
  switches: UserOptions;
  onClose: () => void;
  alert: Alert;
}

function Notes({ constraintsRef, switches, alert, onClose }: NotesProps) {
  const isSchedule = switches.get.mode === Mode.SCHEDULE;
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [notes, setNotes] = useState<string | null>(null);
  const shouldSave = switches.get.unsaved_notes;
  const dragControls = useDragControls();
  const darkMode = switches.get.dark;
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (Account.isLoggedIn()) {
      const { active_plan_id, active_schedule_id } = switches.get;
      if (
        (!isSchedule && active_plan_id) ||
        (isSchedule && active_schedule_id)
      ) {
        Account.get(isSchedule ? 'schedules' : 'plans')
          .then((res) => {
            if (!res) return;

            const doc = res.find(
              (d) => d.id === (isSchedule ? active_schedule_id : active_plan_id)
            );
            if (doc) {
              setNotes(doc.notes || '');
            } else {
              setNotes(null);
            }
            setLoading(false);
          })
          .catch((err) => {
            alert(Utility.errorAlert('notes_get_documents', err));
          });
        return;
      }
    }
    setLoading(false);
    setNotes(null);
  }, [alert, isSchedule, switches.get]);

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
      <div className="flex h-full flex-col overflow-hidden rounded-xl border-2 border-black bg-white shadow-xl dark:border-white dark:bg-gray-800">
        <div
          onPointerDown={(e) => {
            dragControls.start(e);
          }}
          className={`flex gap-2 border-b-2 border-black px-2 py-1 dark:border-white`}
          style={{
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
        >
          <p className="flex-1 font-bold tracking-wide text-black dark:text-white">
            NOTES
          </p>
          <AnimatePresence>
            {shouldSave && (
              <motion.button
                disabled={saveLoading}
                onClick={() => {
                  const type = isSchedule ? 'schedules' : 'plans';
                  const id =
                    switches.get[
                      isSchedule ? 'active_schedule_id' : 'active_plan_id'
                    ];
                  if (!id || id === 'None') {
                    toast.error(
                      `Failed to save notes: no active ${
                        isSchedule ? 'schedule' : 'plan'
                      }`
                    );
                    return;
                  }
                  const newNotes = textAreaRef.current?.value || '';

                  setSaveLoading(true);
                  toast.promise(Account.update(type, id, { notes: newNotes }), {
                    loading: 'Saving notes...',
                    success: () => {
                      switches.set('unsaved_notes', false);
                      setSaveLoading(false);
                      setNotes(newNotes);
                      return 'Saved notes';
                    },
                    error: (err) => {
                      setSaveLoading(false);
                      alert(Utility.errorAlert('notes_update_document', err));
                      return 'Something went wrong';
                    },
                  });
                }}
                initial={{
                  scale: 0.75,
                }}
                animate={{
                  scale: 1,
                }}
                exit={{
                  scale: 0.75,
                  opacity: 0,
                }}
                className="flex items-center gap-1 rounded-md bg-green-500 px-2 text-white shadow-md hover:opacity-80 active:opacity-60"
              >
                <p className="text-sm">Save</p>
                <CloudIcon className="h-6 w-6" />
              </motion.button>
            )}
          </AnimatePresence>
          <button
            className="text-gray-600 hover:text-red-400 active:text-red-500
            dark:text-gray-500 dark:hover:text-red-400 dark:active:text-red-300"
            onClick={() => {
              discardNotesChanges(switches, alert, onClose);
            }}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="flex-1 p-2">
          {loading ? (
            <div className="flex h-full w-full items-center justify-center">
              <SpinnerCircularFixed
                size={64}
                thickness={160}
                speed={200}
                color={darkMode ? 'rgb(212, 212, 212)' : 'rgb(115, 115, 115)'}
                secondaryColor={
                  darkMode ? 'rgb(64, 64, 64)' : 'rgba(245, 245, 245)'
                }
              />
            </div>
          ) : notes == null ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-4">
              <p className="text-center text-sm font-bold text-black dark:text-white">
                Add notes to your plans and schedules!
              </p>
              <p className="text-center text-xs text-gray-600 dark:text-gray-300">
                Activate a plan or schedule saved to your account to save notes!
                Notes are not stored in the URL, so they won't be visible by
                others if you shared the URL. You can even drag this window
                around!
              </p>
              <button
                className="rounded-lg bg-gray-300 px-4 py-1 text-sm text-gray-800 opacity-60 shadow-sm hover:opacity-100 active:opacity-80 dark:bg-gray-600 dark:text-gray-300"
                onClick={() => {
                  switches.set('tab', 'Plans');
                  onClose();
                }}
              >
                Activate a {isSchedule ? 'schedule' : 'plan'}
              </button>
            </div>
          ) : (
            <textarea
              ref={textAreaRef}
              disabled={saveLoading}
              className="box-border block h-full w-full resize-none bg-white p-2 text-sm text-black outline-none dark:bg-gray-800 dark:text-white"
              placeholder={`Add some notes to this ${
                isSchedule ? 'schedule' : 'plan'
              } here. You can even move this little notes window around by dragging the top bar!`}
              style={{
                height: '',
              }}
              maxLength={2000}
              onChange={(e) => {
                if (e.target.value !== notes && !shouldSave) {
                  switches.set('unsaved_notes', true);
                }
                if (e.target.value === notes && shouldSave) {
                  switches.set('unsaved_notes', false);
                }
              }}
              defaultValue={notes}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Notes;
