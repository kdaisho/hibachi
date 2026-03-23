<script lang="ts">
	let { name = 'World' }: { name?: string } = $props();
</script>

<html id="__svelte-email" lang="en">
	<body>
		<p>Hello, {name}!</p>
		<img src="test.png" alt="test" />
		<div id="__svelte-email-preview" style="display:none;">Preview text</div>
	</body>
</html>
