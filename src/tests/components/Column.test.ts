import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import Column from '$lib/components/Column.svelte';

describe('Column', () => {
	it('renders <td> element', () => {
		const { body } = render(Column);
		expect(body).toContain('<td');
	});

	it('has role="presentation"', () => {
		const { body } = render(Column);
		expect(body).toContain('role="presentation"');
	});

	it('has default display:inline-flex style', () => {
		const { body } = render(Column);
		expect(body).toContain('display:inline-flex');
	});

	it('has default justify-content:center style', () => {
		const { body } = render(Column);
		expect(body).toContain('justify-content:center');
	});

	it('has default align-items:center style', () => {
		const { body } = render(Column);
		expect(body).toContain('align-items:center');
	});

	it('allows custom style to override defaults', () => {
		const { body } = render(Column, {
			props: { style: { display: 'block' } }
		});
		expect(body).toContain('display:block');
	});

	it('accepts class prop', () => {
		const { body } = render(Column, {
			props: { class: 'col' }
		});
		expect(body).toContain('class="col"');
	});

	it('spreads rest props onto <td>', () => {
		const { body } = render(Column, {
			props: { id: 'col-1' }
		});
		expect(body).toContain('id="col-1"');
	});
});
