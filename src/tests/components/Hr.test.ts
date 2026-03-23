import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import Hr from '$lib/components/Hr.svelte';

describe('Hr', () => {
	it('renders <hr> element', () => {
		const { body } = render(Hr);
		expect(body).toContain('<hr');
	});

	it('has default width:100% style', () => {
		const { body } = render(Hr);
		expect(body).toContain('width:100%');
	});

	it('has default border:none style', () => {
		const { body } = render(Hr);
		expect(body).toContain('border:none');
	});

	it('has default border-top style', () => {
		const { body } = render(Hr);
		expect(body).toContain('border-top:1px solid #eaeaea');
	});

	it('allows custom style to override defaults', () => {
		const { body } = render(Hr, {
			props: { style: { borderTop: '2px solid red' } }
		});
		expect(body).toContain('border-top:2px solid red');
	});

	it('accepts class prop', () => {
		const { body } = render(Hr, {
			props: { class: 'divider' }
		});
		expect(body).toContain('class="divider"');
	});

	it('spreads rest props', () => {
		const { body } = render(Hr, {
			props: { id: 'my-hr' }
		});
		expect(body).toContain('id="my-hr"');
	});
});
