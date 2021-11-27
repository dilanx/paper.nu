import { useState, useRef } from 'react'
import { Dialog } from '@headlessui/react'

export default function Alert(props) {

    let [isOpen, setIsOpen] = useState(true)

    let cancelButtonRef = useRef(null);

    function close() {
        setIsOpen(false);
        props.onClose();
    }

    function confirm() {
        setIsOpen(false);
        props.onConfirm();
    }

    let data = props.data;

    return (
        <Dialog open={isOpen} onClose={() => {close()}} initialFocus={cancelButtonRef} className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                    &#8203;
                </span>
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30"/>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-${data.iconBackgroundColor}-100 sm:mx-0 sm:h-10 sm:w-10`}>
                                {data.icon}
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                    {data.title}
                                </Dialog.Title>

                                {data.subtitle &&
                                    <div>
                                        <p className="text-md font-light text-gray-900">
                                            {data.subtitle}
                                        </p>
                                    </div>
                                }
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                    {data.message}
                                    </p>
                                </div>
                                {data.textView &&
                                    <div>
                                        <p className="bg-gray-200 mt-4 p-1 px-4 font-mono text-sm rounded-md md:w-96 overflow-scroll whitespace-nowrap overscroll-contain">
                                            {data.textView}
                                        </p>
                                    </div>
                                }
                            </div>
                                
                        </div>
                    </div>

                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-${data.confirmButtonColor}-500 text-base font-medium text-white
                            hover:bg-${data.confirmButtonColor}-600 focus:bg-${data.confirmButtonColor}-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm`}
                            onClick={() => {confirm();}}>
                            {data.confirmButton}
                        </button>
                        {data.cancelButton && <button
                            ref={cancelButtonRef}
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2
                            bg-white text-base font-medium text-gray-700 hover:bg-gray-100 focus:bg-gray-200 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={() => {close();}}>
                            {data.cancelButton}
                        </button>}
                    </div>
                </div>
            </div>
        </Dialog>
    )

}