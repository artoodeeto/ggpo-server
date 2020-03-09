---
id: creating_branch
title: Creating Branch 🌉
sidebar_label: Creating Branch 🌉
---

## For creating a branch

When you are working on feature, or fixing a bug you will need to create a branch.

Our convention is we prefix our branch so that reviewer will have an idea on what the branch is about.

**Breaking changes:** A big feature/refactor which includes a breaking change

`git checkout -b breaking/breaking-bad`

**Feature branch:** A new feature

`git checkout -b feat/the-new-feature`

**Fix branch:** A bug fix

`git checkout -b fix/the-bug-fix`

**Refactor branch:** A code change that neither fixes a bug nor adds a feature

`git checkout -b refactor/some-code`

**Configurations:** Updating configurations of linter, ts, prettier, husky etc.

`git checkout -b config/the-config`

**Test:** Adding missing tests or correcting existing tests

`git checkout -b test/the-testing`

**Documentation:** changing the readme or adding additional documentation

`git checkout -b docs/the-documentation-branch`
