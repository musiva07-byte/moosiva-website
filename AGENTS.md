# CLAUDE.md — Moosiva Ecommerce Website

## Application Building Context

This project is the public ecommerce / product showcase website for **Moosiva Lux Wear Bahrain**.

Read the following files in order before implementing or making any architectural decision:

1. `context/project-overview.md` — public website definition, customer flow, ecommerce scope, and success criteria
2. `context/architecture.md` — system structure, Supabase connection, public/private boundaries, storage model, and invariants
3. `context/ui-context.md` — Moosiva ecommerce theme, colors, typography, layout, and component conventions
4. `context/code-standards.md` — implementation rules, Next.js/Supabase conventions, validation, security, and file organization
5. `context/ai-workflow-rules.md` — spec-driven development workflow, scoping rules, and delivery approach
6. `context/progress-tracker.md` — current phase, completed work, open questions, and next steps

Update `context/progress-tracker.md` after each meaningful implementation change.

If implementation changes architecture, scope, UI rules, storage model, or code standards, update the relevant context file before continuing.

## Existing Business Context

- Public website domain: `www.moosivabh.com`
- Existing internal operations system: `operation.moosivabh.com`
- The ecommerce website is a **separate Next.js project**.
- The website connects to the **same Supabase project/database** used by the operations system.
- The operations system remains the source of truth for products, variants, prices, stock, customers, order requests, and website publishing controls.
- The public website must never expose internal cost/profit/supplier/staff data.

## Current Phase Instruction

Start from Phase 1 in `context/progress-tracker.md`.

Do not build everything at once. Use small, verifiable units.
