# Figma Handoff: Tournament UX Overhaul

## Objective
Redesign tournament creation, management, scheduling, and scoring for faster operator workflows while preserving all existing API contracts and route paths.

## Constraints (Locked)
1. Keep existing route URLs unchanged.
2. Keep existing backend endpoints unchanged.
3. Keep existing database schema unchanged.
4. Preserve auth token flow and role restrictions.

## Frame Map
Use this frame map when building or reviewing Figma artboards.

### Desktop Frames (1440w)
1. `T-01 Create Wizard Step 1` -> `/events/create`
2. `T-02 Create Wizard Step 2` -> `/events/create/format`
3. `T-03 Create Wizard Step 3 Publish` -> `/events/create/registration`
4. `T-04 Director Home` -> `/events/:id/manage`
5. `T-05 Tournament Details` -> `/events/:id/details`
6. `T-06 Scheduler Tab` -> `/events/:id/schedule` (scheduler mode)
7. `T-07 Seeds and Pools Tab` -> `/events/:id/schedule` (board mode)
8. `T-08 Event Viewer` -> `/events/:id`
9. `T-09 Edit Tournament` -> `/events/:id/edit`

### Mobile Frames (390w)
1. `TM-01 Create Step 1`
2. `TM-02 Create Step 2`
3. `TM-03 Create Step 3`
4. `TM-04 Director Home`
5. `TM-05 Scheduler`
6. `TM-06 Seeds and Pools`
7. `TM-07 Event Viewer Alerts`

## Interaction Notes
1. Create wizard:
- Keep a persistent stepper, draft state, and route-aware navigation.
- Publish action creates tournament once, then persists each division sequentially.

2. Pools and seeding:
- Drag and drop remains primary on desktop.
- Mobile quick-move selectors are available for pool reassignment.
- Changes are staged locally and only persist on explicit save.

3. Pool lane controls:
- Add lane button always available.
- Remove lane button only visible for empty lanes.

4. Match scheduling:
- Provide auto-generate and manual scheduling paths in the same route section.
- Keep edit-in-place controls for scheduled matches.

5. Scoring:
- Guided game row entry with previewed winner state.
- Save posts to existing match results endpoint and refreshes stats.

6. Event alerts:
- Show in-app alerts to authenticated users based on team participation.

## Component Inventory
- Global navigation shell
- Page shell header
- Section cards/panels
- Status pills and inline banners
- Wizard stepper
- Form controls (input/select/date/time)
- Data tables
- Draggable registration cards
- Mobile quick-move controls
- Save/reset action rows

## Route and API Parity Mapping
- `/events/create*` -> `POST /api/tournaments`, `POST /api/tournaments/:id/divisions`
- `/events/:id/manage` -> `GET /api/tournaments/:id`
- `/events/:id/details` -> `GET /api/tournaments/:id/details`
- `/events/:id/schedule` ->
  - `GET /api/tournaments/:id/divisions`
  - `GET /api/tournaments/:id/registrations`
  - `PATCH /api/tournaments/:id/registrations/reorder`
  - `POST /api/tournaments/:id/divisions/:divisionId/pools/generate`
  - `POST /api/tournaments/:id/divisions/:divisionId/matches/auto-generate`
  - `GET /api/tournaments/:id/matches/candidates`
  - `GET /api/tournaments/:id/matches`
  - `POST /api/tournaments/:id/matches`
  - `PATCH /api/tournaments/:id/matches/:matchId`
  - `POST /api/tournaments/:id/matches/:matchId/results`
  - `GET /api/tournaments/:id/stats`
- `/events/:id` -> `GET /api/tournaments/:id`, `GET /api/tournaments/:id/my-match-alerts`
- `/events/:id/edit` -> `GET /api/tournaments/:id`, `PUT /api/tournaments/:id`

## Compatibility Notes
- No schema changes required.
- No new secret dependencies required.
- Existing role middleware remains authoritative.

AI Disclosure: Drafted with AI assistance.
Validated By: GraysonWills
Validation Date: 2026-02-28
