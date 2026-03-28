# Hibachi

A Svelte 5 component library for building responsive emails. Design email templates with Svelte and render them to HTML or plain text.

Hibachi is a fork of [svelte-email](https://github.com/carstenlebek/svelte-email), rewritten from the ground up for Svelte 5. The original library is excellent but hasn't been updated for Svelte 5's runes, snippets, and modern patterns — making it incompatible with Svelte 5 projects without manual tweaking. Hibachi picks up where svelte-email left off.

## Installation

```bash
pnpm install hibachi
```

## Getting started

### 1. Create an email template

`src/lib/emails/Hello.svelte`

```svelte
<script>
    import { Button, Hr, Html, Text } from 'hibachi';

    let { name = 'World' } = $props();
</script>

<Html lang="en">
    <Text>Hello, {name}!</Text>
    <Hr />
    <Button href="https://svelte.dev">Visit Svelte</Button>
</Html>
```

### 2. Render and send

This example uses [Nodemailer](https://nodemailer.com/), but any email service works.

`src/routes/emails/hello/+server.ts`

```ts
import { render } from 'hibachi';
import Hello from '$lib/emails/Hello.svelte';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: 'my_user',
        pass: 'my_password',
    },
});

const emailHtml = render({
    template: Hello,
    props: { name: 'Svelte' },
});

transporter.sendMail({
    from: 'you@example.com',
    to: 'user@gmail.com',
    subject: 'Hello world',
    html: emailHtml,
});
```

### Render options

```ts
// HTML (default)
render({ template: Hello, props: { name: 'Svelte' } });

// Pretty-printed HTML
render({ template: Hello, options: { pretty: true } });

// Plain text
render({ template: Hello, options: { plainText: true } });
```

## Components

| Component   | Description                          |
| ----------- | ------------------------------------ |
| `Html`      | Root document wrapper                |
| `Head`      | Document head for metadata           |
| `Body`      | Email body                           |
| `Container` | Centered content wrapper             |
| `Section`   | Table-based row grouping             |
| `Column`    | Table-based column layout            |
| `Heading`   | h1–h6 headings                       |
| `Text`      | Paragraph text                       |
| `Button`    | Call-to-action link styled as button |
| `Link`      | Anchor link                          |
| `Img`       | Image                                |
| `Hr`        | Horizontal rule                      |
| `Preview`   | Inbox preview text                   |

## Integrations

Hibachi renders to standard HTML, so it works with any email provider:

- [Nodemailer](https://nodemailer.com/)
- [SendGrid](https://sendgrid.com/)
- [Postmark](https://postmarkapp.com/)
- [AWS SES](https://aws.amazon.com/ses/)

## License

MIT
