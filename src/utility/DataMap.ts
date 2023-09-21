import {
  SubjectData,
  SubjectsAndSchools,
  UniversitySchools,
} from '../types/BaseTypes';
import { RawCourseData } from '../types/PlanTypes';
import { ScheduleCourse } from '../types/ScheduleTypes';
import SchoolsJson from '../data/schools.json';

const schoolsData = SchoolsJson as { [key: string]: string };

export function subjectsAndSchools(data: any): SubjectsAndSchools {
  const subjects: SubjectData = {};
  const schools: UniversitySchools = {};
  for (const subject in data) {
    const subjData = data[subject];
    subjects[subject] = {
      color: subjData.c,
      display: subjData.d,
      schools: subjData.s,
    };
    for (const school of subjData.s || []) {
      if (!schools[school]) {
        schools[school] = {
          name: schoolsData[school],
          subjects: [],
        };
      }
      schools[school].subjects.push({
        symbol: subject,
        name: subjData.d,
      });
    }
  }
  return {
    subjects,
    schools,
  };
}

export function plan({ courses, legacy, ...rest }: any): RawCourseData {
  const courseMap = ({ i, n, u, r, d, p, s, f, l }: any) => ({
    id: i,
    name: n,
    units: u,
    repeatable: r,
    description: d,
    prereqs: p,
    distros: s,
    disciplines: f,
    placeholder: l,
  });

  return {
    courses: courses.map(courseMap),
    legacy: legacy.map(courseMap),
    ...rest,
  };
}

export function schedule(data: any, termId: string): ScheduleCourse[] {
  return data.map(({ i, c, t, u, n, s }: any) => ({
    course_id: i,
    school: c,
    title: t,
    subject: u,
    number: n,
    sections: s?.map(
      ({ i, r, t, k, u, n, s, m, x, y, l, d, e, c, a, q, p, o, f }: any) => {
        for (let i = 0; i < m.length; i++) {
          if (l[i]?.toLowerCase().includes('midterm')) {
            m.splice(i, 1);
            x.splice(i, 1);
            y.splice(i, 1);
            l.splice(i, 1);

            i--;
          }
        }

        return {
          section_id: i,
          termId,
          instructors: r?.map(({ n, p, a, o, b, u }: any) => ({
            name: n,
            phone: p,
            campus_address: a,
            office_hours: o,
            bio: b,
            url: u,
          })),
          title: t,
          topic: k,
          subject: u,
          number: n,
          section: s,
          meeting_days: m,
          start_time: x,
          end_time: y,
          room: l,
          start_date: d,
          end_date: e,
          component: c,
          capacity: a,
          enrl_req: q,
          descs: p,
          distros: o,
          disciplines: f,
        };
      }
    ),
  }));
}
