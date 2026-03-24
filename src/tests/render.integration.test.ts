import { describe, it, expect } from 'vitest';
import { render } from '$lib/render';
import FullEmail from './fixtures/FullEmail.svelte';

describe('render integration', () => {
	it('renders full email with DOCTYPE', () => {
		const html = render({ template: FullEmail });
		expect(html).toContain('<!DOCTYPE html PUBLIC');
		expect(html).toContain('XHTML 1.0 Transitional');
	});

	it('renders <html> with lang attribute', () => {
		const html = render({ template: FullEmail });
		expect(html).toContain('<html');
		expect(html).toContain('lang="en"');
	});

	it('renders <head> with meta charset', () => {
		const html = render({ template: FullEmail });
		expect(html).toContain('<head');
		expect(html).toContain('UTF-8');
	});

	it('renders <body> with styles', () => {
		const html = render({ template: FullEmail });
		expect(html).toContain('<body');
		expect(html).toContain('background-color:#ffffff');
	});

	it('renders Container with MSO comments', () => {
		const html = render({ template: FullEmail });
		expect(html).toContain('<!--[if mso | IE]>');
		expect(html).toContain('max-width:37.5em');
	});

	it('renders Section with table markup', () => {
		const html = render({ template: FullEmail });
		expect(html).toContain('role="presentation"');
		expect(html).toContain('<table');
		expect(html).toContain('<tbody>');
	});

	it('renders all content components', () => {
		const html = render({ template: FullEmail });
		expect(html).toContain('<h1');
		expect(html).toContain('Hello, World!');
		expect(html).toContain('<p');
		expect(html).toContain('<a');
		expect(html).toContain('Click me');
		expect(html).toContain('<img');
		expect(html).toContain('<hr');
		expect(html).toContain('__hibachi-preview');
	});

	it('passes props through', () => {
		const html = render({ template: FullEmail, props: { firstName: 'Alice' } });
		expect(html).toContain('Hello, Alice!');
	});

	it('renders plain text with images and preview stripped', () => {
		const text = render({ template: FullEmail, options: { plainText: true } });
		expect(text.toLowerCase()).toContain('hello, world!');
		expect(text).toContain('This is a test email');
		expect(text).not.toContain('<html');
		expect(text).not.toContain('<img');
		expect(text).not.toContain('Welcome to hibachi');
	});

	it('renders pretty HTML with newlines', () => {
		const html = render({ template: FullEmail, options: { pretty: true } });
		expect(html).toContain('\n');
		expect(html).toContain('<!DOCTYPE');
	});
});
