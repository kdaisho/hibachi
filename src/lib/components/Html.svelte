<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLAttributes<HTMLHtmlElement>, 'style'> {
		lang?: string;
		children?: Snippet;
	}

	let { lang = 'en', children, ...rest }: Props = $props();
</script>

<html {...rest} id="__svelte-email" {lang}>
	{@render children?.()}
</html>
