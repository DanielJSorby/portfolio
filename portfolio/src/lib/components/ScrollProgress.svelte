<script lang="ts">
	import { onMount } from 'svelte';

	let progress = 0;
	let progressBar: HTMLDivElement;

	function updateProgress() {
		const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
		progress = window.scrollY / windowHeight;
		if (progressBar) {
			progressBar.style.transform = `scaleX(${progress})`;
		}
	}

	onMount(() => {
		window.addEventListener('scroll', updateProgress, { passive: true });
		return () => window.removeEventListener('scroll', updateProgress);
	});
</script>

<div class="scroll-progress" bind:this={progressBar} />

<style>
	.scroll-progress {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 3px;
		background: linear-gradient(
			to right,
			var(--accent-primary),
			var(--accent-secondary)
		);
		transform-origin: left;
		transform: scaleX(0);
		z-index: 1001;
		filter: drop-shadow(0 0 5px rgba(var(--accent-primary-rgb), 0.3));
	}
</style> 