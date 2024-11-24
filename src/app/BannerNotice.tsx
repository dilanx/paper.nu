import { BannerData } from '@/types/BaseTypes';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

const bn: BannerData | null = {
  id: 'feedback-0193605a-748d-7220-8aa8-36e75a0c0fdc',
  content: (
    <>
      Share your feedback and win $25 while helping the future of Paper!{' '}
      <a
        href="https://forms.dilanxd.com/paper-experience"
        target="_blank"
        rel="noreferrer"
        className="text-pink-200 no-underline hover:underline"
      >
        Take the Paper Experience survey
        <ArrowRightIcon className="mx-1 inline-block h-4 w-4" />
      </a>
    </>
  ),
  gradient: 3,
};

export default bn;
