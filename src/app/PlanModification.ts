import { AppType, Color } from '@/types/BaseTypes';
import { Course, CourseLocation } from '@/types/PlanTypes';
import { customCourseForm } from '@/utility/Forms';
import { convertQuarter, convertYear, shallowEqual } from '@/utility/Utility';
import {
  BookmarkSlashIcon,
  ExclamationTriangleIcon,
  MinusIcon,
  PencilIcon,
  PlusIcon,
  SunIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import debug from 'debug';
import toast from 'react-hot-toast';
import {
  duplicateCourse,
  getQuarterCredits,
  initCourse,
  savePlan,
} from './Plan';
const d = debug('app:plan-mod');

function sortCourses(a: Course, b: Course) {
  return a.id.localeCompare(b.id);
}

function courseConfirmationPrompts(
  app: AppType,
  course: Course,
  { year, quarter }: CourseLocation,
  confirmationCallback: () => void,
  ignoreExistCheck = false
) {
  const data = app.state.data;
  const repeatable = course.repeatable;

  const numCourses = data.courses[year][quarter].length;
  if (numCourses >= 32) {
    app.showAlert({
      title: 'Too many courses',
      message: 'Plans cannot have more than 32 courses in a single quarter.',
      notice: {
        type: 'tip',
        message:
          'If you want to test out multiple potential plans, create multiple plans using the "Plans" tab!',
      },
      cancelButton: 'Close',
      color: 'red',
      icon: ExclamationTriangleIcon,
    });
    return;
  }

  const exists = duplicateCourse(course, data);

  if (!repeatable && exists && !ignoreExistCheck) {
    app.showAlert({
      title: 'Course already planned',
      message: `You already have ${
        course.id
      } on your plan during the ${convertQuarter(
        exists.quarter
      ).title.toLowerCase()} quarter of your ${convertYear(
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
    getQuarterCredits(data.courses[year][quarter]) + parseFloat(course.units);

  if (unitCount > 5.5) {
    app.showAlert({
      title: 'Too many courses',
      message: `With this course, you'll have ${unitCount} units worth of courses this quarter, which is over Northwestern's maximum of 5.5 units.`,
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
    data.courses[year][quarter].push(initCourse(course));
    data.courses[year][quarter].sort(sortCourses);

    d('course added: %s (y%dq%d)', course.id, year, quarter);
    app.setState({
      data,
      saveState: savePlan(data, app.state.userOptions),
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
    data.courses[year][quarter].findIndex((c) => shallowEqual(c, course)),
    1
  );
  d('course removed: %s (y%dq%d)', course.id, year, quarter);
  app.setState({
    data,
    saveState: savePlan(data, app.state.userOptions),
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
        data.courses[oy][oq].splice(
          data.courses[oy][oq].findIndex((c) => shallowEqual(c, course)),
          1
        );
      }
      const data = app.state.data;
      data.courses[ny][nq].push(course);
      data.courses[ny][nq].sort(sortCourses);

      d('course moved: %s (y%dq%d) -> (y%dq%d)', course.id, oy, oq, ny, nq);
      app.setState({
        data,
        saveState: savePlan(data, app.state.userOptions),
      });
    },
    true
  );
}

export function editCourse(
  app: AppType,
  courseInstanceUid: string,
  course: Course,
  { year, quarter }: CourseLocation
) {
  const data = app.state.data;
  data.courses[year][quarter].splice(
    data.courses[year][quarter].findIndex((c) => c.iuid === courseInstanceUid),
    1,
    course
  );
  data.courses[year][quarter].sort(sortCourses);
  d(
    'course edited: I-%s %s (y%dq%d)',
    courseInstanceUid,
    course.id,
    year,
    quarter
  );
  app.setState({
    data,
    saveState: savePlan(data, app.state.userOptions),
  });
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
  if (
    (forCredit && bookmarks.forCredit.size >= 64) ||
    (!forCredit && bookmarks.noCredit.size >= 64)
  ) {
    app.showAlert({
      title: 'Too many bookmarks',
      message:
        'Plans cannot have more than 64 courses in each bookmark list in a single quarter.',
      notice: {
        type: 'tip',
        message:
          'If you want to test out multiple potential plans, create multiple plans using the "Plans" tab!',
      },
      cancelButton: 'Close',
      color: 'red',
      icon: ExclamationTriangleIcon,
    });
  }
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
      saveState: savePlan(data, app.state.userOptions),
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
      saveState: savePlan(data, prevState.userOptions),
    };
  });
}

export function addSummerQuarter(app: AppType, year: number) {
  app.showAlert({
    title: 'Add summer quarter to this year?',
    message: `This will add a summer quarter to your ${convertYear(
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
    message: `This will remove the summer quarter from your ${convertYear(
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
        saveState: savePlan(data, app.state.userOptions),
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

export function removeYear(app: AppType, year: number) {
  if (year < 4) {
    return;
  }

  const yearText = convertYear(year).toLowerCase();
  app.showAlert({
    title: `Remove ${yearText}?`,
    message: `All of the courses in your ${yearText} will be removed and the year will disappear from your plan.`,
    color: 'red',
    icon: MinusIcon,
    confirmButton: 'Remove',
    cancelButton: 'Cancel',
    action: () => {
      const data = app.state.data;
      data.courses.splice(year, 1);
      app.setState({
        data: data,
        saveState: savePlan(data, app.state.userOptions),
      });
      d('year removed: y%d', year);
    },
  });
}

export function putCustomCourse(
  app: AppType,
  location: CourseLocation,
  courseToEdit?: Course
) {
  app.showAlert({
    title: courseToEdit ? 'Edit custom course' : 'Add custom course',
    message:
      'Keep your entire school schedule, including things other than classes, in one place by adding custom sections to your schedule!',
    color: 'green',
    icon: courseToEdit ? PencilIcon : PlusIcon,
    form: {
      sections: customCourseForm(
        courseToEdit
          ? {
              title: courseToEdit.id,
              subtitle: courseToEdit.name,
              units: courseToEdit.units,
              color: courseToEdit.color,
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
        const iuid = courseToEdit?.iuid || 'UNKNOWN';
        const course: Course = {
          id: res.title!,
          name: res.subtitle || '',
          units: res.units || '0',
          color: res.color as Color,
          custom: true,
          repeatable: true,
          description: 'Custom course',

          // iuid will be overwritten on add but not on edit
          iuid,
        };

        if (courseToEdit) {
          editCourse(app, iuid, course, location);
        } else {
          addCourse(app, course, location);
        }
      },
    },
    cancelButton: 'Cancel',
    confirmButton: courseToEdit ? 'Save' : 'Add',
  });
}

export function clearData(app: AppType, year?: number) {
  if (year === undefined) {
    const data = {
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
      saveState: savePlan(data, app.state.userOptions),
    });
  } else {
    const yearText = convertYear(year).toLowerCase();
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
        const data = { courses: courses, bookmarks: oldData.bookmarks };
        d('year cleared: y%d', year);
        toast.success(`Cleared your ${yearText}`, {
          iconTheme: {
            primary: 'red',
            secondary: 'white',
          },
        });
        app.setState({
          data,
          saveState: savePlan(data, app.state.userOptions),
        });
      },
    });
  }
}
