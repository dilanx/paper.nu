# Contributing to Paper

Thank you for your interest in contributing to Paper! Contributions are welcome from everyone. I know this is long, but I've included the important information needed to develop effectively for Paper.

## About this project

**Paper** is a website built to help Northwestern students plan out their courses.

## About this repository

This repository contains **only the client side** for Paper. At the moment, the server side is closed source. However, if you're interested in adding something to the server side (for example, new API endpoints involving user data or backend computation), let me know and I'd be happy to figure something out! I love creative ideas and am open to collaboration on cool things.

## Setting up your development environment

You're welcome to use any development environment you'd like, but I use [Visual Studio Code](https://code.visualstudio.com/).

1. Fork the repository, clone it, and navigate within
2. Install dependencies with `npm install`
3. Start the development server with `npm start`

You may want to set up [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) in your editor to help with code linting and formatting. While you don't need to do this locally, all pull requests made to Paper will be checked for linting and formatting errors.

## Finding something to work on

### Ideas

You can check out the [roadmap](./README.md#roadmap) for ideas or come up with some on your own!

### Avoid existing features

You're welcome to add enhancements to existing features, but make sure what you're building doesn't already exist. You can [explore the application](https://www.paper.nu), [read through the documentation](https://support.dilanxd.com/paper/), and [look through the code](https://github.com/dilanx/paper.nu/tree/main/src) to see what's already there.

### Avoid or collaborate on duplicate work

Check out the [pull requests](https://github.com/dilanx/paper/pulls) to see if someone is already working on something you're interested in. If it looks like it's not progressing, you could totally do the same thing.

### Limitations

Here are a few limitations from ideas that have been brought up a lot:

- **CTEC integration**

  The Northwestern University CTEC Office does not have a public API for accessing CTEC data because the data is locked behind an authentication wall, along with the fact that CTECs must be inaccessible to those who do not complete their CTECs the previous quarter. Additionally, scraping the data on your own is illegal. [Paper Ratings](https://support.dilanxd.com/paper/ratings/) is a simple alternative that has been approved by the Office of the Registrar.

- **Very specific course ratings**

  [Paper Ratings](https://support.dilanxd.com/paper/ratings/) is a simple alternative to CTEC data that has been approved by the Office of the Registrar. However, they have advised against allowing section-specific ratings with professor data (like RateMyProfessors) since inaccuracies here can be problematic to the professors and the university. CTECs should be prioritized, but Paper Ratings allows for a general idea of how a course is overall.

- **Major requirements**

  Major requirements are not available in a public API. I'm trying to reach out to schools to see what I can get but haven't had much luck yet. Right now, major requirements change somewhat often and are specific to different departments within schools, so there's a LOT of stuff go through if it were done manually. If you have ideas around this, I'd love to hear them!

## Starting to make changes

Right when you start working on something, I'd recommend creating a pull request to **`dev`** (not `main`), even before you finish. This helps others keep track of what's currently being worked on and can help you get feedback early on. You don't have to though; just note that others may start working on the same thing if you don't.

Use labels on the PRs, ensuring you only have one of the following at a time:

- **in progress** - your PR is still being worked on and is not complete
- **help wanted** - you need help with something in your PR
- **needs review** - your PR is ready for review

## Developing your changes

Explore the code to see how things are done and follow the patterns you see. If you have ideas for improvement, go for it! Just make sure to keep things consistent and make good changes in other places if needed to keep things nicely organized.

### User experience

At the core of Paper is the functionality and user experience, which includes the user interface design, consistency, and performance. Here are some things to keep in mind:

- Deviation from the design of the rest of the application should be avoided and may be rejected. New UI enhancements are always welcome (I LOVE change for the better lol), but making something that does not look like it belongs in the application should be avoided.

- Performance is important. Paper handles a LOT of course data and loads big chunks of data often. The client side includes a caching system to help minimize reloading big chunks of data when there's no new data to load. Make sure to be mindful of how your changes affect performance and network usage.

- Functionality should be intuitive at its core. The more features you have, the more convoluted the application becomes. However, we want as many cool and useful features as possible! The balance is key. Make sure your changes are intuitive and easy to use.

### Code quality

Code quality is important to keep the application maintainable and easy to work with. Here are some things to keep in mind:

- **ESLint** linting and quality checks are run on all pull request commits. You can use the [ESLint VS Code extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) to get live feedback on your code in your editor. You can also run `npm run lint:eslint` to check for linting errors across the application.

- **Prettier** formatting checks are run on all pull request commits. You can use the [Prettier VS Code extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) to enable automatic formatting on save. You can also run `npm run lint:prettier` to check for formatting errors across the application.

### Testing

Testing is important to ensure that your changes work as expected. Paper does not have much of a testing suite at the moment, but make sure you try to break your features and ensure they work as expected through extensive testing, including of any edge cases you can think of.

## Submitting your changes

When you're ready to submit, update your pull request label to `needs review` or create a pull request if you haven't already.

Maintainers will review your changes and provide feedback. If everything looks good, your changes will be released with the next app version!

## Acknowledging contributions

At the core of the Paper is its functionality and user experience and not watermarks or credits. However, credits (including of myself) are available in the about menu when clicking on the Paper logo or when pressing `About` on the toolbar. All contributors will be listed on GitHub, but those that make significant contributions will be listed in the same about menu as well!
