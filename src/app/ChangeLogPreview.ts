import { ChangeLogPreviewInformation } from '../types/BaseTypes';

const clp: ChangeLogPreviewInformation = {
  items: [
    {
      title: 'Course topics are finally here!',
      description:
        'Seminar courses (first-year seminars, special topics, special projects, etc.) and other courses with specified topics now have their topics displayed in Paper (schedule view). Find course topics in search results, on the schedule, and in the course info side card.',
    },
    {
      title: 'Multiple meeting pattern support.',
      description:
        'Classes that have multiple meeting patterns (different meeting times on different days) are now supported on the schedule. Previously, only the first one was displayed, oops.',
    },
    {
      title: 'Option to disable URL-based save data.',
      description:
        "By default, all of your plan and schedule data is stored in the URL. However, this can get annoying if your browser keeps routing you to an old plan or schedule link. If you don't really use the plan and schedule links, you can now disable this feature in the settings. Save data is still accessible from your account or your browser storage.",
    },
  ],
};

export default clp;
