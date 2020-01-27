---
id: sync
title: Syncing Local Branch
sidebar_label: Syncing
---

Now that you have the source code, you need to keep updating it. Do this every time you make a pull request.

Syncing Directly Cloned Branch (you didn't forked the branch):

1. If you are not on the master branch `git checkout master`
2. `git pull`
3. `git checkout -b` your branch

Syncing Forked Branch:

1. Setup your upstream `git remote add upstream https://github.com/artoodeeto/ggpo-server.git`
2. Pull with rebase against upstream `git pull --rebase upstream master`
3. Make sure your on local master branch `git checkout master`
4. `git rebase upstream/master`
5. Push to your forked repo `git push --f origin master`

### Additional Resources
- [Syncing a fork](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/syncing-a-fork)
- [SO](https://stackoverflow.com/questions/7244321/how-do-i-update-a-github-forked-repository)