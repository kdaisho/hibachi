<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLHeadElement> {
		children?: Snippet;
	}

	let { children, ...rest }: Props = $props();
</script>

<head {...rest}>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
	{@render children?.()}
</head>
