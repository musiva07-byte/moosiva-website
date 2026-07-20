# AI Workflow Rules — Moosiva Ecommerce Website

## Approach

Build this project incrementally using a spec-driven workflow. The context files define what to build, how to build it, current decisions, and what is complete. Always implement against these specs. Do not infer or invent behavior from scratch.

This is a separate public ecommerce website that connects to the same Supabase database as the existing operations system. The operations system must remain safe and unaffected.

## Scoping Rules

- Work on one feature unit at a time.
- Prefer small, verifiable increments over large speculative changes.
- Do not combine unrelated boundaries in a single implementation step.
- Do not build payment gateway, customer login, or complex cart unless the context files are updated first.
- Do not modify the operations system project unless explicitly instructed.
- Do not expose internal cost/profit data publicly.
- Do not implement stock deduction from public website requests.

## When to Split Work

Split an implementation step if it combines UI pages and database migrations, product listing and checkout mutation logic, public website work and operations system work, Supabase RLS/schema changes and frontend styling, multiple unrelated API/server actions, or behavior not clearly defined in the context files.

If a change cannot be verified end to end quickly, the scope is too broad. Split it.

## Handling Missing Requirements

- Do not invent product behavior not defined in the context files.
- If a requirement is ambiguous, resolve it in the relevant context file before implementing.
- If a requirement is missing, add it as an open question in `progress-tracker.md` before continuing.
- If implementation requires operations-system changes, document that dependency in `progress-tracker.md` first.

## Protected Files

Do not modify generated UI library internals, third-party package files, deployed operations system project files, or Supabase production data cleanup scripts unrelated to the ecommerce website unless explicitly instructed.

## Keeping Docs in Sync

Update the relevant context file whenever implementation changes architecture or boundaries, storage model decisions, public/private data rules, website order request model, code conventions, feature scope, or UI design rules.

Update `context/progress-tracker.md` after each meaningful implementation change.

## Before Moving to the Next Unit

1. The current unit works end to end within its defined scope.
2. No invariant defined in `architecture.md` was violated.
3. Public website does not expose internal business data.
4. `progress-tracker.md` reflects completed work and next steps.
5. Lint/typecheck/tests/build pass.
