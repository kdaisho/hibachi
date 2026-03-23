<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { styleToString } from '$lib/utils';

	interface Props extends Omit<HTMLAttributes<HTMLTableCellElement>, 'style'> {
		style?: Record<string, string | number | null>;
		children?: Snippet;
	}

	let { style = {}, class: className, children, ...rest }: Props = $props();

	const styleDefault = $derived({
		display: 'inline-flex',
		justifyContent: 'center',
		alignItems: 'center',
		...style
	});
</script>

<td style={styleToString(styleDefault)} role="presentation" {...rest} class={className}>
	{@render children?.()}
</td>
