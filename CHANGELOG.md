# Paper Change Log

## 3.2.4

_2025-03-19_

- Support searching by subject display names. For example, "Computer Science" will show "COMP_SCI" courses, and "Computer Science 110" will show "COMP_SCI 110".

## 3.2.3

_2024-11-11_

- Various UI updates, bug fixes, and other small changes.

## 3.2.2

_2024-09-25_

- The schedule time bar will always use the central time zone to align with class times, regardless of what time zone your device is currently in.
- The schedule time bar is now enabled by default.
- Added a context menu to the settings button on the toolbar to quickly access specific sections.
- Added a contribution option to the about button's context menu on the toolbar.
- Various UI updates, bug fixes, and other small changes.

## 3.2.1

_2024-09-20_

- Various UI updates, bug fixes, and other small changes.

## 3.2.0

_2024-08-02_

- Courses that offer multiple topics can now be assigned a topic on your plan. Select the topic from the course's information menu. When a topic is set for a course, the name of the course on your plan will include the topic.
- You can now view the topics historically offered within a course from the course's information menu.
- Location names are now displayed in the minimap when hovering over a section on the schedule.
- Custom sections can now have custom start and end dates, which affects the events when exporting your schedule to calendar.
- View a unit breakdown on your plan by clicking on the total units number at the bottom of the plan.
- A time bar can be displayed on your schedule to show the current time. This can be toggled in the settings and is disabled by default.
- The school to which a course or section belongs is now displayed in the course or section information menu. This is available for courses and sections offered since 2024 Fall.
- Catalog number wildcards are now supported in search. For example, something like 'CS 3xx' will match all COMP_SCI courses in the 300s.
- Fixed an issue where some courses would either change into a different course or disappear on reload due to a bug with handling cross-listed courses.
- Fixed an issue where some time filters would not filter correctly.
- Added a sleek new information notification for when you load a new version of Paper.
- Copy share link to the clipboard when clicking on the people icon in the toolbar, which is visible when a document is persistently shared.
- The number of results displayed in the search box at once has been reduced to improve search performance across devices. You can opt for more results to be displayed in the settings.
- Courses in plan search no longer show the description, prerequisites, foundational disciplines, nor distribution areas on the card, but you can still view more information by clicking on it and pressing the info button, which has been moved above the add buttons for convenience.
- Pre-built placeholder courses have been removed from Paper and will be removed from existing plans that have them. To add a placeholder course, you can create a custom course.
- Copy document ID to the clipboard when clicking on the document name in the toolbar.
- Various UI updates, bug fixes, and other small changes.

## 3.1.0

_2024-06-16_

- Modernized the codebase to improve maintainability.
- Removed unnecessary dependencies.

## 3.0.2

_2024-06-03_

- Updated the feedback button to use the new feedback system.

## 3.0.1

_2024-01-04_

- Various UI updates, bug fixes, and other small changes.

## 3.0.0

_2024-01-02_

- **CUSTOM COURSES AND SECTIONS**
  - Enhance your plan or schedule with custom courses and sections. This allows you to add things to your schedule that aren't in the course catalog.
  - With a new custom item creator menu, you can customize each element of the course or section, including the color, and make changes to it later.
  - Custom courses and sections are included when sharing or exporting a plan or schedule.
- **PAPER RATINGS**
  - View student-submitted overall course ratings, time commitment ratings, and grades for each course.
  - Submit your own ratings for courses you've taken.
- **PERSISTENT SHARING**
  - Share persistent links to your plans and schedules. When you update your plan or schedule, others can refresh to see the changes.
  - Easily access your friends' plans and schedules. When you use someone's persistent share link, their name and their document's name is saved to your Plans/Schedules tab so you can easily access it later.
- **IMPROVED SEARCH**
  - Partial text matching is now supported. For example, searching something like "intro sociol" will match "introduction to sociology".
  - You can now search by section topic, making specific sections in special topics classes (like CS 396) easier to find.
  - You can now filter by all available schedule time.
- **AUTOSAVE**
  - Modified plans and schedules linked to your account will automatically be saved as you make changes.
- **MORE COURSE INFO**
  - You can now view when a course has been offered in the past (the earliest being 2020 Fall). This was one of the most requested features since 2021, and now it's here!
  - You can share a link directly to the information of any course or section.
- **BETTER SECTION MANAGEMENT**
  - You can now hide specific times from a single section as needed. This is useful if a course section has exams, performances, or other one-time events that show as weekly events on the schedule.
- **REDESIGNED INTERNAL DATA SYSTEM**
  - Developers working with Paper APIs will have a better time.
  - This doesn't really affect the end user, but the custom courses and sections feature is possible because of this change.
- **A TON OF OTHER THINGS**
  - The schedule is now gray instead of green so it blends in well with the rest of the UI.
  - The mode switcher (buttons that switch between the plan view and the schedule view) has been given a new look, along with new transitions and animations.
  - The term selection menu (selecting year and quarter) was completely redesigned to be easier to use as the number of terms Paper supports grows.
  - Open a course's info menu in plan view right from search by pressing the "view more info" button after selecting a class in your search results.
  - Actions for a given year on the plan view have been moved into a context menu (press the three lines at the top right of a year to open).
  - Subjects with missing colors now have a color.
  - Weinberg's new foundational disciplines are now supported.
  - The browse menu in the search box now shows more schools and subjects.
  - The design of the appearance toggle has been refreshed. (Did you know Paper has a light AND dark mode? Check the settings!)
  - Fixed a bug where the Paper logo would sometimes not appear on schedules that are exported as an image.
  - UI elements on the map now look nicer.
  - Hopefully fixed a bug where the map would not load properly when switching between sidebar tabs.
  - Legacy plan and schedule URLs are completely discontinued. You can no longer load them from settings.
  - The Plan Northwestern and salad.nu bubbles in the about menu have been removed. This information is in the project attributions, which is now linked in the menu instead.
  - A bunch of other UI updates, bug fixes, and other small changes to improve functionality, accessibility and user experience.

## 2.6.2

_2023-09-18_

- Add support for dismissable banner notices.

## 2.6.1

_2023-07-10_

- Fixed a bug where account plans and schedules may not load and activate first even if they are the most recently edited.
- Various UI updates, bug fixes, and other small changes.

## 2.6.0

_2023-06-02_

- The URL save data system has been discontinued.
  - Read more about this change on my blog: https://dilan.blog/discontinuing-the-paper-url-save-data-system
  - Loading a legacy URL in your browser will not load any plan or schedule. Your most recently edited plan or schedule will be loaded.
  - Shortened links will still work and will be the only way to share a link to a copy of your plan or schedule with others.
  - Pressing "Export" then "Share link" will automatically generate a shortened link.
  - URLs can be loaded using the new "Load legacy URL" option in the general settings.
- Plans and schedules saved to an account can now be duplicated.
- The settings menu has been redesigned.
- Plan and schedule names are no longer automatically displayed in uppercase.
- Various UI updates, bug fixes, and other small changes.

## 2.5.1

_2023-05-08_

- Updated the exported schedule image.

## 2.5.0

_2023-05-07_

- Various UI updates, bug fixes, and other small changes.

## 2.4.2

_2023-05-02_

- Various UI updates, bug fixes, and other small changes.

## 2.4.1

_2023-04-26_

- Updated the buttons below the search bar.
- Various UI updates, bug fixes, and other small changes.

## 2.4.0

_2023-03-26_

**Plan**

- The search UI in the plan view has been updated and is now more similar to the schedule view.
- You can now remove the summer quarter from a year without having to remove all of the courses and refreshing the page.

**Schedule**

- You can now get a direct link to a room on Tech Room Finder from within a course section's information card. Just click on the room name if it has a solid underline.
- While a course section's information card is open, you can hover over a room name (both solid and dotted underlines) to see the location on the minimap.

## 2.3.0

_2023-03-21_

**General**

- The URL save data functionality can now be disabled in the settings.
- The about button has been removed from the account context menu to the toolbar (clicking on the logo still works).
- Various UI updates, bug fixes, and other small changes.

**Schedule**

- Seminar courses and other courses with a topic now have that topic displayed.
- Courses with multiple meeting patterns now have their other meeting patterns available on Paper.
- The minimap is no longer visible when the window height is too low.

## 2.2.4

_2023-02-15_

- Fixed the cache version number format.

## 2.2.3

_2023-02-14_

- Updated the cache version number format.

## 2.2.2

_2023-02-14_

- Internal information can now be viewed in the about menu.
- Various UI changes, bug fixes, and enhancements.

## 2.2.1

_2023-02-06_

- If a schedule term newer than the currently active one is available, a clickable message will appear in the top left corner.

## 2.2.0

_2023-01-30_

- **Notes!**
  - Add notes to plans or schedules saved to your account.
  - Notes sync across your devices but are not visible by others when sharing a link.
  - Drag the little notes window anywhere on the site.
  - Notes are limited to 2000 characters per plan or schedule.
- **Toolbar!**
  - Account stuff can be accessed from the toolbar (sign in, sign out, account settings, etc.).
  - Buttons from the old utility bar have been moved to the toolbar.
  - Some buttons from the taskbar have been moved to the toolbar.
  - The active plan's or schedule's name is now displayed in the toolbar instead of the taskbar.
- **Improved sharing!**
  - You can now shorten a link to a plan or schedule by pressing `Export -> Share link -> SHORTEN LINK`.
  - No need to share super long links to your plans or schedules anymore (especially plans because those links can get really long).
  - These shortened links only link to the current version of the plan or schedule just like the long links.
- The about menu is now accessible by clicking on the logo in the top left corner.
- The account plans and schedules tab has been redesigned.
- You can now press escape or click outside of the side card to close it.
- You can now press enter to submit pop-up menus that contain a single text input.
- The built-in feedback submission feature has been replaced with access to the knowledge base and external feedback submission system. Access the help center by pressing `Paper -> Help Center`.
- "My List" has been renamed to "Bookmarks".
- The taskbar now has less buttons and is more visible.
- Clickable elements now use the main cursor by default.
- Added a FERPA notice to the about menu as instructed by NUIT and the CS department. A link to Paper's relevant [privacy policy](https://www.dilanxd.com/privacy/) has also been added to the about menu.
- Updated the change log preview UI.
- Various UI changes and bug fixes.

## 2.1.3

_2022-12-31_

- Fixed a few bugs related to certain schedules exporting incorrectly or not at all.

## 2.1.2

_2022-12-30_

- Change log previews now show only the major and minor version numbers.
- The built-in feedback submission feature has been removed.

## 2.1.1

_2022-12-11_

- Alert modals can now include developer notices when necessary.

## 2.1.0

_2022-11-12_

**General**

- Rename plans and schedules saved to your account.
- Return to subject browsing using a back button even after a subject filter has been applied.
- If using a new version with significant enhancements for the first time, a change log preview modal will appear.
- Various UI changes and bug fixes.

**Plan**

- If a year has a summer quarter (four quarters fit in the same space as three), spacing is reduced so more class information is visible.

**Schedule**

- Filter schedule sections by distribution area.
- Save up to 20 schedules to your account (as opposed to 10 previously).
- A lot more information about each section is now available.
- View section information from within the search results (without having to add it to your schedule first).
- The minimap is now enabled by default because apparently a lot of people didn't know it existed. It can still be toggled in the full map view.
- Drastically increased the default opacity of the utility bar on the left side of the schedule so it's more obvious.
- If a section on your schedule is no longer offered in the upcoming quarter (thus the data is now unavailable), only that section will disappear from the schedule rather than Paper considering the entire schedule malformed.

## 2.0.2

_2022-11-03_

- Updated feedback submission information.
- Added ability to clear entire local course data cache.

## 2.0.1

_2022-11-01_

- Updated feedback submission information.
- Update alert option button styling.

## 2.0.0

_2022-10-31_

Plan Northwestern is now **Paper**, and has replaced both salad.nu and the original version of Plan Northwestern.

**General**

- **Powerful search!** Use the search filter and subject browsing to narrow search results by subject, meeting days and times (schedule only), section components (schedule only), instructor (schedule only), location (schedule only), distribution areas (plan only for now), and unit count (plan only).
- **Detailed course information!** View a LOT more data about each course or section, all from within Paper.
- **Advanced data management and caching system!** Get the latest data without taking a performance hit! The advanced client-side and server-side caching system allows for data only to be refreshed if actually necessary.
- Submit feedback without having to leave the site.
- Improved settings menu for more customizability.
- Various UI and text changes, dependency updates, and bug fixes.

**Schedule (NEW!)**

- Course sections for a specific quarter can be scheduled within a week view.
- The existing account system and URL system have been adapted to work with schedules.
- **Exports!**
  - Export schedule as an image (1920x1080 regardless of device).
  - Export schedule as an ICS file (supported by popular calendar apps like Apple Calendar, Google Calendar, and Outlook).
- **Map!**
  - View a full-screen map to see where all of your courses are from a nice, large view (and hover over sections on the map sidebar to fly to those locations).
  - Toggle the minimap, which appears at the bottom of the search menu and will show the location of a section you're hovering over.
- **Huge data set!** Data for the past 8 years (starting Fall 2020) is accessible.

## 1.2.3

_2022-09-22_

- Added system status embed.

## 1.2.2

_2022-07-05_

- Fixed a bug with My List.

## 1.2.1

_2022-07-04_

- Updated the 'About' menu.

## 1.2.0

_2022-06-24_

- **Accounts!** You can now optionally create an account and link up to 5 plans to it.
  - Sign in to Plan Northwestern using your auth.dilanxd.com account (supports Google authentication) from any device.
  - Seamlessly switch between different plans.
  - Make modifications like normal, except now you'll see a save button appear when there are unsaved changes.
  - Everything else remains the same (account is not required, plan URLs still work and are automatically updated as different plans are loaded).
- **Significant UI changes!** A lot of changes were made to the user interface to improve functionality and ease-of-use.
  - The task bar buttons (what used to be the gray rounded-rectangle buttons at the top left) have been changed to icons instead of text and have been moved to the bottom of the screen. This allows the search box to be a bit larger (which can have a big impact on smaller screens when browsing courses). This also adds room for the new tab-switching system and looks a bit nicer (it's been moved to the bottom for the convenience of mobile users).
  - My List has been moved from above the plan to a tab on the sidebar. This makes it easier to drag courses to and from your plan (especially on years lower on the screen because you'd have to scroll).
  - Courses in My List are now compact so more can be seen at once, given the smaller view area.
  - A bookmark button has been added to the corners of the classes that appear in the search results (when the class is hovered). This provides an easy way to bookmark courses since dragging them into your bookmarks list directly from the search box is no longer possible.
  - The total unit count and the 'Add Year' button have been moved below the plan itself.
  - Added a button for clearing a specific year's courses to each year on the plan (next to the button for minimizing and the button for adding a summer quarter).
  - Added a button for clearing the search query.
  - Added hover tooltips to most of the icon buttons.
  - The guide that appears in the search box when empty has been updated to include the new accounts feature.
- **Animations!** Some animations have been added across the site to improve the user experience.
  - Many of the animations can be disabled with the new "Reduced motion" setting.
- Made some other small UI changes.
- Updated all project dependencies to their latest versions.
  - This was a breaking change for [React DnD](https://react-dnd.github.io/react-dnd/about), so parts of draggable components and their destinations had to be redone.

## 1.1.3

_2022-02-18_

- The color of the deepest background, the one behind the main UI, now matches the color of the main UI background, which changes as you toggle dark mode.
- Some other small changes were made.

## 1.1.2

_2022-02-11_

- Made it way easier to scroll through search and your plan on mobile devices and at smaller window sizes.
- Fixed some UI bugs.

## 1.1.1

_2022-02-11_

- Certain window sizes made the UI look too crushed. Now, the UI will switch to its "vertical" mode (as seen on mobile devices) at a bit larger of a window size than before.

## 1.1.0

_2022-02-08_

- **My List!** Bookmark courses and count AP/IB credit.
  - You can bookmark courses that you might be interested in but don't have a spot for on your schedule at the moment.
  - You can mark courses that you want to count for credit (like courses you've received AP/IB credit for) and they'll be included in your total unit count.
  - View My List by pressing the "My List" button at the top right.
  - Add courses to My List by dragging them into the section you want. You can also directly bookmark a course using the bookmark button inside a course's information menu or by clicking on a course in the search box and using the bookmark and for-credit buttons.
  - This data is saved in the URL like the plan contents are.
- **More course data!** I worked with the Office of the Registrar to get a LOT more course data than I had before, including data for courses from TGS, SPS, and other graduate programs. Let me know if you notice any course data errors by submitting [feedback](/FEEDBACK.md).
- Search results are now sorted so that matches to a course subject/number comes before matches to a course's name.
- Some UI modifications were made to class cards.
  - The info button was removed. Click anywhere on the card to open its info menu.
  - The delete button was moved to the top right to stay out of the way of the text.
  - Unit count is now shown on the class card when in the search box and on your plan if you have the "show more info on classes" setting enabled. You can also see it in a course's info menu.
- Some UI modifications were made to the search box.
  - The buttons for adding a class to a quarter without dragging now look different and correctly match the quarter colors.
- Some other small UI and text modifications were made.
- You can now minimize years if you want to hide their contents.
- Rounding issues that arose among 0.33, 0.34, and 0.5 courses (especially when combined) have been fixed.
- Course data contribution was removed. It wasn't really added in the first place anyway, though.
- Added a calendar icon next to the name and as a favicon.
- Added a button that links to this change log in the "About" menu. Also, clicking on my name links you to my website. Why not, right?

## 1.0.0

_2021-12-22_

- Base features were added
