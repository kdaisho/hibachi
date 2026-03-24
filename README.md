# Hibachi

A Svelte 5 component library for building responsive emails. Design email templates with Svelte and render them to HTML or plain text.

# Installation

Install the package to your existing SvelteKit project:

```bash
pnpm install hibachi
```

# Getting started

## 1. Create an email using Svelte

`src/$lib/emails/Hello.svelte`

```html
<script>
	import { Button, Hr, Html, Text } from 'hibachi';

	let { name = 'World' } = $props();
</script>

<Html lang="en">
	<Text>
		Hello, {name}!
	</Text>
	<Hr />
	<Button href="https://svelte.dev">Visit Svelte</Button>
</Html>
```

## 2. Send email

This example uses [Nodemailer](https://nodemailer.com/about/) to send the email. You can use any other email service provider.

`src/routes/emails/hello/+server.js`

```js
import { render } from 'hibachi';
import Hello from '$lib/emails/Hello.svelte';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	host: 'smtp.ethereal.email',
	port: 587,
	secure: false,
	auth: {
		user: 'my_user',
		pass: 'my_password'
	}
});

const emailHtml = render({
	template: Hello,
	props: {
		name: 'Svelte'
	}
});

const options = {
	from: 'you@example.com',
	to: 'user@gmail.com',
	subject: 'hello world',
	html: emailHtml
};

transporter.sendMail(options);
```

# Components

A set of standard components to help you build amazing emails without having to deal with the mess of creating table-based layouts and maintaining archaic markup.

- HTML
- Head
- Heading
- Button
- Link
- Image
- Divider
- Paragraph
- Container
- Preview
- Body
- Column
- Section

# Integrations

Emails built with hibachi can be converted into HTML and sent using any email service provider. Here are some examples:

- [Nodemailer](https://nodemailer.com/)
- [SendGrid](https://sendgrid.com/)
- [Postmark](https://postmarkapp.com/)
- [AWS SES](https://aws.amazon.com/ses/)
