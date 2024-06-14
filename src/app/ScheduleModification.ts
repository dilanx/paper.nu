import {
  ExclamationTriangleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import debug from 'debug';
import { AppType, Color } from '@/types/BaseTypes';
import {
  ScheduleCourse,
  ScheduleSection,
  ScheduleSectionOverride,
} from '@/types/ScheduleTypes';
import { toast } from 'react-hot-toast';
import { customSectionForm } from '@/utility/Forms';
import { DayMap, Days } from '@/utility/Constants';
import {
  getAllSectionTimes,
  saveSchedule,
  sectionsOverlap,
  timeEquals,
} from './Schedule';
import { convertTime, parseTime } from '@/utility/Utility';
import { getTermInfo } from './Data';
const d = debug('app:schedule-mod');

function courseConfirmationPrompts(
  app: AppType,
  section: ScheduleSection,
  confirmationCallback: () => void
) {
  const data = app.state.schedule;

  const numSections = Object.keys(data.schedule).length;
  if (numSections >= 32 && !data.schedule[section.section_id]) {
    app.showAlert({
      title: 'Too many sections',
      message: 'Schedules cannot have more than 32 sections at a time.',
      notice: {
        type: 'tip',
        message:
          'If you want to test out multiple potential schedules, create multiple schedules using the "Schedules" tab!',
      },
      cancelButton: 'Close',
      color: 'red',
      icon: ExclamationTriangleIcon,
    });
    return;
  }

  const overlaps = sectionsOverlap(section, data.schedule);

  if (
    overlaps &&
    !section.custom &&
    app.state.userOptions.get.schedule_warnings
  ) {
    app.showAlert({
      title: 'Overlapping sections',
      message: `It looks like that section overlaps with ${overlaps.subject} ${overlaps.number} (section ${overlaps.section}). Are you sure you want to add it?`,
      cancelButton: 'Go back',
      confirmButton: 'Add anyway',
      color: 'red',
      icon: ExclamationTriangleIcon,
      action: () => {
        confirmationCallback();
      },
    });
    return;
  }

  confirmationCallback();
}

export function addOverride(app: AppType, override: ScheduleSectionOverride) {
  const schedule = app.state.schedule;
  schedule.overrides.push(override);

  d('schedule override added: %s', override.section_id);
  app.setState({
    schedule,
    saveState: saveSchedule(schedule, app.state.userOptions),
  });
}

export function checkOverrides(app: AppType, section: ScheduleSection) {
  let times = getAllSectionTimes(section);
  const len = times.length;
  for (const override of app.state.schedule.overrides) {
    if (override.section_id !== section.section_id) {
      continue;
    }

    times = times.filter(
      (time) =>
        override.day !== time.day ||
        !timeEquals(time.start_time, override.start_time) ||
        !timeEquals(time.end_time, override.end_time)
    );
  }

  if (times.length === len) {
    return {
      anyOverride: false,
      timesRemaining: times,
    };
  }

  return {
    anyOverride: true,
    timesRemaining: times,
  };
}

export function removeOverrides(app: AppType, sectionId: string) {
  const schedule = app.state.schedule;
  schedule.overrides = schedule.overrides.filter(
    (override) => override.section_id !== sectionId
  );

  d('schedule overrides removed: %s', sectionId);
  app.setState({
    schedule,
    saveState: saveSchedule(schedule, app.state.userOptions),
  });
}

export function addSection(app: AppType, section: ScheduleSection) {
  courseConfirmationPrompts(app, section, () => {
    delete section.preview;
    const schedule = app.state.schedule;
    schedule.schedule[section.section_id] = section;

    d('schedule section added: %s', section.section_id);
    app.setState({
      schedule,
      saveState: saveSchedule(schedule, app.state.userOptions),
    });
  });
}

export function removeSection(app: AppType, section: ScheduleSection) {
  const schedule = app.state.schedule;
  delete schedule.schedule[section.section_id];
  schedule.overrides = schedule.overrides.filter(
    (override) => override.section_id !== section.section_id
  );
  d('schedule section removed: %s', section.section_id);
  app.setState({
    schedule,
    saveState: saveSchedule(schedule, app.state.userOptions),
  });
}

export function addScheduleBookmark(app: AppType, course: ScheduleCourse) {
  const schedule = app.state.schedule;
  if (schedule.bookmarks.length >= 64) {
    app.showAlert({
      title: 'Too many bookmarks',
      message:
        'Schedules cannot have more than 64 courses bookmarked at a time.',
      notice: {
        type: 'tip',
        message:
          'If you want to test out multiple potential schedules, create multiple schedules using the "Schedules" tab!',
      },
      cancelButton: 'Close',
      color: 'red',
      icon: ExclamationTriangleIcon,
    });
    return;
  }

  if (
    schedule.bookmarks.some(
      (bookmarkCourse) => bookmarkCourse.course_id === course.course_id
    )
  ) {
    return;
  }
  schedule.bookmarks.push(course);
  app.setState({
    schedule,
    saveState: saveSchedule(schedule, app.state.userOptions),
  });
}

export function removeScheduleBookmark(app: AppType, course: ScheduleCourse) {
  const schedule = app.state.schedule;
  if (
    !schedule.bookmarks.some(
      (bookmarkCourse) => bookmarkCourse.course_id === course.course_id
    )
  ) {
    return;
  }

  let index = -1;
  for (let i = 0; i < schedule.bookmarks.length; i++) {
    if (schedule.bookmarks[i].course_id === course.course_id) {
      index = i;
      break;
    }
  }

  if (index === -1) {
    return;
  }

  schedule.bookmarks.splice(index, 1);

  app.setState({
    schedule,
    saveState: saveSchedule(schedule, app.state.userOptions),
  });
}

function getNextAvailableCustomSectionId(app: AppType) {
  const schedule = app.state.schedule;

  let id = 1;
  while (schedule.schedule[`CUSTOM-${id}`]) {
    id++;
  }

  return id;
}

export function putCustomSection(
  app: AppType,
  sectionToEdit?: ScheduleSection
) {
  app.showAlert({
    title: sectionToEdit ? 'Edit custom section' : 'Add custom section',
    message:
      'Keep your entire school schedule, including things other than classes, in one place by adding custom sections to your schedule!',
    color: 'green',
    icon: sectionToEdit ? PencilIcon : PlusIcon,
    form: {
      sections: customSectionForm(
        sectionToEdit
          ? {
              title: sectionToEdit.subject,
              subtitle: sectionToEdit.title,
              instructor: sectionToEdit.instructors?.[0].name,
              location: sectionToEdit.room[0] || undefined,
              start: sectionToEdit.start_time[0]
                ? convertTime(sectionToEdit.start_time[0], true)
                : undefined,
              end: sectionToEdit.end_time[0]
                ? convertTime(sectionToEdit.end_time[0], true)
                : undefined,
              meeting_days:
                sectionToEdit.meeting_days[0]
                  ?.split('')
                  .map((d) => Days[parseInt(d)])
                  .join(',') || undefined,
              color: sectionToEdit.color,
            }
          : undefined
      ),
      timeConstraints: [
        {
          minKey: 'start',
          maxKey: 'end',
          error: 'The start time must be earlier than the end time',
        },
      ],
      onSubmit: (res) => {
        const { start, end } =
          getTermInfo(app.state.schedule.termId || app.state.latestTermId) ||
          {};
        addSection(app, {
          section_id: `CUSTOM-${getNextAvailableCustomSectionId(app)}`,
          ...(sectionToEdit || {}),
          title: res.subtitle || '',
          subject: res.title!,
          section: '',
          meeting_days: [
            res
              .meeting_days!.split(',')
              .map((d) => DayMap[d])
              .join(''),
          ],
          start_time: [parseTime(res.start) || null],
          end_time: [parseTime(res.end) || null],
          room: [res.location || null],
          component: 'CUS',
          start_date: start,
          end_date: end,
          custom: true,
          color: res.color as Color,
          instructors: res.instructor
            ? [
                {
                  name: res.instructor,
                },
              ]
            : undefined,
        });
      },
    },
    cancelButton: 'Cancel',
    confirmButton: sectionToEdit ? 'Save' : 'Add',
  });
}

export function clearSchedule(app: AppType) {
  app.showAlert({
    title: 'Clear schedule?',
    message: `All of the sections and bookmarks on your current schedule will be removed.`,
    cancelButton: 'Cancel',
    confirmButton: 'Clear',
    color: 'red',
    icon: TrashIcon,
    action: () => {
      const schedule = {
        schedule: {},
        bookmarks: [],
        overrides: [],
        termId: app.state.schedule.termId,
      };
      toast.success(`Schedule cleared`, {
        iconTheme: {
          primary: 'red',
          secondary: 'white',
        },
      });
      app.setState({
        schedule,
        saveState: saveSchedule(schedule, app.state.userOptions),
      });
    },
  });
}
