import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import Preview from '$lib/components/Preview.svelte';

describe('Preview', () => {
	it('renders <div> with id="__hibachi-preview"', () => {
		const { body } = render(Preview, { props: { preview: 'Hello' } });
		expect(body).toContain('id="__hibachi-preview"');
	});

	it('has display:none style', () => {
		const { body } = render(Preview, { props: { preview: 'Hello' } });
		expect(body).toContain('display:none');
	});

	it('has overflow:hidden style', () => {
		const { body } = render(Preview, { props: { preview: 'Hello' } });
		expect(body).toContain('overflow:hidden');
	});

	it('has line-height:1px style', () => {
		const { body } = render(Preview, { props: { preview: 'Hello' } });
		expect(body).toContain('line-height:1px');
	});

	it('has opacity:0 style', () => {
		const { body } = render(Preview, { props: { preview: 'Hello' } });
		expect(body).toContain('opacity:0');
	});

	it('has max-height:0 and max-width:0 styles', () => {
		const { body } = render(Preview, { props: { preview: 'Hello' } });
		expect(body).toContain('max-height:0');
		expect(body).toContain('max-width:0');
	});

	it('contains the preview text', () => {
		const { body } = render(Preview, { props: { preview: 'Check out our sale!' } });
		expect(body).toContain('Check out our sale!');
	});

	it('pads remaining chars to 150 with whitespace', () => {
		const shortText = 'Hi';
		const { body } = render(Preview, { props: { preview: shortText } });
		// Should contain whitespace padding characters
		expect(body).toContain('\u200C');
	});

	it('does not add padding for text >= 150 chars', () => {
		const longText = 'A'.repeat(160);
		const { body } = render(Preview, { props: { preview: longText } });
		// The repeat count would be negative, so String.repeat(negative) returns ''
		expect(body).toContain(longText);
	});

	it('spreads rest props', () => {
		const { body } = render(Preview, {
			props: { preview: 'Hello', 'data-testid': 'preview' }
		});
		expect(body).toContain('data-testid="preview"');
	});
});
