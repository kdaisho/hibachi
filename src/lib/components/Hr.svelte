<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { styleToString } from '$lib/utils';

	interface Props extends Omit<HTMLAttributes<HTMLHRElement>, 'style'> {
		style?: Record<string, string | number | null>;
	}

	let { style = {}, class: className, ...rest }: Props = $props();

	const styleDefault = $derived({
		width: '100%',
		border: 'none',
		borderTop: '1px solid #eaeaea',
		...style
	});
</script>

<hr style={styleToString(styleDefault)} {...rest} class={className} />
