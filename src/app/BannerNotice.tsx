import { BannerData } from '@/types/BaseTypes';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

const bn: BannerData | null = {
  id: 'pencil.nu-c5a74a58-3817-4d77-a2ae-13b30238820e',
  theme: 'light',
  gradient: 5,
  content: (
    <>
      <span className="font-bold text-black">pencil.nu</span> brings CTECs and
      more to Paper, along with CAESAR enhancements.{' '}
      <a
        href="https://www.pencil.nu"
        target="_blank"
        className="inline-flex items-center rounded-sm px-0.5 text-black hover:bg-gray-400/25"
      >
        <span>Install the extension</span>
        <ChevronRightIcon className="ml-1 inline-block h-3 w-3 stroke-[3]" />
      </a>
    </>
  ),
};

export default bn;
