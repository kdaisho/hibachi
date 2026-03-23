import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import Button from '$lib/components/Button.svelte';

describe('Button', () => {
	it('renders <a> element with href', () => {
		const { body } = render(Button, {
			props: { href: 'https://example.com' }
		});
		expect(body).toContain('<a');
		expect(body).toContain('href="https://example.com"');
	});

	it('has target="_blank" by default', () => {
		const { body } = render(Button, {
			props: { href: 'https://example.com' }
		});
		expect(body).toContain('target="_blank"');
	});

	it('contains MSO conditional comments', () => {
		const { body } = render(Button, {
			props: { href: 'https://example.com' }
		});
		expect(body).toContain('<!--[if mso]>');
		expect(body).toContain('<![endif]-->');
	});

	it('includes letter-spacing and mso-font-width in MSO comments', () => {
		const { body } = render(Button, {
			props: { href: 'https://example.com', pX: 20 }
		});
		expect(body).toContain('letter-spacing: 20px');
		expect(body).toContain('mso-font-width:-100%');
	});

	it('applies pX and pY as padding', () => {
		const { body } = render(Button, {
			props: { href: 'https://example.com', pX: 20, pY: 12 }
		});
		expect(body).toContain('padding:12px 20px');
	});

	it('computes mso-text-raise from pY', () => {
		const { body } = render(Button, {
			props: { href: 'https://example.com', pY: 12 }
		});
		// pY * 2 = 24, pxToPt(24) = 18
		expect(body).toContain('mso-text-raise:18');
	});

	it('includes MSO comments even with pX=0 pY=0', () => {
		const { body } = render(Button, {
			props: { href: 'https://example.com', pX: 0, pY: 0 }
		});
		expect(body).toContain('<!--[if mso]>');
	});

	it('has line-height:100% in button style', () => {
		const { body } = render(Button, {
			props: { href: 'https://example.com' }
		});
		expect(body).toContain('line-height:100%');
	});

	it('accepts class prop', () => {
		const { body } = render(Button, {
			props: { href: 'https://example.com', class: 'btn' }
		});
		expect(body).toContain('class="btn"');
	});

	it('accepts custom style', () => {
		const { body } = render(Button, {
			props: { href: 'https://example.com', style: { backgroundColor: '#5F51E8' } }
		});
		expect(body).toContain('background-color:#5F51E8');
	});
});
