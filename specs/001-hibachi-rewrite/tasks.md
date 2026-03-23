# Tasks: Hibachi — Svelte 5 Email Component Library

**Input**: Design documents from `/specs/001-hibachi-rewrite/`
**Prerequisites**: plan.md (required), spec.md (required)

**Tests**: Tests are REQUIRED (Constitution Principle III: Test-First).
Tests MUST be written and fail before implementation begins.

**Organization**: Tasks are grouped by implementation phase per the plan:
render engine → utilities → simple components → complex components.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to
- Include exact file paths in descriptions

## Phase 1: Setup

**Purpose**: Upgrade dependencies, configure vitest, clean up Svelte 3 artifacts

- [x] T001 [US1] Upgrade `package.json`: rename to `hibachi`, upgrade svelte to `^5.0.0`, @sveltejs/kit to `^2.0.0`, @sveltejs/package to latest, vite to `^6.0.0`, typescript to `^5.0.0`. Remove `csstype`, `tailwindcss`, `@tailwindcss/*`, `@svelteness/kit-docs`, `unplugin-icons`. Add `vitest` as devDependency. Run `pnpm install`.
- [x] T002 [US1] Configure vitest in `vite.config.ts`: add `test: { include: ['src/tests/**/*.test.ts'] }` block. Update `svelte.config.js` for Svelte 5 / SvelteKit 2 if needed. Verify `pnpm vitest run` executes with zero tests.
- [x] T003 [US1] Create test directory structure: `src/tests/` and `src/tests/components/`. Add a trivial smoke test `src/tests/smoke.test.ts` that passes, confirming vitest + Svelte compilation works.
- [x] T004 [US1] Remove non-library files: `src/routes/` (docs site), `src/lib/_examples/`, `src/lib/_docs/`. These are SvelteKit app routes, not library code. Clean up any imports referencing them.

**Checkpoint**: `pnpm vitest run` passes. Project compiles with Svelte 5. Clean slate for library code.

---

## Phase 2: Render Engine (US1 — Priority P1)

**Purpose**: Migrate `render()` to Svelte 5's `svelte/server` API

### Tests (write FIRST, verify they FAIL)

- [x] T005 [US1] Write render tests in `src/tests/render.test.ts`:
  - `render()` returns string containing XHTML 1.0 Transitional DOCTYPE
  - `render()` with `pretty: true` returns indented HTML
  - `render()` with `plainText: true` returns plain text (no HTML tags)
  - `render()` passes props through to template component
  - `render()` with `plainText: true` strips elements with `id="__svelte-email-preview"`
  - `render()` with `plainText: true` strips `<img>` elements
  - Create a minimal test fixture component `src/tests/fixtures/TestComponent.svelte` using Svelte 5 syntax for use in render tests

### Implementation

- [x] T006 [US1] Rewrite `src/lib/render.ts`:
  - Import `render` from `svelte/server` (alias as `svelteRender`)
  - Import `Component`, `ComponentProps` from `svelte` (not `SvelteComponent`/`ComponentType`)
  - Use `svelteRender(template, { props })` → destructure `{ body }`
  - Keep DOCTYPE prepending, `pretty` option, `plainText` option
  - Keep `html-to-text` `convert()` for plain text with same selectors
  - Remove `@ts-ignore` comment
  - Verify all T005 tests pass

**Checkpoint**: `render()` works with Svelte 5 components. All render tests green.

---

## Phase 3: Utilities (US4 — Priority P2)

**Purpose**: Migrate utility functions, remove unused ones

### Tests (write FIRST, verify they FAIL)

- [x] T007 [US4] Write utility tests in `src/tests/utils.test.ts`:
  - `styleToString`: camelCase → kebab-case conversion (`fontSize` → `font-size`)
  - `styleToString`: multiple properties joined with semicolons
  - `styleToString`: null/undefined values are omitted
  - `styleToString`: numeric values preserved (no `px` suffix added)
  - `pxToPt`: `'16'` → `12` (16 * 3/4)
  - `pxToPt`: `'0'` → `0`
  - `pxToPt`: non-numeric string (`'auto'`) → `null`
  - `withMargin`: `{ m: '10' }` → `{ margin: '10px' }`
  - `withMargin`: `{ mx: '10' }` → `{ marginLeft: '10px', marginRight: '10px' }`
  - `withMargin`: `{ my: '10' }` → `{ marginTop: '10px', marginBottom: '10px' }`
  - `withMargin`: specific margins (mt, mr, mb, ml) each map correctly
  - `withMargin`: empty object → undefined/empty result

### Implementation

- [x] T008 [US4] Rewrite `src/lib/utils.ts`:
  - Keep `styleToString`, `pxToPt`, `withMargin`, `Margin` interface — no logic changes needed
  - Remove `copyTextToClipboard` (FR-022)
  - Remove `unreachable` (unused in library)
  - Remove `csstype` imports if any remain
  - Verify all T007 tests pass

**Checkpoint**: All utility tests green. No `csstype` or browser-only code in utils.

---

## Phase 4: Simple Components (US1 + US3 — Priority P1/P2)

**Purpose**: Migrate Html, Head, Body, Hr, Text to Svelte 5

### Tests (write FIRST, verify they FAIL)

- [x] T009 [P] [US1] Write Html tests in `src/tests/components/Html.test.ts`:
  - Renders `<html>` element with `id="__svelte-email"` and `lang="en"` by default
  - Accepts custom `lang` prop
  - Renders children via snippet
  - Spreads rest props onto `<html>` element

- [x] T010 [P] [US1] Write Head tests in `src/tests/components/Head.test.ts`:
  - Renders `<head>` element
  - Contains `<meta>` with `charset="UTF-8"` (or `http-equiv="Content-Type"`)
  - Renders children via snippet
  - Spreads rest props onto `<head>` element

- [x] T011 [P] [US1] Write Body tests in `src/tests/components/Body.test.ts`:
  - Renders `<body>` element
  - Applies inline styles from `style` prop via `styleToString`
  - Accepts `class` prop
  - Renders children via snippet
  - Spreads rest props onto `<body>` element

- [x] T012 [P] [US3] Write Hr tests in `src/tests/components/Hr.test.ts`:
  - Renders `<hr>` element
  - Default styles: `width:100%`, `border:none`, `border-top:1px solid #eaeaea`
  - Custom `style` prop overrides defaults
  - Accepts `class` prop
  - Spreads rest props

- [x] T013 [P] [US3] Write Text tests in `src/tests/components/Text.test.ts`:
  - Renders `<p>` element
  - Default styles: `font-size:14px`, `line-height:24px`, `margin:16px 0`
  - Custom `style` prop overrides defaults
  - Accepts `class` prop
  - Renders children via snippet
  - Spreads rest props

### Implementation

- [x] T014 [P] [US1] Rewrite `src/lib/components/Html.svelte` for Svelte 5:
  - `$props()` with `{ lang = 'en', children, ...rest }`
  - `interface Props` extending `HTMLAttributes<HTMLHtmlElement>`
  - `{@render children?.()}` instead of `<slot/>`
  - Verify T009 tests pass

- [x] T015 [P] [US1] Rewrite `src/lib/components/Head.svelte` for Svelte 5:
  - `$props()` with `{ children, ...rest }`
  - `interface Props` extending `HTMLAttributes<HTMLHeadElement>`
  - Keep `<meta>` tag
  - Verify T010 tests pass

- [x] T016 [P] [US1] Rewrite `src/lib/components/Body.svelte` for Svelte 5:
  - `$props()` with `{ style = {}, class: className, children, ...rest }`
  - `interface Props` with `style?: Record<string, string | number | null>`
  - No `csstype` import
  - Verify T011 tests pass

- [x] T017 [P] [US3] Rewrite `src/lib/components/Hr.svelte` for Svelte 5:
  - `$props()` with `{ style = {}, class: className, ...rest }` (no children)
  - Default styles via object spread
  - Verify T012 tests pass

- [x] T018 [P] [US3] Rewrite `src/lib/components/Text.svelte` for Svelte 5:
  - `$props()` with `{ style = {}, class: className, children, ...rest }`
  - Default styles via object spread
  - Verify T013 tests pass

**Checkpoint**: Html, Head, Body, Hr, Text all render correctly. A basic email structure (Html > Head + Body > Text) works end-to-end through `render()`.

---

## Phase 5: Complex Components — Structural (US2 — Priority P1)

**Purpose**: Migrate Container, Section, Column with MSO/table-based layout

### Tests (write FIRST, verify they FAIL)

- [x] T019 [P] [US2] Write Container tests in `src/tests/components/Container.test.ts`:
  - Renders outer `<div>` elements with MSO conditional comments (`<!--[if mso | IE]>`)
  - Inner `<div>` has `max-width:37.5em` default style
  - MSO comment contains table with `width="100%"` and `align="center"`
  - Custom `style` overrides `maxWidth` default
  - Accepts `class` prop (applied to inner div AND MSO table)
  - Renders children via snippet
  - Spreads rest props onto inner `<div>`

- [x] T020 [P] [US2] Write Section tests in `src/tests/components/Section.test.ts`:
  - Renders `<table>` with `role="presentation"`, `border="0"`, `cellpadding="0"`, `cellspacing="0"`
  - Default table style: `width:100%`
  - Inner `<tr>` has grid styles (`grid-auto-columns`, `grid-auto-flow`)
  - Custom `style` prop overrides table defaults
  - Accepts `class` prop on `<table>`
  - Renders children inside `<tbody><tr>`
  - Spreads rest props onto `<table>`

- [x] T021 [P] [US2] Write Column tests in `src/tests/components/Column.test.ts`:
  - Renders `<td>` with `role="presentation"`
  - Default styles: `display:inline-flex`, `justify-content:center`, `align-items:center`
  - Custom `style` prop overrides defaults
  - Accepts `class` prop
  - Renders children via snippet
  - Spreads rest props onto `<td>`

### Implementation

- [x] T022 [P] [US2] Rewrite `src/lib/components/Container.svelte` for Svelte 5:
  - `$props()` with `{ style = {}, class: className, children, ...rest }`
  - MSO conditional comments via `{@html}` — preserve existing logic
  - Default `maxWidth: '37.5em'` merged with custom style
  - Verify T019 tests pass

- [x] T023 [P] [US2] Rewrite `src/lib/components/Section.svelte` for Svelte 5:
  - `$props()` with `{ style = {}, class: className, children, ...rest }`
  - Table markup with presentation role, zero border/padding/spacing
  - Grid styles on `<tr>` for column layout
  - Verify T020 tests pass

- [x] T024 [P] [US2] Rewrite `src/lib/components/Column.svelte` for Svelte 5:
  - `$props()` with `{ style = {}, class: className, children, ...rest }`
  - Default inline-flex styles
  - Verify T021 tests pass

**Checkpoint**: Container > Section > Column layout renders with MSO compat. Structural email layouts work end-to-end.

---

## Phase 6: Complex Components — Content (US3 — Priority P2)

**Purpose**: Migrate Button, Link, Img, Heading, Preview

### Tests (write FIRST, verify they FAIL)

- [x] T025 [P] [US3] Write Button tests in `src/tests/components/Button.test.ts`:
  - Renders `<a>` element with `href` and `target="_blank"` default
  - Contains MSO conditional comments with `letter-spacing` and `mso-font-width`
  - `pX` and `pY` props produce correct padding in style
  - Inner `<span>` has `mso-text-raise` value (pY * 2, converted to pt)
  - Custom `style` prop merges with button styles
  - Accepts `class` prop
  - Renders children via snippet in inner span
  - `pX=0, pY=0` still includes MSO comments with zero values

- [x] T026 [P] [US3] Write Link tests in `src/tests/components/Link.test.ts`:
  - Renders `<a>` with `href` and `target="_blank"` default
  - Default styles: `color:#067df7`, `text-decoration:none`
  - Custom `style` overrides defaults
  - Accepts `class` prop
  - Renders children via snippet
  - Spreads rest props

- [x] T027 [P] [US3] Write Img tests in `src/tests/components/Img.test.ts`:
  - Renders `<img>` with `src`, `alt`, `width`, `height` attributes
  - Default styles: `display:block`, `outline:none`, `border:none`, `text-decoration:none`
  - Custom `style` overrides defaults
  - Accepts `class` prop
  - No children (no snippet)
  - Spreads rest props

- [x] T028 [P] [US3] Write Heading tests in `src/tests/components/Heading.test.ts`:
  - Default renders `<h1>` element
  - `as="h2"` renders `<h2>`, etc. for all h1–h6
  - Margin props: `m`, `mx`, `my`, `mt`, `mr`, `mb`, `ml` produce correct inline margin styles
  - Specific margins override shorthand (e.g., `m="10"` + `mt="20"` → marginTop is `20px`)
  - Custom `style` prop merges with margin styles
  - Accepts `class` prop
  - Renders children via snippet

- [x] T029 [P] [US3] Write Preview tests in `src/tests/components/Preview.test.ts`:
  - Renders `<div>` with `id="__svelte-email-preview"`
  - Hidden styles: `display:none`, `overflow:hidden`, `line-height:1px`, `opacity:0`, `max-height:0`, `max-width:0`
  - Contains the `preview` prop text
  - Pads remaining characters to 150 with invisible whitespace
  - Preview text > 150 chars: no whitespace padding added
  - No children (preview text comes from prop only)
  - Spreads rest props

### Implementation

- [x] T030 [P] [US3] Rewrite `src/lib/components/Button.svelte` for Svelte 5:
  - `$props()` with `{ href = '', style = {}, class: className, pX = 0, pY = 0, target = '_blank', children, ...rest }`
  - Keep `buttonStyle` and `buttonTextStyle` helper functions inline
  - MSO conditional comments via `{@html}` — preserve existing logic
  - `pxToPt` usage for mso-text-raise
  - Verify T025 tests pass

- [x] T031 [P] [US3] Rewrite `src/lib/components/Link.svelte` for Svelte 5:
  - `$props()` with `{ href = '', style = {}, class: className, target = '_blank', children, ...rest }`
  - Default color/decoration styles
  - Verify T026 tests pass

- [x] T032 [P] [US3] Rewrite `src/lib/components/Img.svelte` for Svelte 5:
  - `$props()` with `{ src = '', alt = '', width = '0', height = '0', style = {}, class: className, ...rest }` (no children)
  - Default display/outline/border/decoration styles
  - Verify T027 tests pass

- [x] T033 [P] [US3] Rewrite `src/lib/components/Heading.svelte` for Svelte 5:
  - `$props()` with `{ style = {}, class: className, as = 'h1', m, mx, my, mt, mr, mb, ml, children, ...rest }`
  - `withMargin()` called with margin props directly (no `$$props` needed)
  - `<svelte:element this={as}>` for dynamic tag
  - Verify T028 tests pass

- [x] T034 [P] [US3] Rewrite `src/lib/components/Preview.svelte` for Svelte 5:
  - `$props()` with `{ preview = '', ...rest }` (no children, no style/class)
  - Keep `renderWhiteSpace` helper inline
  - Hidden div with `id="__svelte-email-preview"`
  - Verify T029 tests pass

**Checkpoint**: All 13 components migrated. Full component set renders correctly.

---

## Phase 7: Public API & Integration (US1 + US5 — Priority P1/P3)

**Purpose**: Wire up exports, run integration tests, validate package build

- [x] T035 [US1] Rewrite `src/lib/index.ts` with named exports:
  - All 13 components via `export { default as X } from './components/X.svelte'`
  - `render` from `./render`
  - `styleToString`, `pxToPt` from `./utils`
  - Do NOT export `copyTextToClipboard`, `unreachable`, or `withMargin` (internal only, unless needed by consumers — `withMargin` is used by Heading internally but may be useful for custom components; export if original svelte-email exported it, otherwise keep internal)

- [x] T036 [US1] Write integration test in `src/tests/render.integration.test.ts`:
  - Create a full email fixture `src/tests/fixtures/FullEmail.svelte` using all 13 components
  - Render with `render()` and assert: DOCTYPE present, `<html>` with lang, `<head>` with meta, `<body>`, Container with MSO comments, Section with table, all content components present
  - Render with `plainText: true` and assert: text content present, images stripped, preview stripped
  - Render with `pretty: true` and assert: output contains newlines/indentation

- [x] T037 [US5] Write migration validation test in `src/tests/migration.test.ts`:
  - Port the welcome example from `src/lib/_examples/welcome.svelte` to Svelte 5 syntax as `src/tests/fixtures/WelcomeEmail.svelte`
  - Render and assert structural equivalence to original output (same elements, same attributes, same inline styles)

- [x] T038 [US1] Verify package build: run `pnpm run package` and confirm it succeeds. Check that `package/` output contains all component files and index.ts with correct exports.

- [x] T039 [US1] Remove smoke test `src/tests/smoke.test.ts` (no longer needed). Run full test suite `pnpm vitest run` — all tests MUST pass.

**Checkpoint**: Library is complete, all tests pass, package builds successfully.

---

## Phase 8: Polish & Validation

**Purpose**: Final quality checks and cleanup

- [x] T040 [P] Run `pnpm svelte-check` — zero errors required (SC-004)
- [x] T041 [P] Verify zero instances of `export let`, `<slot/>`, `$$restProps`, `$$Props` in `src/lib/` (SC-005). Use grep to confirm.
- [x] T042 [P] Verify no `csstype` imports remain in `src/lib/` (FR-021)
- [x] T043 Update `package.json` `name` field to `hibachi` if not already done in T001. Verify `exports` and `svelte` fields are correct for library consumers.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Render Engine)**: Depends on Phase 1 — needs vitest + Svelte 5
- **Phase 3 (Utilities)**: Depends on Phase 1 — can run in **parallel** with Phase 2
- **Phase 4 (Simple Components)**: Depends on Phase 2 (render for testing) + Phase 3 (styleToString)
- **Phase 5 (Structural Components)**: Depends on Phase 4 (need Html/Body for integration)
- **Phase 6 (Content Components)**: Depends on Phase 3 (utilities). Can run in **parallel** with Phase 5
- **Phase 7 (Integration)**: Depends on Phase 5 + Phase 6 (all components done)
- **Phase 8 (Polish)**: Depends on Phase 7

### Within Each Phase

- Tests marked [P] within a phase can run in parallel
- Implementation tasks marked [P] within a phase can run in parallel
- Tests MUST be written and fail BEFORE their corresponding implementation task
- Each test+implementation pair: write test → verify fail → implement → verify pass

### Parallel Opportunities

```
Phase 1 (Setup)
    ↓
Phase 2 (Render)  ‖  Phase 3 (Utilities)
    ↓                    ↓
Phase 4 (Simple Components)
    ↓
Phase 5 (Structural)  ‖  Phase 6 (Content)
    ↓                       ↓
Phase 7 (Integration)
    ↓
Phase 8 (Polish)
```

All tasks within a phase marked [P] can be executed in parallel.

---

## Implementation Strategy

### MVP (Phases 1–4)

Complete Setup + Render Engine + Utilities + Simple Components. At this
point a basic email (Html > Head + Body > Text) can be rendered. This
validates the entire Svelte 5 migration pipeline end-to-end.

### Full Library (Phases 5–6)

Add structural and content components. After this, all 13 components
are functional and tested.

### Ship (Phases 7–8)

Wire up exports, run integration tests, validate package build, final
quality checks. Ready for `pnpm publish`.

---

## Notes

- [P] tasks = different files, no dependencies between them
- [Story] label maps task to specific user story for traceability
- Constitution Principle III requires test-first — never skip test tasks
- Test fixture components in `src/tests/fixtures/` use Svelte 5 syntax
- Commit after each completed phase
- Total: 43 tasks across 8 phases
