import { ChangeLogPreviewInformation } from '../types/BaseTypes';

const clp: ChangeLogPreviewInformation = {
  version: '2.1.0',
  items: [
    {
      title: 'Filter schedule search results by distro.',
      description:
        'A distribution area filter has been added as an option when searching for courses in schedule view. Click on the filter button (the funnel) below the search bar to select distros to filter by.',
    },
    {
      title: 'More course section info is now available.',
      description:
        'View information that instructors have added for a specific course section right from within Paper. This includes topics, overviews, class materials, and more. You can also view section info from within search results rather than having to add the course to your schedule first.',
    },
    {
      title: 'The minimap is now enabled by default.',
      description:
        'I guess the vertical bar of buttons on the left side of the schedule was too easy to miss because a lot of people thought the map was removed even though it has still been available (the minimap is disabled by default). The minimap is now enabled by default (but it can still be disabled if you prefer more space for search results). The button bar is also now more opaque when not hovered over so you can see it more easily.',
    },
    {
      title: 'Rename account plans and schedules',
      description:
        'Use the pencil button next to the delete button on any of your saved plans or schedules to rename them.',
    },
  ],
};

export default clp;
