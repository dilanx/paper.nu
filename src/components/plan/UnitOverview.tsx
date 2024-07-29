import {
  getCourseColor,
  getQuarterCredits,
  getTotalCredits,
  getYearCredits,
} from '@/app/Plan';
import { PlanData } from '@/types/PlanTypes';
import { convertQuarter, convertYear } from '@/utility/Utility';

interface UnitOverviewProps {
  plan: PlanData;
}

export default function UnitOverview({ plan }: UnitOverviewProps) {
  const units = getTotalCredits(plan);
  const bookmarkUnits = getQuarterCredits(plan.bookmarks.forCredit);
  return (
    <div className="flex flex-col gap-8 text-gray-700 dark:text-gray-50">
      {plan.courses.map((year, y) => {
        const yearUnits = getYearCredits(year);

        return (
          <div key={y}>
            <div className="flex items-center gap-4">
              <span className="font-medium capitalize">
                {convertYear(y).toLowerCase()}
              </span>
              <span className="text-purple-500 dark:text-purple-400">
                <span className="font-medium">{yearUnits}</span>{' '}
                {yearUnits === 1 ? 'unit' : 'units'}
              </span>
            </div>
            {year.map((quarter, q) => {
              const { title, color } = convertQuarter(q);
              const quarterUnits = getQuarterCredits(quarter);

              return (
                <div className="my-2 ml-4" key={q}>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-medium capitalize">
                      {title.toLowerCase()} quarter
                    </span>
                    <span
                      className={`text-${color}-500 dark:text-${color}-400`}
                    >
                      <span className="font-medium">{quarterUnits}</span>{' '}
                      {quarterUnits === 1 ? 'unit' : 'units'}
                    </span>
                  </div>
                  {quarter.map((course, c) => {
                    const color = getCourseColor(course.id);
                    const courseUnits = parseFloat(course.units);

                    return (
                      <div
                        className="my-1 ml-4 flex items-center gap-4 text-xs"
                        key={c}
                      >
                        <span className="">{course.id}</span>
                        <span
                          className={`text-${color}-500 dark:text-${color}-400`}
                        >
                          <span className="font-medium">
                            {courseUnits.toFixed(2)}
                          </span>{' '}
                          {courseUnits === 1 ? 'unit' : 'units'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        );
      })}
      <div>
        <div className="flex items-center gap-4">
          <span className="font-medium capitalize">
            for credit bookmark list
          </span>
          <span className="text-indigo-500 dark:text-indigo-400">
            <span className="font-medium">{bookmarkUnits}</span>{' '}
            {bookmarkUnits === 1 ? 'unit' : 'units'}
          </span>
        </div>
        {Array.from(plan.bookmarks.forCredit).map((course, c) => {
          const color = getCourseColor(course.id);
          const courseUnits = parseFloat(course.units);

          return (
            <div className="my-1 ml-8 flex items-center gap-4 text-xs" key={c}>
              <span className="">{course.id}</span>
              <span className={`text-${color}-500 dark:text-${color}-400`}>
                <span className="font-medium">{courseUnits.toFixed(2)}</span>{' '}
                {courseUnits === 1 ? 'unit' : 'units'}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-end gap-4">
        <span className="font-medium capitalize">total units</span>
        <span className="text-blue-500 dark:text-blue-400">
          <span className="font-medium">{units}</span>{' '}
          {units === 1 ? 'unit' : 'units'}
        </span>
      </div>
    </div>
  );
}
