import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import debug from 'debug';
import ScheduleManager from '../ScheduleManager';
import { AppType } from '../types/BaseTypes';
import { ScheduleCourse, ScheduleSection } from '../types/ScheduleTypes';
const d = debug('app:schedule-mod');

function courseConfirmationPrompts(
  app: AppType,
  section: ScheduleSection,
  confirmationCallback: () => void
) {
  const data = app.state.schedule;

  const overlaps = ScheduleManager.sectionsOverlap(section, data.schedule);

  if (overlaps && app.state.switches.get.schedule_warnings) {
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
