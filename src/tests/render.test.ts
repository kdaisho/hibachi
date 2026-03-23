import { describe, it, expect } from 'vitest';
import { render } from '$lib/render';
import TestComponent from './fixtures/TestComponent.svelte';

describe('render', () => {
	it('returns string containing XHTML 1.0 Transitional DOCTYPE', () => {
		const html = render({ template: TestComponent });
		expect(html).toContain(
			'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"'
		);
		expect(html).toContain(
			'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'
		);
	});

	it('renders HTML content from the component', () => {
		const html = render({ template: TestComponent });
		expect(html).toContain('<html');
		expect(html).toContain('Hello, World!');
	});

	it('passes props through to template component', () => {
		const html = render({
			template: TestComponent,
			props: { name: 'Alice' }
		});
		expect(html).toContain('Hello, Alice!');
	});

	it('returns indented HTML with pretty: true', () => {
		const html = render({
			template: TestComponent,
			options: { pretty: true }
		});
		expect(html).toContain('\n');
		expect(html).toContain('<!DOCTYPE');
	});

	it('returns plain text with plainText: true', () => {
		const text = render({
			template: TestComponent,
			options: { plainText: true }
		});
		expect(text).toContain('Hello, World!');
		expect(text).not.toContain('<p>');
		expect(text).not.toContain('<html');
	});

	it('strips images in plain text mode', () => {
		const text = render({
			template: TestComponent,
			options: { plainText: true }
		});
		expect(text).not.toContain('test.png');
		expect(text).not.toContain('<img');
	});

	it('strips preview element in plain text mode', () => {
		const text = render({
			template: TestComponent,
			options: { plainText: true }
		});
		expect(text).not.toContain('Preview text');
	});
});
