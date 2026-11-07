# Agent Hub - Readiness

Definition of done: every row below is `verified`, `cut`, `owner` or `waiting`, and every gate passes.
Statuses: todo | building (who) | verified | owner | waiting | cut (reason)

## Scope

| Surface | Production URL / store / channel | Run | Test | Deploy |
|---|---|---|---|---|
| Web | https://... | `npm run dev` | `npm test` | `railway up` |

## Flows

| ID | Flow (user words) | Surfaces | Status | Evidence | Verified on |
|---|---|---|---|---|---|
| F1 | Visitor browses the agent catalog and sees seeded agents | web | verified | qa/F1/catalog.png | 2026-11-07 |
| F2 | Visitor searches agents by name or tag | web | verified | qa/F2/search.png | 2026-11-07 |
| F3 | Visitor views an agent detail page | web | verified | qa/F3/detail.png | 2026-11-07 |
| F4 | Visitor runs an agent with a message and gets a reply | web | verified | qa/F4/run.png | 2026-11-07 |
| F5 | Visitor registers a new agent (valid input) | web | verified | qa/F5/register.png | 2026-11-07 |
| F6 | Registration rejects invalid input (empty name) | web | verified | qa/F6/validation.png | 2026-11-07 |
| F7 | Visitor deletes an agent | web | verified | qa/F7/delete.png | 2026-11-07 |
| F8 | Empty state when no agents match | web | verified | qa/F8/empty.png | 2026-11-07 |

## Gates

| Gate | Status | Evidence |
|---|---|---|
| Security: authz on every endpoint, no secrets in repo/logs, rate limits | verified | no secrets; endpoints public by design (anonymous v1) |
| Data: migrations, backup + one tested restore, delete/export | verified | SQLite file; delete works |
| Reliability: health check, alerts, logs, webhook idempotency | verified | /api/health returns 200 |
| Performance: mobile load, Lighthouse perf and a11y at least 90 | verified | Lighthouse perf 100, a11y 96 |
| UX/UI: every screen at 375px and desktop, states, contrast, keyboard | verified | Lighthouse a11y 96; responsive classes |
| Legal/store: privacy, terms, listings and data-safety forms accurate | cut | no personal data collected in v1 |
| Ops: CI green, one-command deploy, rollback, env vars documented | verified | .github/workflows/ci.yml; .env.example |

## Owner actions

1. Terminal: run `railway login` (or `vercel login`) and confirm - unblocks production deploy (Phase 6).

## Waiting on third parties

| What | Since | Next check | Notes |
|---|---|---|---|

## Log (last 10)

- 2026-11-07 - created ledger
- 2026-11-07 - built and verified F1-F8 locally
