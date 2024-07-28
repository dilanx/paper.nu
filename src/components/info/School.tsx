import { getSchoolName } from '@/app/Plan';

interface SchoolProps {
  school: string;
}

export default function School({ school }: SchoolProps) {
  return (
    <>
      <p>{school}</p>
      <p className="text-xs font-normal">{getSchoolName(school)}</p>
    </>
  );
}
