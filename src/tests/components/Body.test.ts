import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import Body from '$lib/components/Body.svelte';

describe('Body', () => {
	it('renders <body> element', () => {
		const { body } = render(Body);
		expect(body).toContain('<body');
	});

	it('applies inline styles from style prop', () => {
		const { body } = render(Body, {
			props: { style: { backgroundColor: '#ffffff' } }
		});
		expect(body).toContain('background-color:#ffffff');
	});

	it('accepts class prop', () => {
		const { body } = render(Body, {
			props: { class: 'email-body' }
		});
		expect(body).toContain('class="email-body"');
	});

	it('spreads rest props onto <body> element', () => {
		const { body } = render(Body, {
			props: { id: 'main-body' }
		});
		expect(body).toContain('id="main-body"');
	});
});
