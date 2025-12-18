<script lang="ts">
	import { language, translations } from '$lib/stores/language';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { Project } from '$lib/types/project';
	import type { PageData } from './$types';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	
	export let data: PageData;
	$: t = translations[$language];

	$: projects = data.projects;
	$: allTechColors = data.techColors;

	// Get unique technologies from all projects
	$: allTechnologies = [...new Set(projects.flatMap(p => p.technologies))].sort();

	let selectedTech: string = '';

	onMount(() => {
		const techParam = $page.url.searchParams.get('tech');
		if (techParam && allTechnologies.includes(techParam)) {
			selectedTech = techParam;
		}
	});

	$: filteredProjects = selectedTech 
		? projects.filter((project: Project) => project.technologies.includes(selectedTech))
		: projects;

	function selectTechnology(tech: string): void {
		selectedTech = selectedTech === tech ? '' : tech;
	}

	function getTechColor(tech: string): string {
		return allTechColors[tech] || '#666666';
	}
</script>

<div class="projects-header">
	<h1>{t.projects.title}</h1>
	<p>{t.projects.description}</p>
</div>

<div class="tech-filter">
	<div class="tech-buttons">
		{#each allTechnologies as tech}
			<button 
				class="tech-button" 
				class:active={selectedTech === tech}
				style="--tech-color: {getTechColor(tech)}"
				on:click={() => selectTechnology(tech)}
			>
				{tech}
			</button>
		{/each}
	</div>
</div>

<div class="projects-container">
	{#each filteredProjects as project}
		<ProjectCard {project} {getTechColor} selectedTech={selectedTech} onTechClick={selectTechnology} />
	{/each}
</div>

<style>
	.projects-header {
		text-align: center;
		margin-bottom: 3rem;
		padding: 0 1rem;
	}

	.projects-header h1 {
		color: var(--text-primary);
		font-size: clamp(2rem, 5vw, 3rem);
	}

	.projects-header p {
		color: var(--text-secondary);
		max-width: 600px;
		margin: 1rem auto;
		font-size: clamp(1rem, 3vw, 1.2rem);
	}

	.tech-filter {
		max-width: 1200px;
		margin: 0 auto 2rem;
		padding: 0 1rem;
	}

	.tech-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		justify-content: center;
	}

	.tech-button {
		background: var(--bg-secondary);
		color: var(--text-primary);
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 20px;
		cursor: pointer;
		font-size: 0.9rem;
		transition: all 0.3s ease;
		border-left: 3px solid var(--tech-color);
	}

	.tech-button:hover, .tech-button.active {
		background-color: var(--tech-color);
		color: white;
		transform: translateY(-2px);
		box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
	}

	.projects-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 2rem;
		padding: 0 1rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	@media (max-width: 480px) {
		.projects-container {
			gap: 1.5rem;
		}

		.tech-buttons {
			gap: 0.35rem;
		}

		.tech-button {
			padding: 0.35rem 0.75rem;
			font-size: 0.8rem;
		}
	}
</style>
