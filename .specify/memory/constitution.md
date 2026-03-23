<!--
  Sync Impact Report
  ==================
  Version change: 0.0.0 → 1.0.0 (initial ratification)
  Modified principles: N/A (initial version)
  Added sections:
    - 6 Core Principles (Svelte 5 Runes Only, Email Client Compatibility,
      Test-First, API Compatibility, Simplicity, Type Safety)
    - Technology Stack
    - Development Workflow
    - Governance
  Removed sections: N/A
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ no updates needed (generic)
    - .specify/templates/spec-template.md ✅ no updates needed (generic)
    - .specify/templates/tasks-template.md ✅ no updates needed (generic)
  Follow-up TODOs: none
-->

# Hibachi Constitution

## Core Principles

### I. Svelte 5 Runes Only

All components MUST use Svelte 5 runes and modern patterns exclusively:

- Use `$props()` for component props. No `export let`.
- Use snippets (`{@render children?.()}`) for composition. No `<slot/>`.
- Use `$state()`, `$derived()`, `$effect()` where reactive state is needed.
- No `$$restProps`, `$$Props` interface, or any legacy Svelte 3/4 syntax.
- Every `.svelte` file MUST pass `svelte-check` with Svelte 5 strictness.

**Rationale**: The project exists to bring svelte-email into the Svelte 5
era. Mixing legacy patterns defeats the purpose and creates maintenance
debt.

### II. Email Client Compatibility

Components MUST produce HTML that renders correctly across Gmail,
Outlook (including MSO conditional rendering), Apple Mail, and Yahoo Mail:

- Table-based layouts MUST be used for structural components (Container,
  Section, Column).
- MSO conditional comments (`<!--[if mso]>`) MUST be included where
  Outlook requires them.
- Inline styles MUST be used for all visual styling. No `<style>` blocks
  or external CSS in rendered output.
- Components MUST NOT rely on CSS features unsupported by major email
  clients (e.g., flexbox, grid, CSS variables).

**Rationale**: Email HTML is not browser HTML. Components that look
correct in a browser but break in Outlook or Gmail provide negative
value.

### III. Test-First (NON-NEGOTIABLE)

Every component and utility MUST have tests before implementation:

- Use vitest as the test runner.
- Test the rendered HTML output of every component.
- Test plain text conversion for every component.
- Tests MUST be written and verified to fail before implementation begins.
- Red-Green-Refactor cycle is strictly enforced.

**Rationale**: Email rendering bugs are difficult to catch visually across
all clients. Automated tests are the only reliable safety net.

### IV. API Compatibility

Maintain the same public API as the original svelte-email where possible:

- Component names MUST match: Html, Head, Body, Container, Section,
  Column, Heading, Text, Button, Link, Img, Hr, Preview.
- The `render()` function signature MUST remain compatible.
- Prop names MUST match the original library unless a breaking change is
  documented and justified.
- Breaking changes MUST be listed in a migration guide with rationale.

**Rationale**: Existing svelte-email users MUST be able to migrate with
minimal friction. Gratuitous API changes create adoption barriers.

### V. Simplicity

No unnecessary abstractions. Keep the codebase minimal and focused:

- Prefer object spread (`{ ...baseStyles, ...overrides }`) for style
  merging over utility functions like `combineStyles`.
- Components MUST do one thing well. No multi-purpose mega-components.
- No Tailwind CSS dependency in the core library.
- No runtime dependencies beyond Svelte itself unless strictly necessary.
- If a pattern is used only once, inline it. Do not create premature
  abstractions.

**Rationale**: Email component libraries MUST be lightweight and
predictable. Abstraction layers obscure the HTML output, making
email-client debugging harder.

### VI. Type Safety

Full TypeScript support is mandatory:

- Every component MUST have explicit prop type definitions.
- Use `svelte/elements` types (e.g., `HTMLAttributes<HTMLTableElement>`)
  for HTML attribute extension.
- The `render()` function MUST have typed input and output.
- No `any` types except where unavoidable (and documented with a comment
  explaining why).

**Rationale**: TypeScript types serve as living documentation and prevent
integration errors for consumers of the library.

## Technology Stack

- **Framework**: Svelte 5, SvelteKit 2
- **Build**: Vite 6, `@sveltejs/package` for library packaging
- **Language**: TypeScript 5
- **Testing**: vitest
- **Package Manager**: pnpm (MUST NOT use npm or yarn)
- **Package Name**: hibachi
- **Distribution**: npm via `@sveltejs/package`

## Development Workflow

- All PRs MUST pass `svelte-check`, vitest, and linting before merge.
- Components MUST be developed test-first per Principle III.
- Each component MUST be independently testable.
- Commit messages MUST be descriptive and follow conventional commits
  style.
- The `render()` function and all public exports MUST be tested for both
  HTML and plain text output.

## Governance

- This constitution supersedes all other development practices for the
  hibachi project.
- Amendments require: (1) documented rationale, (2) review of impact on
  existing components, (3) version bump per semantic versioning rules.
- All code reviews MUST verify compliance with the six core principles.
- Complexity beyond what the principles allow MUST be justified in writing
  and approved before implementation.
- Use the constitution as the authoritative reference when resolving
  design disagreements.

**Version**: 1.0.0 | **Ratified**: 2026-03-22 | **Last Amended**: 2026-03-22
