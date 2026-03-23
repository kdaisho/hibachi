import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import Section from '$lib/components/Section.svelte';

describe('Section', () => {
	it('renders <table> element', () => {
		const { body } = render(Section);
		expect(body).toContain('<table');
	});

	it('has role="presentation"', () => {
		const { body } = render(Section);
		expect(body).toContain('role="presentation"');
	});

	it('has border="0" cellpadding="0" cellspacing="0"', () => {
		const { body } = render(Section);
		expect(body).toContain('border="0"');
		expect(body).toContain('cellpadding="0"');
		expect(body).toContain('cellspacing="0"');
	});

	it('has default width:100% style', () => {
		const { body } = render(Section);
		expect(body).toContain('width:100%');
	});

	it('has grid styles on <tr>', () => {
		const { body } = render(Section);
		expect(body).toContain('grid-auto-columns:minmax(0, 1fr)');
		expect(body).toContain('grid-auto-flow:column');
	});

	it('renders <tbody><tr> inside table', () => {
		const { body } = render(Section);
		expect(body).toContain('<tbody>');
		expect(body).toContain('<tr');
	});

	it('allows custom style to override defaults', () => {
		const { body } = render(Section, {
			props: { style: { width: '50%' } }
		});
		expect(body).toContain('width:50%');
	});

	it('accepts class prop', () => {
		const { body } = render(Section, {
			props: { class: 'email-section' }
		});
		expect(body).toContain('class="email-section"');
	});

	it('spreads rest props onto <table>', () => {
		const { body } = render(Section, {
			props: { id: 'main-section' }
		});
		expect(body).toContain('id="main-section"');
	});
});
