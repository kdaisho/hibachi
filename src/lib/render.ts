import { convert } from 'html-to-text';
import pretty from 'pretty';
import { render as svelteRender } from 'svelte/server';
import type { Component } from 'svelte';

export const render = ({
	template,
	props,
	options
}: {
	template: Component<any>;
	props?: Record<string, any>;
	options?: {
		plainText?: boolean;
		pretty?: boolean;
	};
}): string => {
	const { body } = svelteRender(template, { props });
	if (options?.plainText) {
		return renderAsPlainText(body);
	}
	const doctype =
		'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
	const document = `${doctype}${body}`;
	if (options?.pretty) {
		return pretty(document);
	}
	return document;
};

const renderAsPlainText = (markup: string) => {
	return convert(markup, {
		selectors: [
			{ selector: 'img', format: 'skip' },
			{ selector: '#__svelte-email-preview', format: 'skip' }
		]
	});
};
