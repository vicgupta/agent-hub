Evidence for READINESS.md rows. Layout: qa/<row-id>/<date>-<width>.png and qa/<row-id>/notes.md;
qa/ux/, qa/gates/, qa/perf/, qa/prod/ for reviews, gates, Lighthouse and production smoke tests.
Keep it small: overwrite superseded screenshots. Never store secrets or real user data here.

## How to QA this project
Testers start here and add what they had to work out, so the next one skips it.
- Start: <local command and URL, production URL>
- Fresh state and test data: <how to get a new user, reset storage, seed data; never a real third-party account>
- Selectors and state: <stable selectors, storage keys, ids that change>
- Tricks: <print, clipboard, downloads, emails, payments in test mode, slow or flaky parts>
