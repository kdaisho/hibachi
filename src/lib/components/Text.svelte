<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { styleToString } from '$lib/utils';

	interface Props extends Omit<HTMLAttributes<HTMLParagraphElement>, 'style'> {
		style?: Record<string, string | number | null>;
		children?: Snippet;
	}

	let { style = {}, class: className, children, ...rest }: Props = $props();

	const styleDefault = $derived({
		fontSize: '14px',
		lineHeight: '24px',
		margin: '16px 0',
		...style
	});
</script>

<p style={styleToString(styleDefault)} {...rest} class={className}>
	{@render children?.()}
</p>
