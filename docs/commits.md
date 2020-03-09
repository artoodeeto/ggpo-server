---
id: commits
title: Committing 🤞
sidebar_label: Committing 🤞
---

# Committing and pre-commit hooks

Commit messages
We encourage people to write meaningful [commit messages](https://chris.beams.io/posts/git-commit/).

### Style Guide

We are [using airbnb style guide](https://github.com/airbnb/javascript). We can also add or override some styles just by editing `.eslintrc.js`. We are also using prettier for our code formatter, you can add or edit it thru `.prettierrc.js`.

### Husky hooks

When commits are made, a git precommit hook runs via [husky](https://github.com/typicode/husky). It will run all the test for you, if all test passed then you will be allowed to commit the changes and if it fails then you have to fix the failing test.

As of now linting will be done if you installed [prettier](https://github.com/prettier/prettier) and [eslint](https://eslint.org/) in your editor. I'm planning to add [lint-stated](https://github.com/okonet/lint-staged) to add it into the precommit hook.

<!-- and lint-staged. ESLint, prettier, and Rubocop will run on your code before it's committed. If there are linting errors that can't be automatically fixed, the commit will not happen. You will need to fix the issue manually then attempt to commit again. -->

<!-- **_Note:_** if you've already installed the husky package at least once (used for precommit npm script), you will need to run yarn --force or npm install --no-cache. For some reason, the post-install script of husky does not run when the package is pulled from yarn or npm's cache. This is not husky specific, but rather a cached package issue. -->
