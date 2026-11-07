# Agent Hub

One line: Agent Hub helps developers discover, register, and run AI agents without hunting across repos.

Idea: A hub to discover, register, and run AI agents.

## Who
Developers and teams who build or use AI agents.

## Core job
Find an agent that fits a task, inspect it, and run it with a message, or register your own.

## Flows
(see READINESS.md)

## Non-goals
- No auth/accounts in v1 (anonymous registration).
- No billing or payments.
- No real LLM orchestration; agents are registered endpoints or built-in mocks.

## Success metric
A new visitor can find an agent and get a reply in under 60 seconds.

## Stack and hosting
Run: npm run dev | Test: npm test | Deploy: railway up
Stack: Next.js 16 (App Router, TS), Tailwind 4, SQLite (better-sqlite3), Node >=22.5.

## Data model
agents(id, name, description, tags, endpoint, author, created_at)

## Decisions
- 2026-11-07 - Anonymous registration; no auth in v1 to ship fast.
- 2026-11-07 - Built-in mock runners for seeded agents so the hub works without external API keys.
- 2026-11-07 - SQLite on local disk; deploy to Railway for persistence.

## Open questions
- (none)
