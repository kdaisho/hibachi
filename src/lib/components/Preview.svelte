<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { styleToString } from '$lib/utils';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		preview?: string;
	}

	let { preview = '', ...rest }: Props = $props();

	const renderWhiteSpace = (text: string) => {
		const whiteSpaceCodes = '\xa0\u200C\u200B\u200D\u200E\u200F\uFEFF';
		return whiteSpaceCodes.repeat(Math.max(0, 150 - text.length));
	};
</script>

<div
	id="__hibachi-preview"
	style={styleToString({
		display: 'none',
		overflow: 'hidden',
		lineHeight: '1px',
		opacity: 0,
		maxHeight: 0,
		maxWidth: 0
	})}
	{...rest}
>
	{preview}
	<div>
		{renderWhiteSpace(preview)}
	</div>
</div>
