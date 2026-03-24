import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import Html from '$lib/components/Html.svelte';

describe('Html', () => {
	it('renders <html> element with default lang="en"', () => {
		const { body } = render(Html);
		expect(body).toContain('<html');
		expect(body).toContain('lang="en"');
	});

	it('renders with id="__hibachi"', () => {
		const { body } = render(Html);
		expect(body).toContain('id="__hibachi"');
	});

	it('accepts custom lang prop', () => {
		const { body } = render(Html, { props: { lang: 'ja' } });
		expect(body).toContain('lang="ja"');
	});

	it('spreads rest props onto <html> element', () => {
		const { body } = render(Html, { props: { dir: 'rtl' } });
		expect(body).toContain('dir="rtl"');
	});
});
