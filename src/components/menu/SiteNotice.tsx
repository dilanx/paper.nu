import paperBlack from '@/assets/paper-full-black.png';

export default function SiteNotice() {
  return (
    <div className="mx-auto flex h-screen w-full max-w-2xl flex-col items-center justify-center gap-4 p-4">
      <img src={paperBlack} alt="paper.nu" className="h-[64px]" />
      <p className="text-center text-4xl font-medium">
        It's Dillo Day. Course planning can wait.
      </p>
      <p className="text-center text-lg">
        The libraries are closed, and so is Paper. Just for today. Go to the
        lakefill and enjoy the day outside. You can plan your courses tomorrow.
        ✌️
      </p>
      <a
        href="https://app.dilloday.com"
        className="rounded-md text-center text-sm text-purple-500 hover:bg-gray-100 active:bg-gray-200"
      >
        In the meantime, download the official Dillo Day app for updates,
        schedule, map, and to find your Dillo Cabin Mate!!
      </a>
    </div>
  );
}
