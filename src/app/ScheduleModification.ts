import {
  ExclamationTriangleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import debug from 'debug';
import ScheduleManager from '../ScheduleManager';
import { AppType, Color } from '../types/BaseTypes';
import { ScheduleCourse, ScheduleSection } from '../types/ScheduleTypes';
import { toast } from 'react-hot-toast';
import { customSectionForm } from '../utility/Forms';
import { DayMap, Days } from '../utility/Constants';
import Utility from '../utility/Utility';
import { getTermInfo } from '../DataManager';
const d = debug('app:schedule-mod');

function courseConfirmationPrompts(
  app: AppType,
  section: ScheduleSection,
  confirmationCallback: () => void
) {
  const data = app.state.schedule;

  const overlaps = ScheduleManager.sectionsOverlap(section, data.schedule);

  if (overlaps && !section.custom && app.state.switches.get.schedule_warnings) {
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

export function addSection(app: AppType, section: ScheduleSection) {
  courseConfirmationPrompts(app, section, () => {
    delete section.preview;
    let schedule = app.state.schedule;
    schedule.schedule[section.section_id] = section;

    d('schedule section added: %s', section.section_id);
    app.setState({
      schedule,
      unsavedChanges: ScheduleManager.save(schedule, app.state.switches),
    });
  });
}

export function removeSection(app: AppType, section: ScheduleSection) {
  let schedule = app.state.schedule;
  delete schedule.schedule[section.section_id];
  d('schedule section removed: %s', section.section_id);
  app.setState({
    schedule,
    unsavedChanges: ScheduleManager.save(schedule, app.state.switches),
  });
}

export function addScheduleBookmark(app: AppType, course: ScheduleCourse) {
  let schedule = app.state.schedule;
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
    unsavedChanges: ScheduleManager.save(schedule, app.state.switches),
  });
}

export function removeScheduleBookmark(app: AppType, course: ScheduleCourse) {
  let schedule = app.state.schedule;
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
    unsavedChanges: ScheduleManager.save(schedule, app.state.switches),
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
                ? Utility.convertTime(sectionToEdit.start_time[0], true)
                : undefined,
              end: sectionToEdit.end_time[0]
                ? Utility.convertTime(sectionToEdit.end_time[0], true)
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
          start_time: [Utility.parseTime(res.start) || null],
          end_time: [Utility.parseTime(res.end) || null],
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
        unsavedChanges: ScheduleManager.save(schedule, app.state.switches),
      });
    },
  });
}
