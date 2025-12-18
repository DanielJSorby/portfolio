<script>
	import '../app.css';
	import '$lib/cursor.js';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import LanguageToggle from '$lib/components/LanguageToggle.svelte';
	import ScrollProgress from '$lib/components/ScrollProgress.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { theme } from '$lib/stores/theme';
	import { language, translations } from '$lib/stores/language';
	import { startHeroAnimation } from '$lib/stores/animation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	export let data;
	$: t = translations[$language];

	let lastScrollY = 0;
	let isNavVisible = true;
	let isMobileMenuOpen = false;
	let isLoading = true;
	let loadingProgress = 0;

	function waitForImages() {
		return new Promise((resolve) => {
			const images = document.querySelectorAll('img');
			let loadedImages = 0;
			const totalImages = images.length;

			function updateProgress() {
				loadedImages++;
				loadingProgress = (loadedImages / totalImages) * 100;
				if (loadedImages === totalImages) resolve();
			}

			if (totalImages === 0) resolve();

			images.forEach(img => {
				if (img.complete) {
					updateProgress();
				} else {
					img.addEventListener('load', updateProgress);
					img.addEventListener('error', updateProgress);
				}
			});
		});
	}

	onMount(async () => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			isNavVisible = lastScrollY > currentScrollY || currentScrollY < 50;
			lastScrollY = currentScrollY;
		};

		window.addEventListener('scroll', handleScroll, { passive: true });

		// Simulate minimum loading time and wait for images
		await Promise.all([
			waitForImages(),
			new Promise(resolve => setTimeout(resolve, 1000)) // Minimum 1 second loading time
		]);

		isLoading = false;
		document.body.style.overflow = 'auto';
		
		// Start hero animation after loading screen fades out
		setTimeout(() => {
			startHeroAnimation.set(true);
		}, 500);

		return () => {
			window.removeEventListener('scroll', handleScroll);
			document.body.style.overflow = 'auto'; // Ensure overflow is restored on unmount
		};
	});

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
		if (isMobileMenuOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	}

	function closeMobileMenu() {
		isMobileMenuOpen = false;
		document.body.style.overflow = '';
	}
</script>

{#if !isLoading}
	<ScrollProgress />
{/if}

{#if isLoading}
	<div class="loading-screen">
		<div class="loading-content">
			<div class="loading-text">
				<span class="letter" style="--delay: 0s">D</span>
				<span class="letter" style="--delay: 0.1s">a</span>
				<span class="letter" style="--delay: 0.2s">n</span>
				<span class="letter" style="--delay: 0.3s">i</span>
				<span class="letter" style="--delay: 0.4s">e</span>
				<span class="letter" style="--delay: 0.5s">l</span>
				<span class="letter space" style="--delay: 0.6s"> </span>
				<span class="letter" style="--delay: 0.7s">J</span>
				<span class="letter" style="--delay: 0.8s">o</span>
				<span class="letter" style="--delay: 0.9s">h</span>
				<span class="letter" style="--delay: 1s">a</span>
				<span class="letter" style="--delay: 1.1s">n</span>
				<span class="letter space" style="--delay: 1.2s"> </span>
				<span class="letter" style="--delay: 1.3s">S</span>
				<span class="letter" style="--delay: 1.4s">ø</span>
				<span class="letter" style="--delay: 1.5s">r</span>
				<span class="letter" style="--delay: 1.6s">b</span>
				<span class="letter" style="--delay: 1.7s">y</span>
			</div>
			<div class="loading-bar">
				<div class="loading-progress" style="transform: scaleX({loadingProgress / 100})"></div>
			</div>
		</div>
	</div>
{/if}

<!-- Dekorative elementer -->
<div class="background-shapes">
	<div class="shape shape-1"></div>
	<div class="shape shape-2"></div>
	<div class="shape shape-3"></div>
</div>

<nav class:hidden={!isNavVisible}>
	<div class="nav-container">
		<a href="/" class="logo">Daniel Johan Sørby</a>
		<div class="nav-links">
			<a href="/" on:click={closeMobileMenu}>{t.nav.home}</a>
			<a href="/projects" on:click={closeMobileMenu}>{t.nav.projects}</a>
			<a href="/about" on:click={closeMobileMenu}>{t.nav.about}</a>
			<a href="/contact" on:click={closeMobileMenu}>{t.nav.contact}</a>
			{#if data.isLoggedIn}
				<a href="/admin" on:click={closeMobileMenu} class="admin-link">Admin</a>
			{/if}
			<div class="nav-controls">
				<ThemeToggle />
				<LanguageToggle />
			</div>
		</div>
		<div class="mobile-controls">
			<div class="mobile-toggles">
				<ThemeToggle />
				<LanguageToggle />
			</div>
			<button class="mobile-menu-button" on:click={toggleMobileMenu} aria-label="Toggle menu">
				<div class="hamburger" class:open={isMobileMenuOpen}>
					<span></span>
					<span></span>
					<span></span>
				</div>
			</button>
		</div>
		<button 
			class="mobile-menu-overlay" 
			class:open={isMobileMenuOpen} 
			on:click={closeMobileMenu}
			on:keydown={(e) => e.key === 'Escape' && closeMobileMenu()}
			aria-label={$language === 'no' ? 'Lukk meny' : 'Close menu'}
			tabindex="0"
		></button>
		<div class="mobile-menu" class:open={isMobileMenuOpen}>
			<div class="mobile-menu-wrapper">
				<div class="mobile-menu-links">
					<a href="/" on:click={closeMobileMenu}>{t.nav.home}</a>
					<a href="/projects" on:click={closeMobileMenu}>{t.nav.projects}</a>
					<a href="/about" on:click={closeMobileMenu}>{t.nav.about}</a>
					<a href="/contact" on:click={closeMobileMenu}>{t.nav.contact}</a>
					{#if data.isLoggedIn}
						<a href="/admin" on:click={closeMobileMenu} class="admin-link">Admin</a>
					{/if}
				</div>
				<div class="mobile-menu-controls">
					<ThemeToggle />
					<LanguageToggle />
				</div>
			</div>
		</div>
	</div>
</nav>

<main>
	<slot />
</main>

<Footer />

<style>
	.background-shapes {
		position: fixed;
		width: 100%;
		height: 100%;
		overflow: hidden;
		z-index: -1;
		opacity: 0.5;
		top: 0;
	}

	.shape {
		position: absolute;
		border-radius: 50%;
		filter: blur(40px);
	}

	.shape-1 {
		background: var(--accent-primary);
		width: 300px;
		height: 300px;
		top: -50px;
		right: -100px;
		animation: float 8s ease-in-out infinite;
		transform-origin: center center;
	}

	.shape-2 {
		background: var(--accent-secondary);
		width: 200px;
		height: 200px;
		bottom: 20%;
		left: -50px;
		animation: float 12s ease-in-out infinite;
	}

	.shape-3 {
		background: var(--nav-bg);
		width: 250px;
		height: 250px;
		bottom: 30%;
		right: 20%;
		animation: float 10s ease-in-out infinite reverse;
	}

	@keyframes float {
		0% {
			transform: translate(0, 0) rotate(0deg);
		}
		50% {
			transform: translate(20px, 20px) rotate(5deg);
		}
		100% {
			transform: translate(0, 0) rotate(0deg);
		}
	}

	nav {
		background-color: var(--nav-bg);
		box-shadow: var(--card-shadow);
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
		transition: transform 0.3s ease;
		backdrop-filter: blur(5px);
	}

	nav.hidden {
		transform: translateY(-100%);
	}

	.nav-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;
	}

	.mobile-menu-button {
		display: none;
		background: none;
		border: none;
		padding: 0.5rem;
		cursor: pointer;
		z-index: 1001;
	}

	.hamburger {
		width: 24px;
		height: 20px;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.hamburger span {
		display: block;
		width: 100%;
		height: 2px;
		background-color: var(--nav-text);
		transition: all 0.3s ease;
	}

	.hamburger.open span:nth-child(1) {
		transform: translateY(9px) rotate(45deg);
	}

	.hamburger.open span:nth-child(2) {
		opacity: 0;
	}

	.hamburger.open span:nth-child(3) {
		transform: translateY(-9px) rotate(-45deg);
	}

	.nav-links {
		display: flex;
		gap: 2rem;
		align-items: center;
	}

	.nav-controls {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.nav-links a {
		text-decoration: none;
		color: var(--nav-text);
		font-weight: 500;
		transition: all 0.3s ease;
		position: relative;
	}

	.nav-links a::after {
		content: '';
		position: absolute;
		width: 0;
		height: 2px;
		bottom: -4px;
		left: 0;
		background-color: var(--accent-primary);
		transition: width 0.3s ease;
	}

	.nav-links a:hover::after {
		width: 100%;
	}

	.logo {
		font-size: clamp(1.25rem, 4vw, 1.5rem);
		font-weight: bold;
		text-decoration: none;
		color: var(--nav-text);
		position: relative;
		z-index: 1001;
	}

	@media (max-width: 768px) {
		.mobile-menu-button {
			display: block;
		}

		.mobile-menu-overlay {
			display: block;
			pointer-events: none;
		}

		.mobile-menu-overlay.open {
			opacity: 1;
			pointer-events: auto;
		}

		.nav-links {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: var(--nav-bg);
			flex-direction: column;
			justify-content: center;
			align-items: center;
			padding: 2rem;
			
			gap: 2rem;
			transform: translateX(100%);
			transition: transform 0.3s ease;
			z-index: 1000;
		}

		.nav-links a {
			color: var(--nav-text);
			font-size: clamp(1.25rem, 4vw, 1.75rem);
			font-weight: 600;
			padding: 0.75rem 1.5rem;
			width: 100%;
			max-width: 250px;
			text-align: center;
			transition: all 0.3s ease;
			border-radius: 12px;
			background-color: rgba(var(--nav-bg-rgb), 0.1);
		}

		.nav-links a:hover {
			color: var(--accent-primary);
			transform: translateY(-2px);
			background-color: rgba(var(--nav-bg-rgb), 0.2);
		}

		.mobile-controls {
			display: flex;
		}

		.nav-controls {
			display: none;
		}
	}

	main {
		max-width: 1200px;
		margin: 0 auto;
		padding: clamp(1rem, 3vw, 2rem);
		min-height: calc(100vh - 160px);
		position: relative;
		z-index: 1;
		margin-top: 5rem;
	}

	@media (max-width: 480px) {
		.nav-container {
			padding: 0.75rem 1rem;
		}

		main {
			margin-top: 4rem;
		}
	}

	.mobile-menu-overlay {
		display: none;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.2);
		backdrop-filter: blur(120px);
		-webkit-backdrop-filter: blur(12px);
		opacity: 0;
		transition: opacity 0.3s ease;
		z-index: 999;
		border: none;
		cursor: pointer;
		padding: 0;
	}

	@media (max-width: 768px) {
		.mobile-controls {
			display: flex;
		}

		.nav-controls {
			display: none;
		}
	}

	.loading-screen {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: var(--bg-primary);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9999;
		animation: fadeOut 0.5s ease forwards;
		animation-delay: 2s;
	}

	.loading-content {
		text-align: center;
	}

	.loading-text {
		display: flex;
		justify-content: center;
		margin-bottom: 2rem;
		color: var(--accent-primary);
		font-size: clamp(1.5rem, 6vw, 3rem);
		font-weight: bold;
	}

	.letter {
		opacity: 0;
		transform: translateY(20px);
		animation: fadeInUp 0.5s ease forwards;
		animation-delay: var(--delay);
	}

	.letter.space {
		width: 0.5em;
	}

	.loading-bar {
		width: 200px;
		height: 4px;
		background-color: rgba(var(--accent-primary-rgb), 0.2);
		border-radius: 2px;
		overflow: hidden;
		margin: 0 auto;
	}

	.loading-progress {
		width: 100%;
		height: 100%;
		background-color: var(--accent-primary);
		transform-origin: left;
		animation: progress 2s ease forwards;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes progress {
		from {
			transform: scaleX(0);
		}
		to {
			transform: scaleX(1);
		}
	}

	@keyframes fadeOut {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
			visibility: hidden;
		}
	}

	.mobile-controls {
		display: none;
		align-items: center;
		gap: 1rem;
	}

	.mobile-toggles {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	@media (max-width: 768px) {
		.mobile-controls {
			display: flex;
		}

		.nav-controls {
			display: none;
		}
	}

	.mobile-menu {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: var(--nav-bg);
		transform: translateX(100%);
		transition: transform 0.3s ease;
		z-index: 1000;
		display: none;
	}

	.mobile-menu-wrapper {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: var(--nav-bg);
	}

	.mobile-menu-links {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		padding: 2rem;
		width: 100%;
		max-width: 300px;
	}

	.mobile-menu-controls {
		display: flex;
		gap: 1rem;
		margin-top: 2rem;
		padding: 1rem;
		border-radius: 12px;
	}

	.mobile-menu.open {
		transform: translateX(0);
	}

	@media (max-width: 768px) {
		.nav-links {
			display: none;
		}

		.mobile-menu {
			display: block;
		}

		.mobile-menu a {
			color: white;
			font-size: clamp(1.25rem, 4vw, 1.75rem);
			font-weight: 600;
			padding: 0.75rem 1.5rem;
			width: 100%;
			text-align: center;
			transition: all 0.3s ease;
			border-radius: 12px;
			background-color: var(--accent-primary);
			text-decoration: none;
		}

		.mobile-menu a:hover {
			background-color: var(--accent-secondary);
			transform: translateY(-2px);
			box-shadow: 0 5px 15px rgba(var(--accent-primary-rgb), 0.2);
		}
	}
</style> 