<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { pxToPt, styleToString } from '$lib/utils';

	interface Props extends Omit<HTMLAttributes<HTMLAnchorElement>, 'style'> {
		style?: Record<string, string | number | null>;
		href?: string;
		target?: string;
		pX?: number;
		pY?: number;
		children?: Snippet;
	}

	let { href = '', style = {}, class: className, pX = 0, pY = 0, target = '_blank', children, ...rest }: Props = $props();

	const y = $derived(pY * 2);
	const textRaise = $derived(pxToPt(y.toString()));

	const buttonStyle = (style: Record<string, string | number | null> & { pY?: number; pX?: number }) => {
		const paddingY = style?.pY || 0;
		const paddingX = style?.pX || 0;

		return {
			...style,
			lineHeight: '100%',
			textDecoration: 'none',
			display: 'inline-block',
			maxWidth: '100%',
			padding: `${paddingY}px ${paddingX}px`
		};
	};

	const buttonTextStyle = (style: Record<string, string | number | null> & { pY?: number; pX?: number }) => {
		const paddingY = style?.pY || 0;

		return {
			...style,
			maxWidth: '100%',
			display: 'inline-block',
			lineHeight: '120%',
			textDecoration: 'none',
			textTransform: 'none' as const,
			msoPaddingAlt: '0px',
			msoTextRaise: pxToPt(paddingY.toString())
		};
	};
</script>

<a {...rest} {href} {target} style={styleToString(buttonStyle({ ...style, pX, pY }))} class={className}>
	<span>
		{@html `<!--[if mso]><i style="letter-spacing: ${pX}px;mso-font-width:-100%;mso-text-raise:${textRaise}" hidden>&nbsp;</i><![endif]-->`}
	</span>
	<span style={styleToString(buttonTextStyle({ ...style, pX, pY }))}>
		{@render children?.()}
	</span>
	<span>
		{@html `<!--[if mso]><i style="letter-spacing: ${pX}px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]-->`}
	</span>
</a>
