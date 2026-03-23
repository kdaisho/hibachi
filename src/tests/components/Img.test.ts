import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import Img from '$lib/components/Img.svelte';

describe('Img', () => {
	it('renders <img> element with src, alt, width, height', () => {
		const { body } = render(Img, {
			props: { src: 'logo.png', alt: 'Logo', width: '200', height: '50' }
		});
		expect(body).toContain('<img');
		expect(body).toContain('src="logo.png"');
		expect(body).toContain('alt="Logo"');
		expect(body).toContain('width="200"');
		expect(body).toContain('height="50"');
	});

	it('has default display:block', () => {
		const { body } = render(Img, {
			props: { src: 'a.png', alt: 'a', width: '1', height: '1' }
		});
		expect(body).toContain('display:block');
	});

	it('has default outline:none', () => {
		const { body } = render(Img, {
			props: { src: 'a.png', alt: 'a', width: '1', height: '1' }
		});
		expect(body).toContain('outline:none');
	});

	it('has default border:none', () => {
		const { body } = render(Img, {
			props: { src: 'a.png', alt: 'a', width: '1', height: '1' }
		});
		expect(body).toContain('border:none');
	});

	it('has default text-decoration:none', () => {
		const { body } = render(Img, {
			props: { src: 'a.png', alt: 'a', width: '1', height: '1' }
		});
		expect(body).toContain('text-decoration:none');
	});

	it('allows custom style to override defaults', () => {
		const { body } = render(Img, {
			props: { src: 'a.png', alt: 'a', width: '1', height: '1', style: { display: 'inline' } }
		});
		expect(body).toContain('display:inline');
	});

	it('accepts class prop', () => {
		const { body } = render(Img, {
			props: { src: 'a.png', alt: 'a', width: '1', height: '1', class: 'logo' }
		});
		expect(body).toContain('class="logo"');
	});

	it('spreads rest props', () => {
		const { body } = render(Img, {
			props: { src: 'a.png', alt: 'a', width: '1', height: '1', id: 'img-1' }
		});
		expect(body).toContain('id="img-1"');
	});
});
