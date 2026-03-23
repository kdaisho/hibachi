# Implementation Plan: Hibachi — Svelte 5 Email Component Library

**Branch**: `001-hibachi-rewrite` | **Date**: 2026-03-22 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-hibachi-rewrite/spec.md`

## Summary

Rewrite the svelte-email library for Svelte 5 under the name "hibachi".
The migration replaces all Svelte 3 patterns (`export let`, `<slot/>`,
`$$restProps`, `$$Props`, `csstype`) with Svelte 5 equivalents
(`$props()`, `{@render children?.()}`, rest spread, native TS types) and
updates the render engine from `Component.render(props)` to the
`svelte/server` `render()` function. All 13 components, the render
function, and utilities are preserved with API-compatible props.

## Technical Context

**Language/Version**: TypeScript 5, Svelte 5
**Primary Dependencies**: Svelte 5, SvelteKit 2, html-to-text, pretty
**Storage**: N/A
**Testing**: vitest
**Target Platform**: Node.js (server-side rendering), npm package
**Project Type**: Library (Svelte component library)
**Constraints**: Must produce email-safe XHTML; MSO compatibility required
**Package Manager**: pnpm

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Svelte 5 Runes Only | ✅ | All components use `$props()`, snippets, rest spread |
| II. Email Client Compat | ✅ | Table layouts, MSO comments, inline styles preserved |
| III. Test-First | ✅ | vitest tests for every component and utility |
| IV. API Compatibility | ✅ | Same component names, prop names, render signature |
| V. Simplicity | ✅ | Object spread for styles, no csstype, no Tailwind |
| VI. Type Safety | ✅ | `svelte/elements` types, explicit prop interfaces |

## Key Migration Patterns

### Svelte 3 → Svelte 5 Component Pattern

**Before (Svelte 3):**
```svelte
<script lang="ts">
  import type { StandardLonghandProperties, ... } from 'csstype';
  import type { HTMLAttributes } from 'svelte/elements';
  interface $$Props extends Omit<HTMLAttributes<HTMLParagraphElement>, 'style'> {
    style?: StandardLonghandProperties & ...;
  }
  export let style: $$Props['style'] = {};
  let className: string | undefined = undefined;
  export { className as class };
</script>
<p style={styleToString(styleDefault)} {...$$restProps} class={className}>
  <slot />
</p>
```

**After (Svelte 5):**
```svelte
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends Omit<HTMLAttributes<HTMLParagraphElement>, 'style'> {
    style?: Record<string, string | number | null>;
    children?: Snippet;
  }
  let { style = {}, class: className, children, ...rest }: Props = $props();
</script>
<p style={styleToString(styleDefault)} {...rest} class={className}>
  {@render children?.()}
</p>
```

### Render Function Migration

**Before (Svelte 3):**
```typescript
import type { ComponentProps, ComponentType, SvelteComponent } from 'svelte';
const { html } = template.render(props); // @ts-ignore
```

**After (Svelte 5):**
```typescript
import { render as svelteRender } from 'svelte/server';
import type { Component, ComponentProps } from 'svelte';
const { body } = svelteRender(template, { props });
```

Key differences:
- `svelte/server` `render()` returns `{ body, head }` (not `{ html }`)
- Props are passed as `{ props: { ... } }` options object
- Component type is `Component` (not `SvelteComponent`/`ComponentType`)

### Style Typing

**Before**: `csstype` dependency (`StandardLonghandProperties & ...`)
**After**: `Record<string, string | number | null>` — simple, no deps

This is intentional per Constitution Principle V (Simplicity). The
`csstype` library adds a large type surface for minimal benefit in an
email component library where styles are simple inline objects.

## Project Structure

### Documentation (this feature)

```text
specs/001-hibachi-rewrite/
├── spec.md              # Feature specification
└── plan.md              # This file
```

### Source Code (repository root)

```text
src/
├── lib/
│   ├── index.ts              # Public API exports
│   ├── render.ts             # render() function (svelte/server API)
│   ├── utils.ts              # styleToString, pxToPt, withMargin
│   └── components/
│       ├── Html.svelte
│       ├── Head.svelte
│       ├── Body.svelte
│       ├── Hr.svelte
│       ├── Text.svelte
│       ├── Container.svelte
│       ├── Section.svelte
│       ├── Column.svelte
│       ├── Button.svelte
│       ├── Link.svelte
│       ├── Img.svelte
│       ├── Heading.svelte
│       └── Preview.svelte
└── tests/
    ├── render.test.ts
    ├── utils.test.ts
    └── components/
        ├── Html.test.ts
        ├── Head.test.ts
        ├── Body.test.ts
        ├── Hr.test.ts
        ├── Text.test.ts
        ├── Container.test.ts
        ├── Section.test.ts
        ├── Column.test.ts
        ├── Button.test.ts
        ├── Link.test.ts
        ├── Img.test.ts
        ├── Heading.test.ts
        └── Preview.test.ts
```

**Structure Decision**: Single project library layout. Files stay in
their current locations within `src/lib/`. Tests are added in
`src/tests/` (colocated within the `src` directory for access to
`$lib` alias). Components are tested by importing them and using
`render()` from `svelte/server` to assert HTML output.

## Component-by-Component Migration Reference

### Render Engine (`src/lib/render.ts`)

| Aspect | Svelte 3 (current) | Svelte 5 (target) |
|--------|--------------------|--------------------|
| Import | `ComponentType`, `SvelteComponent` from `svelte` | `Component`, `ComponentProps` from `svelte`; `render` from `svelte/server` |
| Call | `template.render(props)` → `{ html }` | `svelteRender(template, { props })` → `{ body, head }` |
| Return | `html` property | `body` property |
| Types | Generic on `SvelteComponent` | Generic on `Component` |

### Utilities (`src/lib/utils.ts`)

| Function | Changes | Notes |
|----------|---------|-------|
| `styleToString` | No logic changes | Keep as-is, already pure TS |
| `pxToPt` | No logic changes | Keep as-is |
| `withMargin` | No logic changes | Keep as-is, internal + exported |
| `copyTextToClipboard` | **Remove** | Not email-relevant (FR-022) |
| `unreachable` | **Remove** | Unused in library components |

### Simple Components

| Component | Svelte 3 → 5 Changes |
|-----------|---------------------|
| **Html** | `export let lang` → `$props()`. `<slot/>` → `{@render children?.()}`. Drop `$$restProps` → `...rest`. Drop `$$Props` → `Props`. |
| **Head** | `$$Props` → `Props`. `<slot/>` → `{@render children?.()}`. `$$restProps` → `...rest`. Keep `<meta>` tag. |
| **Body** | `export let style` → `$props()`. Drop `csstype` → `Record<...>`. `<slot/>` → `{@render children?.()}`. |
| **Hr** | `export let style` → `$props()`. Drop `csstype`. Self-closing, no children. |
| **Text** | `export let style` → `$props()`. Drop `csstype`. `<slot/>` → `{@render children?.()}`. |

### Complex Components

| Component | Svelte 3 → 5 Changes | Special Considerations |
|-----------|----------------------|----------------------|
| **Container** | `$props()`, snippets, `...rest` | MSO conditional comments via `{@html}` — unchanged. |
| **Section** | `$props()`, snippets, `...rest` | Table markup preserved. `border`, `cellPadding`, `cellSpacing` attrs. |
| **Column** | `$props()`, snippets, `...rest` | Renders `<td>`. Default inline-flex styles. |
| **Button** | `$props()`, snippets, `...rest` | MSO comments, `pxToPt` usage, `buttonStyle`/`buttonTextStyle` helpers kept inline. |
| **Link** | `$props()`, snippets, `...rest` | Default color/decoration styles. |
| **Img** | `$props()`, `...rest` | No children (no snippet needed). Required `src`, `alt`, `width`, `height`. |
| **Heading** | `$props()`, snippets, `...rest` | Dynamic `as` tag via `<svelte:element>`. Margin props via `withMargin`. Access margin props from destructured `$props()` directly. |
| **Preview** | `$props()`, `...rest` | No children. Whitespace padding logic. `id="__svelte-email-preview"`. |

## Testing Strategy

All tests use vitest with `svelte/server` `render()` to produce HTML
strings, then assert on the output.

**Test pattern for components:**
```typescript
import { render } from 'svelte/server';
import { describe, it, expect } from 'vitest';
import Text from '$lib/components/Text.svelte';

describe('Text', () => {
  it('renders with default styles', () => {
    const { body } = render(Text, {
      props: { children: /* snippet or test helper */ }
    });
    expect(body).toContain('font-size:14px');
    expect(body).toContain('<p');
  });
});
```

**Note on testing children**: Svelte 5 snippets cannot be trivially
created in test code. Two approaches:
1. Create small wrapper `.svelte` test fixtures that compose the
   component with children, then render the wrapper.
2. Use `createRawSnippet` from `svelte` to create programmatic snippets
   in test files.

The implementation will determine which approach is cleaner — start with
wrapper fixtures as the simpler option.

**Test coverage per component:**
- Default HTML structure (correct element, attributes)
- Default inline styles
- Custom `style` prop merging (overrides defaults)
- Custom `class` prop
- Rest props spread to underlying element
- Component-specific behavior (MSO comments, dynamic tag, etc.)

**Test coverage for render():**
- HTML output with DOCTYPE
- Pretty-print option
- Plain text option (images stripped, preview stripped)
- Props passed through to component

**Test coverage for utilities:**
- `styleToString`: camelCase → kebab-case, null filtering
- `pxToPt`: numeric conversion, non-numeric → null
- `withMargin`: all shorthand combos, specificity override

## Vitest Configuration

Vitest needs Svelte preprocessing to compile `.svelte` files in tests.
The project will use `@testing-library/svelte` or direct `svelte/server`
rendering. Configuration via `vite.config.ts` with the existing
`sveltekit()` plugin should handle `.svelte` compilation automatically.

A minimal vitest config addition:
```typescript
// vite.config.ts or vitest.config.ts
export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ['src/tests/**/*.test.ts']
  }
});
```

## Dependencies Changes

| Package | Action | Reason |
|---------|--------|--------|
| `svelte` | Upgrade to `^5.0.0` | Core framework upgrade |
| `@sveltejs/kit` | Upgrade to `^2.0.0` | SvelteKit 2 for Svelte 5 |
| `@sveltejs/package` | Upgrade to latest | Library packaging |
| `vite` | Upgrade to `^6.0.0` | Per stack requirements |
| `typescript` | Upgrade to `^5.0.0` | Per stack requirements |
| `vitest` | **Add** (dev) | Test runner |
| `csstype` | **Remove** | Replaced by `Record<string, string \| number \| null>` |
| `html-to-text` | Keep | Plain text conversion |
| `pretty` | Keep | HTML pretty-printing |
| `tailwindcss` + plugins | **Remove** (dev) | Not needed for library core |
| `@svelteness/kit-docs` | **Remove** (dev) | Docs site tooling, not library |
| `unplugin-icons` | **Remove** (dev) | Docs site tooling, not library |

## Exports (`src/lib/index.ts`)

```typescript
// Components
export { default as Body } from './components/Body.svelte';
export { default as Button } from './components/Button.svelte';
export { default as Column } from './components/Column.svelte';
export { default as Container } from './components/Container.svelte';
export { default as Head } from './components/Head.svelte';
export { default as Heading } from './components/Heading.svelte';
export { default as Hr } from './components/Hr.svelte';
export { default as Html } from './components/Html.svelte';
export { default as Img } from './components/Img.svelte';
export { default as Link } from './components/Link.svelte';
export { default as Preview } from './components/Preview.svelte';
export { default as Section } from './components/Section.svelte';
export { default as Text } from './components/Text.svelte';

// Functions
export { render } from './render';
export { styleToString, pxToPt } from './utils';
```

## Complexity Tracking

No constitution violations. The migration is a 1:1 rewrite with
framework-mandated syntax changes. No new abstractions introduced.
