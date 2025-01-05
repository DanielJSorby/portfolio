<script lang="ts">
	import { language, translations } from '$lib/stores/language';
	import { startHeroAnimation } from '$lib/stores/animation';
	import { techColors } from '$lib/utils/techColors';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import GitHubActivity from '$lib/components/GitHubActivity.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	
	$: t = translations[$language];

	const skills = Object.entries(techColors).map(([name, color]) => ({ name, color }));

	const featuredProjects = [
		{
			title: {
				no: 'Dasi GPT',
				en: 'Dasi GPT'
			},
			description: {
				no: 'En ai chatbot som hjelper deg med alt du trenger!',
				en: 'An ai chatbot that helps you with everything you need!'
			},
			technologies: ['Svelte Kit', 'TypeScript', 'OpenAI', 'MySQL', 'Linux', 'Git', 'Markdown', 'Javascript'],
			image: 'https://picsum.photos/seed/dasi/800/400',
			link: 'https://github.com/DanielJSorby/DASI'
		},
		{
			title: {
				no: 'Prime Wheels',
				en: 'Prime Wheels'
			},
			description: {
				no: 'Et bilnettsted for å kjøpe biler. Laget som en skoleprosjekt.',
				en: 'A car website for buying cars. Made as a school project.'
			},
			technologies: ['HTML', 'CSS', 'JavaScript'],
			image: 'https://picsum.photos/seed/primewheels/800/400',
			link: 'https://github.com/DanielJSorby/DanielOgSimen'
		}
	];

	let sectionsVisible = {
		projects: false
	};

	let showScrollTop = false;

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function handleScroll() {
		const sections = document.querySelectorAll('.animate-on-scroll');
		sections.forEach(section => {
			const rect = section.getBoundingClientRect();
			const isVisible = rect.top <= window.innerHeight * 0.75;
			if (isVisible) {
				section.classList.add('visible');
			}
		});
		showScrollTop = window.scrollY > 500;
	}

	interface Skill {
		name: string;
		color: string;
	}

	function handleSkillClick(skill: Skill) {
		goto(`/projects?tech=${encodeURIComponent(skill.name)}`);
	}

	function getTechColor(tech: string): string {
		return tech in techColors ? techColors[tech as keyof typeof techColors] : '#666666';
	}

	const fallbackImage = '/images/placeholder.jpg';
	
	function handleImageError(event: Event) {
		const img = event.target as HTMLImageElement;
		img.src = fallbackImage;
	}

	function handleImageLoad(event: Event) {
		const img = event.target as HTMLImageElement;
		img.classList.add('loaded');
	}

	onMount(() => {
		handleScroll();
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<div 
	class="hero" 
	class:visible={$startHeroAnimation}
	role="banner"
	aria-label={$language === 'no' ? 'Helteseksjon' : 'Hero section'}
>
	<div class="hero-content">
		<h1 class="animated-title" tabindex="0">
			<span class="line line1">{t.hero.title}</span>
			<span class="line line2">{t.hero.subtitle}</span>
		</h1>
		<div class="hero-buttons" role="navigation" aria-label={$language === 'no' ? 'Hovednavigasjon' : 'Main navigation'}>
			<a href="/projects" class="cta-button primary" role="button">
				{t.nav.projects}
				<span class="arrow" aria-hidden="true">→</span>
			</a>
			<a href="/contact" class="cta-button secondary" role="button">
				{t.nav.contact}
				<span class="arrow" aria-hidden="true">→</span>
			</a>
		</div>
	</div>
	<div class="hero-background">
		<div class="circle circle1"></div>
		<div class="circle circle2"></div>
		<div class="circle circle3"></div>
	</div>
</div>


<div 
class="skills-container" 
role="region" 
aria-label={$language === 'no' ? 'Ferdigheter' : 'Skills'}
>
<h2 tabindex="0">{$language === 'no' ? 'Ferdigheter' : 'Skills'}</h2>
<div class="skills-carousel">
    <div class="skills-track">
        {#each [...skills, ...skills, ...skills, ...skills] as skill}
        <div 
        class="skill-box" 
        style="--skill-color: {skill.color}"
        on:click={() => handleSkillClick(skill)}
        on:keydown={(e) => e.key === 'Enter' && handleSkillClick(skill)}
        role="button"
        tabindex="0"
        aria-label={$language === 'no' ? `Klikk for å se ${skill.name} prosjekter` : `Click to see ${skill.name} projects`}
        >
        {skill.name}
    </div>
    {/each}
</div>
</div>
</div>

<section 
	class="featured" 
	role="region" 
	aria-label={$language === 'no' ? 'Utvalgte Prosjekter' : 'Featured Projects'}
>
	<h2 tabindex="0">{$language === 'no' ? 'Utvalgte Prosjekter' : 'Featured Projects'}</h2>
	<div class="projects-grid">
		{#each featuredProjects as project}
			<ProjectCard {project} />
		{/each}
	</div>
	<div class="view-all">
		<a 
			href="/projects" 
			class="view-all-button"
			role="button"
			aria-label={$language === 'no' ? 'Se alle prosjekter' : 'View all projects'}
		>
			<span>{$language === 'no' ? 'Se alle prosjekter' : 'View all projects'}</span>
			<span class="arrow" aria-hidden="true">→</span>
		</a>
	</div>
</section>

<GitHubActivity />

{#if showScrollTop}
<button 
class="scroll-top-button" 
on:click={scrollToTop}
aria-label={$language === 'no' ? 'Tilbake til toppen' : 'Back to top'}
>
<span aria-hidden="true">↑</span>
</button>
{/if}

<style>
    .hero {
        min-height: 80vh;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
		padding: clamp(1rem, 5vw, 2rem);
		opacity: 0;
		transform: translateY(20px);
		border-radius: clamp(50px, 15vw, 200px);
		transition: opacity 0.8s ease, transform 0.8s ease;
	}

	.hero.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.hero-content {
		text-align: center;
		z-index: 2;
		max-width: min(800px, 90vw);
	}

	.animated-title {
		display: flex;
		flex-direction: column;
		gap: clamp(0.5rem, 2vw, 1rem);
		margin-bottom: clamp(1rem, 4vw, 2rem);
	}

	.line {
		display: block;
		opacity: 0;
		transform: translateY(30px);
		transition: opacity 0.8s ease, transform 0.8s ease;
		transition-delay: 0.2s;
		font-size: clamp(1.5rem, 6vw, 3rem);
	}

	.line2 {
		font-size: clamp(1rem, 4vw, 1.5rem);
		color: var(--text-secondary);
		transition-delay: 0.4s;
		text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	.visible .line {
		opacity: 1;
		transform: translateY(0);
	}

	.hero-buttons {
		display: flex;
		gap: clamp(0.5rem, 2vw, 1rem);
		justify-content: center;
		margin-top: clamp(1rem, 4vw, 2rem);
		opacity: 0;
		transform: translateY(20px);
		transition: opacity 0.8s ease, transform 0.8s ease;
		transition-delay: 0.6s;
		flex-wrap: wrap;
	}

	.visible .hero-buttons {
		opacity: 1;
		transform: translateY(0);
	}

	.cta-button {
		padding: clamp(0.75rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2rem);
		border-radius: 50px;
		text-decoration: none;
		font-weight: 600;
		transition: all 0.3s ease;
		position: relative;
		overflow: hidden;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-size: clamp(0.9rem, 2.5vw, 1rem);
	}

	.cta-button.primary {
		background: var(--accent-primary);
		color: white;
	}

	.cta-button.secondary {
		background: transparent;
		color: var(--text-primary);
		border: 2px solid var(--accent-primary);
	}

	.arrow {
		transition: transform 0.3s ease;
	}

	.cta-button:hover .arrow {
		transform: translateX(5px);
	}

	.cta-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 5px 15px rgba(var(--accent-primary-rgb), 0.2);
	}

	.hero-background {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 1;
		overflow: hidden;
		pointer-events: none;
	}

	.circle {
		position: absolute;
		border-radius: 50%;
		filter: blur(80px);
		opacity: 0.2;
		animation: float 20s infinite;
	}

	.circle1 {
		background: var(--accent-primary);
		width: 600px;
		height: 600px;
		top: -200px;
		right: -100px;
		animation-delay: 0s;
	}

	.circle2 {
		background: var(--accent-secondary);
		width: 500px;
		height: 500px;
		bottom: -100px;
		left: -100px;
		animation-delay: -5s;
	}

	.circle3 {
		background: var(--nav-bg);
		width: 400px;
		height: 400px;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		animation-delay: -10s;
	}

	@keyframes float {
		0%, 100% {
			transform: translate(0, 0) rotate(0deg);
		}
		33% {
			transform: translate(30px, 30px) rotate(5deg);
		}
		66% {
			transform: translate(-20px, 20px) rotate(-5deg);
		}
	}

	.skills-container {
		max-width: 100%;
		margin: 4rem auto;
		padding: 2rem;
		position: relative;
		z-index: 10;
		overflow: hidden;
	}

	.skills-container h2 {
		text-align: center;
		font-size: 2.5rem;
		margin-bottom: 2rem;
		color: var(--text-primary);
		padding: 0 2rem;
		background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.skills-carousel {
		width: 100%;
		overflow: hidden;
		position: relative;
		padding: 1rem 0;
		z-index: 10;
	}

	.skills-track {
		display: flex;
		gap: 2rem;
		animation: scroll 60s linear infinite;
		padding: 1rem;
		width: max-content;
		position: relative;
		z-index: 10;
		transition: animation-play-state 0.5s ease;
	}

	.skills-carousel:hover .skills-track {
		animation-play-state: paused;
		transition: all 0.5s ease;
	}

	@keyframes scroll {
		0% {
			transform: translateX(calc(-25%));
		}
		100% {
			transform: translateX(calc(-75%));
		}
	}

	.skill-box {
		background: var(--bg-secondary);
		padding: 1.5rem 2rem;
		border-radius: 12px;
		text-align: center;
		color: var(--text-primary);
		font-size: 1.1rem;
		box-shadow: var(--card-shadow);
		border-left: 4px solid var(--skill-color);
		transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
		white-space: nowrap;
		flex-shrink: 0;
		min-width: 150px;
		position: relative;
		z-index: 10;
		cursor: pointer;
		overflow: hidden;
	}

	.skill-box::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: var(--skill-color);
		opacity: 0;
		transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: -1;
	}

	.skill-box:hover {
		transform: translateY(-6px);
		color: white;
		border-left-color: transparent;
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
	}

	.skill-box:hover::before {
		opacity: 1;
	}

	@media (max-width: 768px) {
		.skills-track {
			animation-duration: 40s;
			gap: 1rem;
		}

		.skill-box {
			padding: 1rem 1.5rem;
			font-size: 1rem;
			min-width: 120px;
		}
	}

	.featured {
		padding: clamp(2rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem);
	}

	.featured h2 {
		text-align: center;
		margin-bottom: clamp(1.5rem, 4vw, 3rem);
		font-size: clamp(1.5rem, 5vw, 2.5rem);
	}

	.projects-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: clamp(1rem, 3vw, 2rem);
		max-width: 1200px;
		margin: 0 auto;
	}

	.project-card {
		background-color: var(--bg-secondary);
		border-radius: 20px;
		box-shadow: var(--card-shadow);
		overflow: hidden;
		border: 2px solid transparent;
		position: relative;
		z-index: 1;
		width: 100%;
		transition: transform 0.3s ease;
	}

	.project-card:hover {
		transform: translateY(-8px);
		border-color: var(--accent-primary);
	}

	.project-image {
		width: 100%;
		height: 200px;
		overflow: hidden;
		border-radius: 18px 18px 0 0;
		position: relative;
		background: var(--bg-secondary);
	}

	.image-skeleton {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(
			90deg,
			var(--bg-secondary) 0%,
			var(--nav-bg) 50%,
			var(--bg-secondary) 100%
		);
		background-size: 200% 100%;
		animation: shimmer 1.5s infinite;
	}

	.project-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease, opacity 0.3s ease;
		opacity: 0;
	}

	.project-image img.loaded {
		opacity: 1;
	}

	@keyframes shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	.project-card:hover .project-image img {
		transform: scale(1.05);
	}

	.project-content {
		padding: 1.5rem;
	}

	.project-content h3 {
		color: var(--text-primary);
		margin-bottom: 1rem;
		font-size: clamp(1.25rem, 4vw, 1.5rem);
	}

	.project-content p {
		color: var(--text-secondary);
		margin-bottom: 1rem;
		font-size: clamp(0.9rem, 3vw, 1rem);
	}

	.tech-stack {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 1rem 0;
	}

	.tech-tag {
		background-color: var(--nav-bg);
		color: var(--nav-text);
		padding: 0.25rem 0.75rem;
		border-radius: 16px;
		font-size: clamp(0.75rem, 2vw, 0.875rem);
		transition: all 0.3s ease;
		border-left: 3px solid var(--tech-color);
	}

	.tech-tag:hover {
		background-color: var(--tech-color);
		color: white;
		transform: translateY(-2px);
		box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
	}

	.view-all {
		text-align: center;
		margin-top: clamp(2rem, 5vw, 3rem);
	}

	.view-all-button {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		font-size: clamp(0.9rem, 2.5vw, 1rem);
		padding: clamp(0.75rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2rem);
		background-color: var(--accent-primary);
		color: white;
		text-decoration: none;
		border-radius: 50px;
		font-weight: 600;
		transition: all 0.3s ease;
		position: relative;
		overflow: hidden;
	}

	.view-all-button::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(
			45deg,
			var(--accent-primary),
			var(--accent-secondary)
		);
		opacity: 0;
		transition: opacity 0.3s ease;
		z-index: 1;
	}

	.view-all-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 5px 15px rgba(var(--accent-primary-rgb), 0.3);
	}

	.view-all-button:hover::before {
		opacity: 1;
	}

	.view-all-button .arrow {
		transition: transform 0.3s ease;
		position: relative;
		z-index: 2;
	}

	.view-all-button span {
		position: relative;
		z-index: 2;
	}

	.view-all-button:hover .arrow {
		transform: translateX(5px);
	}

	@media (max-width: 768px) {
		.view-all-button {
			width: 100%;
			max-width: 300px;
			justify-content: center;
		}
	}

	.scroll-top-button {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		background: var(--accent-primary);
		color: white;
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
		z-index: 100;
		opacity: 0;
		animation: fadeIn 0.3s ease forwards;
	}

	.scroll-top-button:hover {
		transform: translateY(-3px);
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
		background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 768px) {
		.scroll-top-button {
			bottom: 1.5rem;
			right: 1.5rem;
			width: 2.5rem;
			height: 2.5rem;
			font-size: 1.2rem;
		}
	}

	/* Add focus styles for better keyboard navigation */
	:global(*:focus-visible) {
		outline: 3px solid var(--accent-primary);
		outline-offset: 2px;
		border-radius: 4px;
	}

	/* Ensure sufficient color contrast */
	.tech-tag {
		color: var(--text-primary);
		background-color: var(--bg-secondary);
	}

	/* Improve link underlines for better visibility */
	.project-link {
		text-decoration-thickness: 2px;
		text-underline-offset: 2px;
	}
</style>
