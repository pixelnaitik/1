# VoyageSecure SafeTrail AI — Execution Board

Use this file as the lightweight source of truth until issues are migrated to GitHub Projects/Jira. Keep only actionable work here. Every item has one owner, acceptance criteria, and a phase.

## Working agreement

- Owners: **AI** = AI Engineer, **BE** = Backend, **FE** = Frontend/Mobile, **DEV** = DevOps/Integration.
- Mark an item complete only after review, tests and staging verification.
- Put blockers beneath the item with date, impact and requested decision.
- Do not start P1/P2 work while a related P0 acceptance criterion is failing.

## Phase 1 — Foundation (Days 1–7)

- [ ] **P1-01 [DEV, P0]** Create monorepo, env template, CI lint/test/build and protected `main` branch.  
  Done: fresh clone passes checks; secrets scan is enabled.
- [ ] **P1-02 [FE, P0]** Build mobile UI tokens, auth screens and reusable loading/error/empty components.  
  Done: keyboard/touch friendly, 360 px layout and WCAG AA contrast.
- [ ] **P1-03 [BE, P0]** Implement registration/login/logout/profile with validation and auth middleware.  
  Done: duplicate/login/expired-token tests pass; password never logged.
- [ ] **P1-04 [FE, P0]** Integrate Maps, consent gate, current location, manual-city fallback and recenter.  
  Done: denied/timeout/API-error paths are usable.
- [ ] **P1-05 [AI, P0]** Create pilot-city data card and approved seed sample.  
  Done: source, license, date, field definition and limitations documented.
- [ ] **P1-06 [DEV, P0]** Deploy staging and run new-user smoke test on mobile.  
  Done: URL, rollback notes and test account are available.

## Phase 2 — Intelligence (Days 8–14)

- [ ] **P2-01 [BE, P0]** Add PostGIS migrations, incident/context/import tables and indexes.  
  Done: fresh DB migration succeeds; spatial query explain plan uses index.
- [ ] **P2-02 [AI, P0]** Build idempotent incident normalization/import with rejection report.  
  Done: re-running seed creates no duplicates; invalid rows are visible.
- [ ] **P2-03 [BE, P0]** Expose viewport hotspot endpoint with cache and validation.  
  Done: P95 <500 ms on seeded data and API fixture committed.
- [ ] **P2-04 [AI, P0]** Implement risk v1 formula, confidence/freshness and 30+ golden scenarios.  
  Done: ≥95% expected risk-band agreement; missing feed behavior tested.
- [ ] **P2-05 [FE, P0]** Create heatmap/cluster layer, safety card and “why this score?” sheet.  
  Done: visual and text equivalents, stale/limited data states complete.
- [ ] **P2-06 [DEV, P1]** Add context-adapter health check, load test and risk dashboard.  
  Done: provider timeouts trigger fixture/neutral fallback visibly.

## Phase 3 — Response (Days 15–21)

- [ ] **P3-01 [AI, P0]** Curate and verify pilot-city police/hospital/ambulance directory.  
  Done: every demo entry has source, phone/address and verification date.
- [ ] **P3-02 [BE, P0]** Build nearby-service and safe-route endpoints.  
  Done: routes compare ETA/safety factors; provider failure is handled.
- [ ] **P3-03 [FE, P0]** Build locator and route-comparison screens with call/directions actions.  
  Done: list-map sync, no-results and disclaimer states work.
- [ ] **P3-04 [BE, P0]** Build trusted contacts, SOS state machine and location-share expiry.  
  Done: idempotency/RBAC/cancellation/expiry integration tests pass.
- [ ] **P3-05 [FE, P0]** Build hold-to-confirm SOS and live-share status UI.  
  Done: three users complete a controlled drill in ≤10 seconds.
- [ ] **P3-06 [DEV, P0]** Configure notification adapter and responder demo console.  
  Done: controlled SOS is observable end-to-end; retries logged.

## Phase 4 — Launch (Days 22–30)

- [ ] **P4-01 [AI, P0]** Finalize assistant corpus, prompt, guardrails and multilingual evaluation set.  
  Done: emergency hallucination count is zero; sources and fallback tested.
- [ ] **P4-02 [BE, P0]** Build assistant and notification APIs; enforce action allowlist.  
  Done: prompt injection, ownership and validation tests pass.
- [ ] **P4-03 [FE, P0]** Build accessible assistant, language selector, notification inbox/preferences and offline states.  
  Done: English/Hindi/pilot language core flow verified by fluent reviewer.
- [ ] **P4-04 [DEV, P0]** Production-like deployment, monitoring, backup/rollback and demo mode.  
  Done: rollback and external-provider outage drill completed.
- [ ] **P4-05 [ALL, P0]** Run UAT, accessibility/security/performance checks and defect triage.  
  Done: no P0/P1 outstanding; evidence recorded.
- [ ] **P4-06 [ALL, P0]** Prepare 6-minute pitch, architecture/data ethics slides and 90-second backup video.  
  Done: two timed rehearsals complete without an unplanned dependency.

## Current blockers / decisions

| Date | Item | Blocker or decision needed | Owner | Next action |
|---|---|---|---|---|
| — | — | Select pilot city and approved data sources | Team + mentor | Decide by Day 1 |
| — | — | Choose managed auth and hosting provider | DEV + BE | Decide by Day 1 |
| — | — | Confirm Maps/Routes budget and key restrictions | DEV | Confirm by Day 2 |

## Daily checklist

- [ ] 10-minute stand-up: yesterday / today / blocker.
- [ ] Sync API contract before frontend integration.
- [ ] Review open PRs; one reviewer minimum.
- [ ] Deploy/verify staging; log critical failures.
- [ ] Update this board and rehearse one demo path by Phase 3 onward.
