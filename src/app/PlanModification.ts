import {
  BookmarkSlashIcon,
  ExclamationTriangleIcon,
  SunIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import debug from 'debug';
import toast from 'react-hot-toast';
import PlanManager from '../PlanManager';
import { AppType } from '../types/BaseTypes';
import { Course, CourseLocation } from '../types/PlanTypes';
import Utility from '../utility/Utility';
const d = debug('app:plan-mod');

function courseConfirmationPrompts(
  app: AppType,
  course: Course,
  { year, quarter }: CourseLocation,
  confirmationCallback: () => void,
  ignoreExistCheck = false
) {
  const data = app.state.data;
  const isPlaceholder = course.placeholder;
  const repeatable = course.repeatable;

  const exists = PlanManager.duplicateCourse(course, data);

  if (!repeatable && exists && !isPlaceholder && !ignoreExistCheck) {
    app.showAlert({
      title: 'Course already planned',
      message: `You already have ${
        course.id
      } on your plan during the ${Utility.convertQuarter(
        exists.quarter
      ).title.toLowerCase()} quarter of your ${Utility.convertYear(
        exists.year
      ).toLowerCase()}.`,
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

  const unitCount =
    PlanManager.getQuarterCredits(data.courses[year][quarter]) +
    parseFloat(course.units);

  if (unitCount > 5.5) {
    app.showAlert({
      title: 'Too many classes',
      message: `With app course, you'll have ${unitCount} units worth of classes app quarter, which is over Northwestern's maximum of 5.5 units.`,
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

export function addCourse(
  app: AppType,
  course: Course,
  location: CourseLocation
) {
  courseConfirmationPrompts(app, course, location, () => {
    const data = app.state.data;
    const { year, quarter } = location;
    data.courses[year][quarter].push(course);
    data.courses[year][quarter].sort((a, b) => {
      if (a.placeholder) return 1;
      if (b.placeholder) return -1;
      return a.id.localeCompare(b.id);
    });

    d('course added: %s (y%dq%d)', course.id, year, quarter);
    app.setState({
      data,
      saveState: PlanManager.save(data, app.state.switches),
    });
  });
}

export function removeCourse(
  app: AppType,
  course: Course,
  { year, quarter }: CourseLocation
) {
  if (year < 0) {
    removeBookmark(app, course, quarter === 1);
    return;
  }
  const data = app.state.data;
  data.courses[year][quarter].splice(
    data.courses[year][quarter].indexOf(course),
    1
  );
  d('course removed: %s (y%dq%d)', course.id, year, quarter);
  app.setState({
    data,
    saveState: PlanManager.save(data, app.state.switches),
  });
}

export function moveCourse(
  app: AppType,
  course: Course,
  oldLocation: CourseLocation,
  newLocation: CourseLocation
) {
  const { year: oy, quarter: oq } = oldLocation;
  const { year: ny, quarter: nq } = newLocation;
  if (oy === ny && oq === nq) return;

  courseConfirmationPrompts(
    app,
    course,
    newLocation,
    () => {
      if (oy >= 0) {
        const data = app.state.data;
        data.courses[oy][oq].splice(data.courses[oy][oq].indexOf(course), 1);
      }
      const data = app.state.data;
      data.courses[ny][nq].push(course);
      data.courses[ny][nq].sort((a, b) => {
        if (a.placeholder) return 1;
        if (b.placeholder) return -1;
        return a.id.localeCompare(b.id);
      });

      d('course moved: %s (y%dq%d) -> (y%dq%d)', course.id, oy, oq, ny, nq);
      app.setState({
        data,
        saveState: PlanManager.save(data, app.state.switches),
      });
    },
    true
  );
}

export function addBookmark(app: AppType, course: Course, forCredit: boolean) {
  if (course.custom) {
    app.showAlert({
      title: "Custom courses can't be bookmarked",
      message:
        'Only built-in courses can be bookmarked. Custom courses cannot.',
      color: 'red',
      icon: BookmarkSlashIcon,
      cancelButton: 'Close',
    });
    return;
  }

  const bookmarks = app.state.data.bookmarks;
  if (forCredit) {
    bookmarks.forCredit.add(course);
  } else {
    bookmarks.noCredit.add(course);
  }

  d('bookmark added: %s (credit = %s)', course.id, forCredit.toString());
  app.setState((prevState) => {
    const data = {
      ...prevState.data,
      bookmarks: bookmarks,
    };
    return {
      data,
      saveState: PlanManager.save(data, app.state.switches),
    };
  });
}

export function removeBookmark(
  app: AppType,
  course: Course,
  forCredit: boolean
) {
  const bookmarks = app.state.data.bookmarks;
  if (forCredit) {
    bookmarks.forCredit.delete(course);
  } else {
    bookmarks.noCredit.delete(course);
  }

  d('bookmark removed: %s (credit = %s)', course.id, forCredit.toString());
  app.setState((prevState) => {
    const data = {
      ...prevState.data,
      bookmarks: bookmarks,
    };
    return {
      data,
      saveState: PlanManager.save(data, prevState.switches),
    };
  });
}

export function addSummerQuarter(app: AppType, year: number) {
  app.showAlert({
    title: 'Add summer quarter to this year?',
    message: `This will add a summer quarter to your ${Utility.convertYear(
      year
    ).toLowerCase()}.`,
    confirmButton: 'Add quarter',
    cancelButton: 'Close',
    color: 'yellow',
    icon: SunIcon,
    action: () => {
      const data = app.state.data;
      data.courses[year].push([]);
      app.setState({ data: data });
      d('summer quarter added: y%d', year);
    },
  });
}

export function removeSummerQuarter(app: AppType, year: number) {
  app.showAlert({
    title: 'Remove summer quarter from this year?',
    message: `This will remove the summer quarter from your ${Utility.convertYear(
      year
    ).toLowerCase()} and all classes within it.`,
    confirmButton: 'Remove quarter',
    cancelButton: 'Close',
    color: 'yellow',
    icon: SunIcon,
    action: () => {
      const data = app.state.data;
      data.courses[year].pop();
      app.setState({
        data: data,
        saveState: PlanManager.save(data, app.state.switches),
      });
      d('summer quarter removed: y%d', year);
    },
  });
}

export function addYear(app: AppType) {
  const data = app.state.data;
  data.courses.push([[], [], []]);
  app.setState({ data: data });
  d('year added: y%d', data.courses.length);
}

export function clearData(app: AppType, year?: number) {
  let data;
  if (year === undefined) {
    data = {
      courses: [
        [[], [], []],
        [[], [], []],
        [[], [], []],
        [[], [], []],
      ],
      bookmarks: {
        forCredit: new Set<Course>(),
        noCredit: new Set<Course>(),
      },
    };
    d('plan cleared');
    app.setState({
      data,
      saveState: PlanManager.save(data, app.state.switches),
    });
  } else {
    const yearText = Utility.convertYear(year).toLowerCase();
    app.showAlert({
      title: `Clear ${yearText}?`,
      message: `All of the courses in your ${yearText} will be removed.`,
      cancelButton: 'Cancel',
      confirmButton: 'Clear',
      color: 'red',
      icon: TrashIcon,
      action: () => {
        const oldData = app.state.data;
        const courses = app.state.data.courses;
        courses[year] = [[], [], []];
        data = { courses: courses, bookmarks: oldData.bookmarks };
        d('year cleared: y%d', year);
        toast.success(`Cleared your ${yearText}`, {
          iconTheme: {
            primary: 'red',
            secondary: 'white',
          },
        });
        app.setState({
          data,
          saveState: PlanManager.save(data, app.state.switches),
        });
      },
    });
  }
}
