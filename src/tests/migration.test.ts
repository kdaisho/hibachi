import { describe, it, expect } from 'vitest';
import { render } from '$lib/render';
import WelcomeEmail from './fixtures/WelcomeEmail.svelte';

describe('migration from svelte-email', () => {
	it('welcome email renders with DOCTYPE', () => {
		const html = render({ template: WelcomeEmail });
		expect(html).toContain('<!DOCTYPE html PUBLIC');
	});

	it('welcome email contains expected structure', () => {
		const html = render({ template: WelcomeEmail });
		expect(html).toContain('<html');
		expect(html).toContain('lang="en"');
		expect(html).toContain('<head');
		expect(html).toContain('UTF-8');
	});

	it('welcome email renders preview text', () => {
		const html = render({ template: WelcomeEmail });
		expect(html).toContain('Welcome to svelte-email');
		expect(html).toContain('__svelte-email-preview');
	});

	it('welcome email renders Container with MSO comments', () => {
		const html = render({ template: WelcomeEmail });
		expect(html).toContain('<!--[if mso | IE]>');
		expect(html).toContain('max-width:37.5em');
	});

	it('welcome email renders dynamic firstName prop', () => {
		const html = render({ template: WelcomeEmail, props: { firstName: 'Alice' } });
		expect(html).toContain('Alice, welcome to svelte-email');
	});

	it('welcome email renders Button with MSO padding', () => {
		const html = render({ template: WelcomeEmail });
		expect(html).toContain('View on GitHub');
		expect(html).toContain('<!--[if mso]>');
		expect(html).toContain('padding:12px 12px');
	});

	it('welcome email renders Img component', () => {
		const html = render({ template: WelcomeEmail });
		expect(html).toContain('src="https://svelte.dev/svelte-logo-horizontal.svg"');
		expect(html).toContain('alt="Svelte logo"');
	});

	it('welcome email renders Hr with custom style', () => {
		const html = render({ template: WelcomeEmail });
		expect(html).toContain('border-color:#cccccc');
	});

	it('welcome email produces valid plain text', () => {
		const text = render({ template: WelcomeEmail, options: { plainText: true } });
		expect(text).toContain('John, welcome to svelte-email');
		expect(text).toContain('Happy coding!');
		expect(text).not.toContain('<html');
		expect(text).not.toContain('Welcome to svelte-email\n'); // preview should be stripped
	});
});
