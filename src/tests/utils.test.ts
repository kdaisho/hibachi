import { describe, it, expect } from 'vitest';
import { styleToString, pxToPt, withMargin } from '$lib/utils';

describe('styleToString', () => {
	it('converts camelCase to kebab-case', () => {
		const result = styleToString({ fontSize: '14px' });
		expect(result).toContain('font-size:14px');
	});

	it('joins multiple properties with semicolons', () => {
		const result = styleToString({ fontSize: '14px', lineHeight: '24px' });
		expect(result).toContain('font-size:14px;');
		expect(result).toContain('line-height:24px;');
	});

	it('preserves numeric values without adding px suffix', () => {
		const result = styleToString({ opacity: 0 });
		expect(result).toContain('opacity:0;');
	});

	it('handles null values', () => {
		const result = styleToString({ fontSize: '14px', color: null });
		expect(result).toContain('font-size:14px');
		expect(result).toContain('color:null');
	});
});

describe('pxToPt', () => {
	it('converts pixel string to point value', () => {
		expect(pxToPt('16')).toBe(12);
	});

	it('converts zero', () => {
		expect(pxToPt('0')).toBe(0);
	});

	it('returns null for non-numeric string', () => {
		expect(pxToPt('auto')).toBeNull();
	});
});

describe('withMargin', () => {
	it('converts m to margin in px', () => {
		const result = withMargin({ m: '10' });
		expect(result).toEqual({ margin: '10px' });
	});

	it('converts mx to marginLeft and marginRight', () => {
		const result = withMargin({ mx: '10' });
		expect(result).toEqual({ marginLeft: '10px', marginRight: '10px' });
	});

	it('converts my to marginTop and marginBottom', () => {
		const result = withMargin({ my: '10' });
		expect(result).toEqual({ marginTop: '10px', marginBottom: '10px' });
	});

	it('converts mt to marginTop', () => {
		const result = withMargin({ mt: '10' });
		expect(result).toEqual({ marginTop: '10px' });
	});

	it('converts mr to marginRight', () => {
		const result = withMargin({ mr: '10' });
		expect(result).toEqual({ marginRight: '10px' });
	});

	it('converts mb to marginBottom', () => {
		const result = withMargin({ mb: '10' });
		expect(result).toEqual({ marginBottom: '10px' });
	});

	it('converts ml to marginLeft', () => {
		const result = withMargin({ ml: '10' });
		expect(result).toEqual({ marginLeft: '10px' });
	});

	it('returns undefined for empty object', () => {
		const result = withMargin({});
		expect(result).toBeUndefined();
	});
});
