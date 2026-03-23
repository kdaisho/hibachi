<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { styleToString } from '$lib/utils';

	interface Props extends Omit<HTMLAttributes<HTMLBodyElement>, 'style'> {
		style?: Record<string, string | number | null>;
		children?: Snippet;
	}

	let { style = {}, class: className, children, ...rest }: Props = $props();
</script>

<body {...rest} style={styleToString(style)} class={className}>
	{@render children?.()}
</body>
