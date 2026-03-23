import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import Heading from '$lib/components/Heading.svelte';

describe('Heading', () => {
	it('renders <h1> by default', () => {
		const { body } = render(Heading);
		expect(body).toContain('<h1');
	});

	it('renders <h2> with as="h2"', () => {
		const { body } = render(Heading, { props: { as: 'h2' } });
		expect(body).toContain('<h2');
	});

	it('renders <h3> with as="h3"', () => {
		const { body } = render(Heading, { props: { as: 'h3' } });
		expect(body).toContain('<h3');
	});

	it('renders <h6> with as="h6"', () => {
		const { body } = render(Heading, { props: { as: 'h6' } });
		expect(body).toContain('<h6');
	});

	it('applies margin from m prop', () => {
		const { body } = render(Heading, { props: { m: '10' } });
		expect(body).toContain('margin:10px');
	});

	it('applies margin-top from mt prop', () => {
		const { body } = render(Heading, { props: { mt: '20' } });
		expect(body).toContain('margin-top:20px');
	});

	it('applies mx to marginLeft and marginRight', () => {
		const { body } = render(Heading, { props: { mx: '15' } });
		expect(body).toContain('margin-left:15px');
		expect(body).toContain('margin-right:15px');
	});

	it('allows custom style to merge with margin styles', () => {
		const { body } = render(Heading, {
			props: { mt: '10', style: { color: 'red' } }
		});
		expect(body).toContain('margin-top:10px');
		expect(body).toContain('color:red');
	});

	it('accepts class prop', () => {
		const { body } = render(Heading, {
			props: { class: 'title' }
		});
		expect(body).toContain('class="title"');
	});

	it('spreads rest props', () => {
		const { body } = render(Heading, {
			props: { id: 'main-heading' }
		});
		expect(body).toContain('id="main-heading"');
	});
});
