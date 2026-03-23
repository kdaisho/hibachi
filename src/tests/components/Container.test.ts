import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import Container from '$lib/components/Container.svelte';

describe('Container', () => {
	it('renders MSO conditional comments', () => {
		const { body } = render(Container);
		expect(body).toContain('<!--[if mso | IE]>');
		expect(body).toContain('<![endif]-->');
	});

	it('renders MSO table with width=100% and align=center', () => {
		const { body } = render(Container);
		expect(body).toContain('width="100%"');
		expect(body).toContain('align="center"');
	});

	it('renders inner div with default max-width:37.5em', () => {
		const { body } = render(Container);
		expect(body).toContain('max-width:37.5em');
	});

	it('allows custom style to override maxWidth', () => {
		const { body } = render(Container, {
			props: { style: { maxWidth: '600px' } }
		});
		expect(body).toContain('max-width:600px');
	});

	it('accepts class prop', () => {
		const { body } = render(Container, {
			props: { class: 'email-container' }
		});
		expect(body).toContain('class="email-container"');
	});

	it('spreads rest props onto inner div', () => {
		const { body } = render(Container, {
			props: { id: 'main-container' }
		});
		expect(body).toContain('id="main-container"');
	});
});
