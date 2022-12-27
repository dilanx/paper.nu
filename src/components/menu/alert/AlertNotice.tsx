export const getAlertNotice = (message: string) => (
  <div className="rounded-lg border-2 border-red-500 bg-red-100 p-2 dark:border-red-400 dark:bg-gray-700">
    <p className="font-bold text-red-500 dark:text-red-400">NOTICE</p>
    <p className="text-sm text-red-500 dark:text-red-400">{message}</p>
  </div>
);
