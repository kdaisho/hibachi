<script lang="ts">
	import {
		Html, Head, Body, Container, Section, Column,
		Heading, Text, Button, Link, Img, Hr, Preview
	} from '$lib';

	let { firstName = 'World' }: { firstName?: string } = $props();
</script>

<Html lang="en">
	<Head />
	<Preview preview="Welcome to hibachi" />
	<Body style={{ backgroundColor: '#ffffff' }}>
		<Container>
			<Section>
				<Column>
					<Img src="https://example.com/logo.png" alt="Logo" width="200" height="50" />
				</Column>
			</Section>
			<Heading as="h1">Hello, {firstName}!</Heading>
			<Text>This is a test email built with hibachi components.</Text>
			<Section>
				<Column>
					<Button href="https://example.com" pX={20} pY={12} style={{ backgroundColor: '#5F51E8', color: '#fff' }}>
						Click me
					</Button>
				</Column>
			</Section>
			<Hr />
			<Text style={{ color: '#8898aa', fontSize: '12px' }}>
				Footer text with a <Link href="https://example.com">link</Link>
			</Text>
		</Container>
	</Body>
</Html>
