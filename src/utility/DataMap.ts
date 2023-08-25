import { MajorData, RawCourseData } from '../types/PlanTypes';
import { ScheduleCourse } from '../types/ScheduleTypes';

export function plan({ courses, legacy, majors, ...rest }: any): RawCourseData {
  const courseMap = ({ i, n, u, r, d, p, s, l }: any) => ({
    id: i,
    name: n,
    units: u,
    repeatable: r,
    description: d,
    prereqs: p,
    distros: s,
    placeholder: l,
  });

  const m: MajorData = {};

  for (const [major, { d, c }] of Object.entries<any>(majors)) {
    m[major] = {
      display: d,
      color: c,
    };
  }

  return {
    courses: courses.map(courseMap),
    legacy: legacy.map(courseMap),
    majors: m,
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
      ({ i, r, t, k, u, n, s, m, x, y, l, d, e, c, a, q, p, o }: any) => ({
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
      })
    ),
  }));
}
