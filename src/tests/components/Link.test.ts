import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import Link from '$lib/components/Link.svelte';

describe('Link', () => {
	it('renders <a> element with href', () => {
		const { body } = render(Link, {
			props: { href: 'https://example.com' }
		});
		expect(body).toContain('<a');
		expect(body).toContain('href="https://example.com"');
	});

	it('has target="_blank" by default', () => {
		const { body } = render(Link, {
			props: { href: 'https://example.com' }
		});
		expect(body).toContain('target="_blank"');
	});

	it('has default color:#067df7', () => {
		const { body } = render(Link, {
			props: { href: 'https://example.com' }
		});
		expect(body).toContain('color:#067df7');
	});

	it('has default text-decoration:none', () => {
		const { body } = render(Link, {
			props: { href: 'https://example.com' }
		});
		expect(body).toContain('text-decoration:none');
	});

	it('allows custom style to override defaults', () => {
		const { body } = render(Link, {
			props: { href: 'https://example.com', style: { color: 'red' } }
		});
		expect(body).toContain('color:red');
	});

	it('accepts class prop', () => {
		const { body } = render(Link, {
			props: { href: 'https://example.com', class: 'link' }
		});
		expect(body).toContain('class="link"');
	});

	it('spreads rest props', () => {
		const { body } = render(Link, {
			props: { href: 'https://example.com', id: 'my-link' }
		});
		expect(body).toContain('id="my-link"');
	});
});
