<script lang="ts">
	import { language, translations } from '$lib/stores/language';
	import { techColors } from '$lib/utils/techColors';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import GitHubActivity from '$lib/components/GitHubActivity.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	
	$: t = translations[$language];

	const skills = Object.entries(techColors).map(([name, color]) => ({ name, color }));

	const featuredProjects = [
		{
			"title": {
				"no": "Dasi GPT",
				"en": "Dasi GPT"
			},
			"description": {
				"no": "En ai chatbot som hjelper deg med alt du trenger!",
				"en": "An ai chatbot that helps you with everything you need!"
			},
			"technologies": [
				"Svelte Kit",
				"TypeScript",
				"OpenAI",
				"MySQL",
				"Linux",
				"Git",
				"Markdown",
				"JavaScript"
			],
			"image": "https://i.ibb.co/p1czy7q/Skjermbilde-2025-01-06-kl-18-47-33.png",
			"link": "https://github.com/DanielJSorby/DASI"
		},
		{
			"title": {
				"no": "Prime Wheels",
				"en": "Prime Wheels"
			},
			"description": {
				"no": "Et bilnettsted for å kjøpe biler. Laget som en skoleprosjekt.",
				"en": "A car website for buying cars. Made as a school project."
			},
			"technologies": ["HTML", "CSS", "JavaScript"],
			"image": "https://i.ibb.co/ZS6q8Kt/Skjermbilde-2025-01-06-kl-19-04-05.png",
			"link": "https://github.com/DanielJSorby/DanielOgSimen"
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

	onMount(() => {
		handleScroll();
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<div 
	class="hero"
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
        tabindex="1"
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
    :global(body) {
        min-height: 101vh;
        overflow-x: hidden;
        overflow-y: auto;
    }

    :global(main) {
        min-height: 101vh;
        overflow-y: auto;
    }

    .hero {
        min-height: 80vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    }

    .hero-content {
        text-align: center;
        max-width: 800px;
        margin: 0 auto;
    }

    .line {
        display: block;
        font-size: clamp(1.5rem, 6vw, 3rem);
    }

    .line2 {
        font-size: clamp(1rem, 4vw, 1.5rem);
        color: var(--text-secondary);
    }

    .hero-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;
        flex-wrap: wrap;
    }

    .cta-button {
        padding: 1rem 2rem;
        border-radius: 50px;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
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
</style>
