<script>
	import { language, translations } from '$lib/stores/language';
	import { startHeroAnimation } from '$lib/stores/animation';
	import { onMount } from 'svelte';
	
	$: t = translations[$language];

	const skills = [
		'JavaScript',
		'TypeScript',
		'Linux',
		'Svelte',
		'HTML',
		'CSS',
		'Python',
		'MySQL',
		'MariaDB',
		'Git',
		'XD',
        'Flask',
        'React',
		'Figma'
	];

	let sectionsVisible = {
		projects: false
	};

	function handleScroll() {
		const sections = document.querySelectorAll('.animate-on-scroll');
		sections.forEach(section => {
			const rect = section.getBoundingClientRect();
			const isVisible = rect.top <= window.innerHeight * 0.75;
			if (isVisible) {
				section.classList.add('visible');
			}
		});
	}

	onMount(() => {
		handleScroll();
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<div class="hero" class:visible={$startHeroAnimation}>
	<div class="hero-content">
		<h1 class="animated-title">
			<span class="line line1">{t.hero.title}</span>
			<span class="line line2">{t.hero.subtitle}</span>
		</h1>
		<div class="hero-buttons">
			<a href="/projects" class="cta-button primary">
				{t.nav.projects}
				<span class="arrow">→</span>
			</a>
			<a href="/contact" class="cta-button secondary">
				{t.nav.contact}
				<span class="arrow">→</span>
			</a>
		</div>
	</div>
	<div class="hero-background">
		<div class="circle circle1"></div>
		<div class="circle circle2"></div>
		<div class="circle circle3"></div>
	</div>
</div>

<div class="skills-container">
	<h2>{$language === 'no' ? 'Ferdigheter' : 'Skills'}</h2>
	<div class="skills-carousel">
		<div class="skills-track">
			{#each [...skills, ...skills, ...skills, ...skills] as skill}
				<div class="skill-box">
					{skill}
				</div>
			{/each}
		</div>
	</div>
</div>

<section class="featured">
	<h2>{$language === 'no' ? 'Utvalgte Prosjekter' : 'Featured Projects'}</h2>
	<div class="projects-grid">
		{#each [1, 2] as projectNum, i}
			<div class="project-card">
				<h3>{$language === 'no' ? `Prosjekt ${projectNum}` : `Project ${projectNum}`}</h3>
				<p>{$language === 'no' 
					? 'Beskrivelse av ditt fantastiske prosjekt kommer her.'
					: 'Description of your amazing project goes here.'}</p>
				<a href="/projects">{$language === 'no' ? 'Les Mer' : 'Read More'}</a>
			</div>
		{/each}
	</div>
	<div class="view-all">
		<a href="/projects" class="view-all-button">
			<span>{$language === 'no' ? 'Se alle prosjekter' : 'View all projects'}</span>
			<span class="arrow">→</span>
		</a>
	</div>
</section>

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
		border-left: 4px solid var(--accent-primary);
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
		background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
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
		padding: clamp(1.25rem, 3vw, 2rem);
		border-radius: 8px;
		box-shadow: var(--card-shadow);
		border-left: 4px solid var(--accent-primary);
		transition: transform 0.3s ease;
	}

	.project-card:hover {
		transform: translateY(-4px);
	}

	.project-card h3 {
		color: var(--text-primary);
		font-size: clamp(1.25rem, 4vw, 1.5rem);
		margin-bottom: clamp(0.5rem, 2vw, 1rem);
	}

	.project-card p {
		font-size: clamp(0.9rem, 2.5vw, 1rem);
		margin-bottom: clamp(1rem, 3vw, 1.5rem);
	}

	.project-card a {
		display: inline-block;
		margin-top: 1rem;
		text-decoration: none;
		color: var(--accent-primary);
		font-weight: 500;
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

	.animate-on-scroll {
		opacity: 0;
		transform: translateY(30px);
		transition: opacity 0.8s ease, transform 0.8s ease;
	}

	.animate-on-scroll.visible {
		opacity: 1;
		transform: translateY(0);
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
</style>
