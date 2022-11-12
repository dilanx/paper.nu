# Paper Change Log

### 2.1.0

_2022-11-XX_

**General**

- Rename plans and schedules saved to your account.
- Return to subject browsing using a back button even after a subject filter has been applied.
- Various UI changes and bug fixes.

**Schedule**

- Filter schedule sections by distribution area.
- Save up to 20 schedules to your account (as opposed to 10 previously).
- A lot information about each section is now available.

### 2.0.2

_2022-11-03_

- Updated feedback submission information.
- Added ability to clear entire local course data cache.

### 2.0.1

_2022-11-01_

- Updated feedback submission information.
- Update alert option button styling.

### 2.0.0

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

### 1.2.3

_2022-09-22_

- Added system status embed.

### 1.2.2

_2022-07-05_

- Fixed a bug with My List.

### 1.2.1

_2022-07-04_

- Updated the 'About' menu.

### 1.2.0

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

### 1.1.3

_2022-02-18_

- The color of the deepest background, the one behind the main UI, now matches the color of the main UI background, which changes as you toggle dark mode.
- Some other small changes were made.

### 1.1.2

_2022-02-11_

- Made it way easier to scroll through search and your plan on mobile devices and at smaller window sizes.
- Fixed some UI bugs.

### 1.1.1

_2022-02-11_

- Certain window sizes made the UI look too crushed. Now, the UI will switch to its "vertical" mode (as seen on mobile devices) at a bit larger of a window size than before.

### 1.1.0

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

### 1.0.0

_2021-12-22_

- Base features were added
