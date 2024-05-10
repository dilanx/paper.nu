import { BannerData } from '../types/BaseTypes';

const bn: BannerData | null = {
  id: 'promo-refresh',
  gradient: 2,
  content: (
    <>
      💃 Don't miss the Refresh Dance Crew performances Fri 9 PM, Sat 7 PM, or
      Sat 10 PM.{' '}
      <a
        href="https://nbo.universitytickets.com/w/default.aspx?cid=211"
        target="_blank"
        rel="noreferrer"
        className="text-yellow-100 underline underline-offset-2 hover:text-yellow-300 hover:no-underline"
      >
        Get tickets.
      </a>{' '}
      🕺
    </>
  ),
};

export default bn;
