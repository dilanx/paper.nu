# Plan Northwestern Change Log

### 1.2.0

_2022-05-XX_

-   Made some small UI changes.
-   Updated all project dependencies to their latest versions.
    -   This was a breaking change for [React DnD](https://react-dnd.github.io/react-dnd/about), so parts of draggable components and their destinations had to be redone.

### 1.1.3

_2022-02-18_

-   The color of the deepest background, the one behind the main UI, now matches the color of the main UI background, which changes as you toggle dark mode.
-   Some other small changes were made.

### 1.1.2

_2022-02-11_

-   Made it way easier to scroll through search and your plan on mobile devices and at smaller window sizes.
-   Fixed some UI bugs.

### 1.1.1

_2022-02-11_

-   Certain window sizes made the UI look too crushed. Now, the UI will switch to its "vertical" mode (as seen on mobile devices) at a bit larger of a window size than before.

### 1.1.0

_2022-02-08_

-   **My List!** Bookmark courses and count AP/IB credit.
    -   You can bookmark courses that you might be interested in but don't have a spot for on your schedule at the moment.
    -   You can mark courses that you want to count for credit (like courses you've received AP/IB credit for) and they'll be included in your total unit count.
    -   View My List by pressing the "My List" button at the top right.
    -   Add courses to My List by dragging them into the section you want. You can also directly bookmark a course using the bookmark button inside a course's information menu or by clicking on a course in the search box and using the bookmark and for-credit buttons.
    -   This data is saved in the URL like the plan contents are.
-   **More course data!** I worked with the Office of the Registrar to get a LOT more course data than I had before, including data for courses from TGS, SPS, and other graduate programs. Let me know if you notice any course data errors by submitting [feedback](/FEEDBACK.md).
-   Search results are now sorted so that matches to a course subject/number comes before matches to a course's name.
-   Some UI modifications were made to class cards.
    -   The info button was removed. Click anywhere on the card to open its info menu.
    -   The delete button was moved to the top right to stay out of the way of the text.
    -   Unit count is now shown on the class card when in the search box and on your plan if you have the "show more info on classes" setting enabled. You can also see it in a course's info menu.
-   Some UI modifications were made to the search box.
    -   The buttons for adding a class to a quarter without dragging now look different and correctly match the quarter colors.
-   Some other small UI and text modifications were made.
-   You can now minimize years if you want to hide their contents.
-   Rounding issues that arose among 0.33, 0.34, and 0.5 courses (especially when combined) have been fixed.
-   Course data contribution was removed. It wasn't really added in the first place anyway, though.
-   Added a calendar icon next to the name and as a favicon.
-   Added a button that links to this change log in the "About" menu. Also, clicking on my name links you to my website. Why not, right?

### 1.0.0

_2021-12-22_

-   Base features were added
