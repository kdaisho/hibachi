import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import Head from '$lib/components/Head.svelte';

describe('Head', () => {
	it('renders <head> element', () => {
		const { body } = render(Head);
		expect(body).toContain('<head');
	});

	it('contains meta with Content-Type charset UTF-8', () => {
		const { body } = render(Head);
		expect(body).toContain('charset');
		expect(body).toContain('UTF-8');
	});
});
