# Feature Specification: Hibachi — Svelte 5 Email Component Library

**Feature Branch**: `001-hibachi-rewrite`
**Created**: 2026-03-22
**Status**: Draft
**Input**: Rewrite svelte-email as "hibachi" using Svelte 5 runes, snippets, and modern patterns while preserving the component API surface.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Render an Email Template to HTML (Priority: P1)

A Svelte developer creates an email template by composing hibachi
components (Html, Head, Body, Container, Section, Text, Button, etc.),
then calls `render()` with that component and props to get an
email-safe HTML string they can pass to their email service (Nodemailer,
SendGrid, Postmark, AWS SES).

**Why this priority**: This is the core value proposition. Without a
working render pipeline and at least the structural components, the
library has zero utility.

**Independent Test**: Import a component that uses Html, Head, Body,
Container, and Text. Call `render({ template, props })` and assert the
output contains valid XHTML 1.0 Transitional markup with correct
DOCTYPE, inline styles, and expected element structure.

**Acceptance Scenarios**:

1. **Given** a Svelte component using Html, Head, Body, Container, and
   Text, **When** `render({ template, props })` is called, **Then** the
   output is a valid XHTML 1.0 Transitional string with the correct
   DOCTYPE declaration, `<html lang="en">`, `<meta charset="UTF-8">`,
   and all content inside a table-based Container.

2. **Given** a component with dynamic props (e.g., `firstName`),
   **When** `render({ template, props: { firstName: 'Alice' } })` is
   called, **Then** the output contains "Alice" in the correct position.

3. **Given** `options: { pretty: true }`, **When** render is called,
   **Then** the output is indented/formatted for readability.

4. **Given** `options: { plainText: true }`, **When** render is called,
   **Then** the output is a plain text string with images and preview
   text stripped, and meaningful content preserved.

---

### User Story 2 — Build Email Layouts with Structural Components (Priority: P1)

A developer uses Container, Section, and Column to create multi-column,
table-based email layouts that render correctly in Gmail, Outlook (MSO),
Apple Mail, and Yahoo Mail.

**Why this priority**: Structural components are the foundation for all
email templates. Without correct table-based layout and MSO conditional
comments, emails break in Outlook.

**Independent Test**: Render a template with Container > Section >
Column layout. Assert the HTML contains table-based markup, MSO
conditional comments, correct `role="presentation"` attributes, and
proper default widths.

**Acceptance Scenarios**:

1. **Given** a template with `<Container>`, **When** rendered, **Then**
   the output includes MSO conditional comments
   (`<!--[if mso]>...<![endif]-->`) wrapping a table fallback, and an
   inner div with `max-width: 37.5em`.

2. **Given** a `<Section>` with two `<Column>` children, **When**
   rendered, **Then** the output is a `<table>` with
   `role="presentation"`, `border="0"`, `cellpadding="0"`,
   `cellspacing="0"`, containing `<td>` elements for each column.

3. **Given** custom styles passed to structural components, **When**
   rendered, **Then** default styles are preserved and custom styles
   override only the specified properties via object spread.

---

### User Story 3 — Use Content Components for Email Copy (Priority: P2)

A developer uses Heading, Text, Link, Button, Img, Hr, and Preview to
add content to their email template. Each component renders email-safe
HTML with sensible defaults.

**Why this priority**: Content components complete the component set.
They depend on structural components being in place but are essential
for any real email template.

**Independent Test**: Render each content component individually and
assert correct HTML output, default styles, and prop handling.

**Acceptance Scenarios**:

1. **Given** `<Heading as="h2">Hello</Heading>`, **When** rendered,
   **Then** the output is `<h2 style="...">Hello</h2>` with margin
   utilities applied if provided.

2. **Given** `<Text>Paragraph</Text>`, **When** rendered, **Then** the
   output is `<p>` with default `font-size: 14px`, `line-height: 24px`,
   `margin: 16px 0`.

3. **Given** `<Button href="https://example.com" pX={20} pY={12}>`,
   **When** rendered, **Then** the output includes an `<a>` with
   correct padding, MSO conditional comments for Outlook padding
   support, and `mso-text-raise` point value.

4. **Given** `<Link href="https://example.com">Click</Link>`, **When**
   rendered, **Then** output is `<a target="_blank"
   style="color: #067df7; text-decoration: none;">Click</a>`.

5. **Given** `<Img src="logo.png" alt="Logo" width="200"
   height="50">`, **When** rendered, **Then** output is `<img>` with
   `display: block`, `border: none`, `outline: none`.

6. **Given** `<Hr>`, **When** rendered, **Then** output is `<hr>` with
   `border-top: 1px solid #eaeaea` and `width: 100%`.

7. **Given** `<Preview preview="Check out our sale!">`, **When**
   rendered, **Then** the output is a hidden div with
   `id="__svelte-email-preview"`, invisible styles, and whitespace
   padding to fill 150 characters. The preview text MUST be excluded
   from plain text output.

---

### User Story 4 — Use Utility Functions (Priority: P2)

A developer uses the exported utility functions `styleToString` and
`pxToPt` in custom components or inline style logic.

**Why this priority**: Utilities support both internal component
implementation and advanced users building custom email components.

**Independent Test**: Call each utility function with known inputs and
assert expected outputs.

**Acceptance Scenarios**:

1. **Given** `styleToString({ fontSize: '14px', lineHeight: '24px' })`,
   **When** called, **Then** returns `"font-size: 14px; line-height:
   24px;"` with camelCase-to-kebab-case conversion.

2. **Given** `pxToPt('16px')`, **When** called, **Then** returns `12`
   (16 * 3/4).

3. **Given** `styleToString` receives null values, **When** called,
   **Then** null properties are omitted from the output string.

---

### User Story 5 — Migrate from svelte-email (Priority: P3)

An existing svelte-email user migrates to hibachi by changing their
import path from `svelte-email` to `hibachi` and updating any Svelte
3-specific patterns in their templates.

**Why this priority**: Migration experience is important for adoption
but depends on all components and the render function being complete
and API-compatible first.

**Independent Test**: Take an existing svelte-email template (e.g., the
welcome example), change imports to hibachi, and verify it compiles and
produces equivalent HTML output.

**Acceptance Scenarios**:

1. **Given** an existing svelte-email template using all 13 components,
   **When** imports are changed from `svelte-email` to `hibachi` and
   `<slot/>` is replaced with `{@render children?.()}`, **Then** the
   template compiles without errors under Svelte 5.

2. **Given** the welcome example template from svelte-email, **When**
   rendered with hibachi's `render()`, **Then** the HTML output is
   structurally equivalent (same elements, same attributes, same inline
   styles) to the svelte-email output.

---

### Edge Cases

- What happens when `render()` is called with a component that has no
  children? It MUST return valid HTML with empty content areas.
- What happens when `style` prop is `undefined`? Default styles MUST
  still apply.
- What happens when `pxToPt` receives a non-numeric string (e.g.,
  `"auto"`)? It MUST return `null`.
- What happens when `Preview` text exceeds 150 characters? It MUST NOT
  add whitespace padding.
- What happens when `Heading` receives margin shorthand (`m`) AND
  specific margins (`mt`, `mb`)? Specific margins MUST override the
  shorthand.
- What happens when `Button` has `pX=0` and `pY=0`? MSO conditional
  comments MUST still be present with zero padding values.
- What happens when `Container` receives a custom `maxWidth` style?
  It MUST override the default `37.5em`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Library MUST export all 13 components: Html, Head, Body,
  Container, Section, Column, Heading, Text, Button, Link, Img, Hr,
  Preview.
- **FR-002**: Library MUST export a `render()` function that accepts a
  Svelte component, optional props, and options (`plainText`, `pretty`),
  returning an HTML or plain text string.
- **FR-003**: Library MUST export `styleToString` utility function.
- **FR-004**: Library MUST export `pxToPt` utility function.
- **FR-005**: All components MUST use Svelte 5 runes (`$props()`) for
  prop declarations. No `export let`.
- **FR-006**: All components MUST use snippets (`{@render children?.()}`)
  for content composition. No `<slot/>`.
- **FR-007**: All components MUST accept and spread additional HTML
  attributes via `...rest` props pattern (not `$$restProps`).
- **FR-008**: All components MUST accept a `style` prop (CSS properties
  object) that merges with default styles via object spread.
- **FR-009**: All components MUST accept a `class` prop for custom CSS
  class names.
- **FR-010**: `render()` MUST prepend XHTML 1.0 Transitional DOCTYPE to
  all HTML output.
- **FR-011**: `render()` with `plainText: true` MUST strip images and
  preview text from output.
- **FR-012**: `render()` MUST use Svelte 5's `svelte/server` render API
  (not the legacy `Component.render()` method).
- **FR-013**: Container MUST include MSO conditional comments for
  Outlook table-based fallback.
- **FR-014**: Button MUST include MSO conditional comments for Outlook
  padding support using `mso-text-raise` and point-based values.
- **FR-015**: Section MUST render as a `<table>` with
  `role="presentation"` and zero border/cellpadding/cellspacing.
- **FR-016**: Preview MUST render as a hidden div that pads remaining
  characters to 150 with invisible whitespace.
- **FR-017**: Heading MUST support dynamic element tags (h1–h6) via
  the `as` prop.
- **FR-018**: Heading MUST support margin shorthand props (m, mx, my,
  mt, mr, mb, ml) via the `withMargin` utility.
- **FR-019**: All component styles MUST be inline. No `<style>` blocks
  in rendered output.
- **FR-020**: Library MUST be packageable via `@sveltejs/package` and
  publishable to npm as `hibachi`.
- **FR-021**: Library MUST NOT depend on `csstype` — use native
  TypeScript CSS types or `svelte/elements` types.
- **FR-022**: Library MUST NOT export `copyTextToClipboard` (not
  email-relevant).
- **FR-023**: Every component and utility MUST have vitest tests
  covering HTML output and plain text conversion.

### Key Entities

- **Component**: A Svelte 5 `.svelte` file that renders email-safe HTML.
  Accepts typed props including `style`, `class`, and element-specific
  HTML attributes. Uses snippets for children.
- **Render Function**: Server-side function that takes a component
  reference, props, and options. Produces a complete email HTML document
  or plain text equivalent.
- **Utility Function**: Pure TypeScript function (styleToString, pxToPt,
  withMargin) used internally by components and exported for consumer
  use.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 13 components render correct email-safe HTML verified
  by vitest assertions on element structure, attributes, and inline
  styles.
- **SC-002**: `render()` produces valid XHTML 1.0 Transitional output
  (correct DOCTYPE, well-formed HTML).
- **SC-003**: Plain text conversion via `render({ ..., options:
  { plainText: true } })` produces readable text with images and preview
  stripped, verified by tests.
- **SC-004**: `svelte-check` passes with zero errors on the entire
  library source.
- **SC-005**: All components use exclusively Svelte 5 syntax — zero
  instances of `export let`, `<slot/>`, `$$restProps`, or `$$Props` in
  the source.
- **SC-006**: The welcome example template from svelte-email compiles
  and renders equivalent output when ported to hibachi with import path
  changes.
- **SC-007**: `pnpm run package` successfully produces a publishable
  package with correct exports.
- **SC-008**: TypeScript consumers get full autocomplete and type
  checking for all component props.
