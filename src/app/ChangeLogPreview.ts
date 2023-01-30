import { ChangeLogPreviewInformation } from '../types/BaseTypes';

const clp: ChangeLogPreviewInformation = {
  items: [
    {
      title: 'Add notes to plans and schedules.',
      description:
        "You can now add notes to plans and schedules that are saved to your account to keep track of any extra information you want. Notes will sync across your devices but won't be visible by others when sharing a link. You can even drag the little notes window to wherever you want on the page!",
    },
    {
      title: 'Enhanced user interface.',
      description:
        'Many buttons and features are now more visible and easier to access. Find access to the campus map, notes, sharing and exporting options, settings, and account stuff on the toolbar at the top, and easily switch between tabs on the sidebar. Access the about menu by clicking on the Paper logo in the top left corner.',
    },
    {
      title: 'Improved link sharing.',
      description:
        'You can now shorten a link to a plan or schedule (Export -> Share link -> SHORTEN LINK). No need to share super long links anymore. Just like the long links, the short links only link to the current version of the plan or schedule and will not update if you make changes.',
    },
  ],
};

export default clp;
