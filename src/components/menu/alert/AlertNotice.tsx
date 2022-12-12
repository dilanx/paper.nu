export const getAlertNotice = (message: string) => (
  <div className="border-2 bg-red-100 dark:bg-gray-700 border-red-500 dark:border-red-400 rounded-lg p-2">
    <p className="text-red-500 dark:text-red-400 font-bold">NOTICE</p>
    <p className="text-sm text-red-500 dark:text-red-400">{message}</p>
  </div>
);
