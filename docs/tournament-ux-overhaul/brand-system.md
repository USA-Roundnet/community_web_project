# Tournament Operator Console Brand System

## Visual Principles
1. Fast operator cognition: prioritize state visibility, save boundaries, and action clarity over decoration.
2. Card chunking: group related operations into independent cards to reduce context switching.
3. Progressive detail: keep primary actions visible first, reveal deeper controls within section context.
4. Mobile parity: preserve core operations on small screens with compact controls and fewer simultaneous panels.

## Scope Inventory
In-scope route surfaces:
- `/events/create`
- `/events/create/format`
- `/events/create/registration`
- `/events/:id`
- `/events/:id/manage`
- `/events/:id/edit`
- `/events/:id/details`
- `/events/:id/schedule`

Out-of-scope:
- Auth behavior and backend authorization logic
- API contracts and database schema

## Token System
Defined in `/Users/grayson/Documents/New project/community_web_project_15_19/frontend/src/features/tournament-ui/tokens.css`.

### Typography
- Display: `Space Grotesk`
- Body/UI: `IBM Plex Sans`

### Color Roles
- Primary action: `--op-primary` / `--op-primary-strong`
- Secondary action: `--op-secondary`
- Accent/info: `--op-accent`
- Success: `--op-success`
- Warning: `--op-warning`
- Danger: `--op-danger`
- Surface/background: `--op-surface`, `--op-surface-muted`, `--op-bg`

### Layout and Shape
- Spacing baseline: 8px scale via utility classes and consistent gaps
- Radius tokens:
  - small: `--op-radius-sm`
  - medium: `--op-radius-md`
  - large: `--op-radius-lg`
- Shadows:
  - subtle card elevation: `--op-shadow-sm`
  - emphasized panels: `--op-shadow-md`

## Component Rules
1. Page shell:
- Use `TournamentPageShell` for page-level heading, subtitle, and top-level actions.
- Keep page title and global actions in header region only.

2. Section panels:
- Use `TournamentPanel` for each functional section.
- Include short action-oriented titles and optional context subtitle.

3. Feedback:
- Use `InlineBanner` for success, info, warning, and error feedback.
- Errors should be specific and action-oriented.

4. Inputs and controls:
- Use rounded inputs (`op-input`/`op-select`) with visible focus states.
- Primary and secondary actions should use `op-btn` styling and consistent placement.

5. Save boundaries:
- High-change surfaces (seeding/pools) must stage edits locally.
- Enable save actions only when dirty state is detected.

## Motion Guidance
- Use subtle transitions for tab/section state and save-state transitions.
- Avoid decorative motion in score entry, scheduling, and validation interactions.

## Accessibility Rules
1. Preserve visible focus indicators for keyboard users.
2. Maintain WCAG AA contrast for text and controls.
3. Use explicit labels for all form fields.
4. Keep tap targets large enough for touch interactions.

## Anti-Patterns To Avoid
- Hidden save behavior that persists every small drag immediately.
- Dense table-only layouts for workflows requiring frequent edits.
- Single mega page with mixed critical actions and no section hierarchy.
- Default purple-on-white generic theme and non-purposeful typography.

AI Disclosure: Drafted with AI assistance.
Validated By: GraysonWills
Validation Date: 2026-02-28
