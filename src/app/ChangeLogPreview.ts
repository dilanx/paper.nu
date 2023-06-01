import { ChangeLogPreviewInformation } from '../types/BaseTypes';

const clp: ChangeLogPreviewInformation = {
  items: [
    {
      title: 'The URL save data system is dead 💀',
      description:
        "The long URLs for plans and schedules that used to exist since the launch of the original Plan Northwestern are now gone. You can still share links to plans or schedules in the export menu. The shortened links are now the default. This change won't affect you if you just use an account or the browser storage to save your plans. Read more on my blog!",
    },
    {
      title: 'Redesigned settings menu',
      description:
        'Enjoy your customization experience with a nicer settings menu.',
    },
    {
      title: 'Duplicate plans and schedules',
      description:
        'Making multiple versions of the same base plan or schedule is now easier than ever. Hover over a plan or schedule saved to your account in the sidebar and press the duplicate button to create a new one with the same contents and notes.',
    },
  ],
  link: {
    text: 'What died?? Read on the blog.',
    url: 'https://dilan.blog/discontinuing-the-paper-url-save-data-system/',
  },
};

export default clp;
