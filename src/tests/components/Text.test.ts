import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import Text from '$lib/components/Text.svelte';

describe('Text', () => {
	it('renders <p> element', () => {
		const { body } = render(Text);
		expect(body).toContain('<p');
	});

	it('has default font-size:14px style', () => {
		const { body } = render(Text);
		expect(body).toContain('font-size:14px');
	});

	it('has default line-height:24px style', () => {
		const { body } = render(Text);
		expect(body).toContain('line-height:24px');
	});

	it('has default margin:16px 0 style', () => {
		const { body } = render(Text);
		expect(body).toContain('margin:16px 0');
	});

	it('allows custom style to override defaults', () => {
		const { body } = render(Text, {
			props: { style: { fontSize: '20px' } }
		});
		expect(body).toContain('font-size:20px');
	});

	it('accepts class prop', () => {
		const { body } = render(Text, {
			props: { class: 'paragraph' }
		});
		expect(body).toContain('class="paragraph"');
	});

	it('spreads rest props', () => {
		const { body } = render(Text, {
			props: { id: 'greeting' }
		});
		expect(body).toContain('id="greeting"');
	});
});
